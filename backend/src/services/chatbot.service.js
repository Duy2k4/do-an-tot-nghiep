// Service chatbot: xây dựng context dữ liệu và gọi DeepSeek để trả lời người dùng.
const prisma = require('../utils/prisma');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ override: true });

const DEEPSEEK_MODEL = 'deepseek-v4-flash';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DB_CACHE_TTL = 10 * 60 * 1000;

let dbContextCache = { context: null, timestamp: 0 };

// Hàm buildDatabaseContext: gom dữ liệu điểm đến, tour, bài viết làm ngữ cảnh cho chatbot.
async function buildDatabaseContext() {
  try {
    const [destinations, tours, articles, categories] = await Promise.all([
      prisma.destination.findMany({
        where: { isActive: true },
        select: {
          name: true,
          slug: true,
          description: true,
          province: { select: { name: true, region: true } },
          category: { select: { name: true } },
          rating: true,
          estimatedCost: true,
        },
        take: 20,
      }),
      prisma.tour.findMany({
        where: { isActive: true },
        select: {
          name: true,
          duration: true,
          price: true,
          discountPrice: true,
          description: true,
        },
        take: 10,
      }),
      prisma.article.findMany({
        where: { isPublished: true },
        select: {
          title: true,
          excerpt: true,
          category: { select: { name: true } },
        },
        take: 5,
      }),
      prisma.destinationCategory.findMany({
        select: { name: true, slug: true },
        take: 10,
      }),
    ]);

    let context = 'THÔNG TIN DATABASE WEBSITE DU LỊCH QUẢNG BÁ:\n\n';
    context += '=== DANH MỤC ĐỊA ĐIỂM ===\n';
    categories.forEach(c => { context += `- ${c.name} (slug: ${c.slug})\n`; });
    context += '\n';

    context += '=== ĐỊA ĐIỂM DU LỊCH ===\n';
    destinations.forEach(d => {
      context += `- ${d.name} [card:${d.slug}] (${d.province?.name || 'N/A'}, ${d.province?.region || 'N/A'})\n`;
      context += `  Danh mục: ${d.category?.name || 'Khác'}\n`;
      context += `  Mô tả: ${d.description?.substring(0, 200) || 'Không có'}\n`;
      context += `  Rating: ${d.rating}/5 - Chi phí ước tính: ${d.estimatedCost || 'Liên hệ'}\n\n`;
    });

    context += '=== TOURS ===\n';
    tours.forEach(t => {
      context += `- ${t.name}\n`;
      context += `  Thời gian: ${t.duration || 'Liên hệ'}\n`;
      context += `  Giá: ${t.discountPrice || t.price} VNĐ\n\n`;
    });

    context += '=== BÀI VIẾT ===\n';
    articles.forEach(a => {
      context += `- ${a.title} (${a.category?.name || 'Tin tức'})\n`;
      context += `  ${a.excerpt || ''}\n\n`;
    });

    return context;
  } catch (error) {
    console.error('Error building DB context:', error);
    return 'Database context không khả dụng.';
  }
}

// Hàm getCachedDbContext: lấy context chatbot từ cache hoặc tạo lại khi hết hạn.
async function getCachedDbContext() {
  const now = Date.now();
  if (!dbContextCache.context || (now - dbContextCache.timestamp) > DB_CACHE_TTL) {
    dbContextCache.context = await buildDatabaseContext();
    dbContextCache.timestamp = now;
  }
  return dbContextCache.context;
}

// Hàm normalizeSearchText: chuẩn hóa văn bản để so khớp tên địa điểm.
function normalizeSearchText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

// Hàm includesAlias: kiểm tra một tên gọi khác có xuất hiện trong câu hỏi không.
function includesAlias(haystack, alias) {
  const normalizedAlias = normalizeSearchText(alias);
  if (normalizedAlias.length < 3) return false;

  const paddedHaystack = ` ${haystack} `;
  if (paddedHaystack.includes(` ${normalizedAlias} `)) return true;

  const compactHaystack = haystack.replace(/\s+/g, '');
  const compactAlias = normalizedAlias.replace(/\s+/g, '');
  return compactAlias.length >= 4 && compactHaystack.includes(compactAlias);
}

// Hàm findMentionedDestinationSlugs: tìm các địa điểm được nhắc trong câu hỏi/câu trả lời.
async function findMentionedDestinationSlugs(text, limit = 4) {
  const haystack = normalizeSearchText(text);
  if (!haystack) return [];

  const destinations = await prisma.destination.findMany({
    where: { isActive: true },
    select: {
      name: true,
      slug: true,
      address: true,
      province: { select: { name: true } },
    },
  });

  return destinations
    .filter(destination => {
      const aliases = [
        destination.name,
        destination.slug,
        destination.slug.replace(/-/g, ' '),
        destination.address,
      ];

      if (destination.name.toLowerCase() === 'sapa') {
        aliases.push('sa pa');
      }

      return aliases.some(alias => includesAlias(haystack, alias));
    })
    .map(destination => destination.slug)
    .slice(0, limit);
}

// Hàm getDestinationCardsBySlugs: lấy dữ liệu card điểm đến theo slug để frontend hiển thị.
async function getDestinationCardsBySlugs(slugs) {
  const uniqueSlugs = [...new Set(slugs.filter(Boolean))];
  if (uniqueSlugs.length === 0) return [];

  const cards = await prisma.destination.findMany({
    where: {
      isActive: true,
      slug: { in: uniqueSlugs },
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      province: { select: { name: true } },
    },
  });

  return uniqueSlugs.map(slug => cards.find(card => card.slug === slug)).filter(Boolean);
}

// Hàm buildSystemPrompt: tạo prompt hệ thống cho chatbot dựa trên context database.
function buildSystemPrompt(dbContext) {
  return `Bạn là trợ lý du lịch AI của website Du Lịch Quảng Bá, chuyên tư vấn về du lịch Việt Nam.

**QUY TẮC NGHIÊM NGẶT:**
1. Chỉ trả lời về du lịch, địa điểm, tour, chi phí du lịch Việt Nam
2. Nếu câu hỏi không liên quan, hãy lịch sự chuyển hướng về du lịch
3. Luôn sử dụng thông tin từ database nếu có
4. Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp
5. Nếu không có thông tin, nói "Tôi không có đủ thông tin để trả lời chính xác" và gợi ý câu hỏi khác
6. Không bịa đặt thông tin về giá cả, địa điểm không có trong database
7. Trả lời ngắn gọn, có cấu trúc, dễ đọc
8. Khi gợi ý địa điểm cụ thể, dùng cú pháp [card:slug] (vd: [card:vinh-ha-long]) để hiển thị card đẹp cho người dùng

**THÔNG TIN DATABASE:**
${dbContext}

Hãy trả lời dựa trên thông tin có sẵn và đưa ra gợi ý hữu ích cho người dùng.`;
}

// Hàm chatWithDeepSeek: gửi hội thoại sang DeepSeek và lấy nội dung trả lời.
async function chatWithDeepSeek(messages) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === 'your-deepseek-api-key-here') {
    throw new Error('DEEPSEEK_API_KEY chưa được cấu hình. Vui lòng thêm API key vào file .env');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      thinking: { type: 'disabled' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời lúc này.';
}

// Hàm sendMessage: lưu tin nhắn, gọi AI, trích xuất card và lưu phản hồi.
async function sendMessage(data, userId) {
  const { message, sessionId: providedSessionId } = data;
  const sessionId = providedSessionId || uuidv4();

  await prisma.chatbotHistory.create({
    data: { userId, sessionId, role: 'user', message },
  });

  const dbContext = await getCachedDbContext();
  const systemPrompt = buildSystemPrompt(dbContext);
  let reply;
  let errorMsg = null;

  try {
    reply = await chatWithDeepSeek([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ]);
  } catch (apiError) {
    console.error('DeepSeek API error:', apiError.message);
    errorMsg = apiError.message;
    reply = 'Xin lỗi, hệ thống đang gặp sự cố kết nối. Vui lòng thử lại sau ít phút.';
  }

  const cardRegex = /\[card:([a-z0-9-]+)\]/g;
  const markerSlugs = [...reply.matchAll(cardRegex)].map(match => match[1]);
  const mentionedSlugs = await findMentionedDestinationSlugs(`${message}\n${reply}`);
  const cards = await getDestinationCardsBySlugs([...markerSlugs, ...mentionedSlugs]);
  reply = reply.replace(cardRegex, '');

  await prisma.chatbotHistory.create({
    data: {
      userId,
      sessionId,
      role: 'assistant',
      message: reply,
      metadata: JSON.stringify({ model: DEEPSEEK_MODEL, error: errorMsg }),
    },
  });

  return { reply, sessionId, cards };
}

// Hàm getHistory: lấy lịch sử chatbot của người dùng hiện tại.
function getHistory(userId, query) {
  const { sessionId } = query;
  const where = { userId };
  if (sessionId) where.sessionId = sessionId;

  return prisma.chatbotHistory.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    select: { id: true, role: true, message: true, createdAt: true },
  });
}

// Hàm getContextPreview: trả bản xem trước context chatbot để kiểm tra nhanh.
async function getContextPreview() {
  const context = await getCachedDbContext();
  return { context: context.substring(0, 500) + '...' };
}

module.exports = {
  sendMessage,
  getHistory,
  getContextPreview,
};

