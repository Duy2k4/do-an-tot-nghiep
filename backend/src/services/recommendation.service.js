// Service gợi ý: gọi AI để chọn điểm đến phù hợp và ghi log kết quả.
const prisma = require('../utils/prisma');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ override: true });

const DEEPSEEK_MODEL = 'deepseek-v4-flash';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Hàm buildDestinationContext: lấy và rút gọn dữ liệu điểm đến làm input cho AI gợi ý.
async function buildDestinationContext(limit = 30) {
  const destinations = await prisma.destination.findMany({
    where: { isActive: true },
    include: {
      province: { select: { name: true, region: true } },
      category: { select: { name: true, slug: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
    },
    take: limit,
  });

  return destinations.map(destination => ({
    id: destination.id,
    name: destination.name,
    slug: destination.slug,
    category: destination.category.name,
    region: destination.province.region === 'NORTH'
      ? 'Miền Bắc'
      : destination.province.region === 'CENTRAL'
        ? 'Miền Trung'
        : 'Miền Nam',
    province: destination.province.name,
    rating: destination.rating,
    reviewCount: destination.reviewCount,
    estimatedCost: destination.estimatedCost || 'Chưa có',
    isFeatured: destination.isFeatured,
    description: destination.description?.substring(0, 300) || '',
    tags: destination.tags.map(tag => tag.tag.name),
  }));
}

// Hàm callDeepSeek: gửi prompt gợi ý sang DeepSeek và nhận JSON kết quả.
async function callDeepSeek(messages) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === 'your-deepseek-api-key-here') {
    throw new Error('DEEPSEEK_API_KEY chưa được cấu hình');
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
      max_tokens: 1500,
      temperature: 0.7,
      thinking: { type: 'disabled' },
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Hàm buildPreferenceSummary: chuyển sở thích người dùng thành mô tả ngắn cho AI.
function buildPreferenceSummary(preferences) {
  const {
    regions = [],
    categories = [],
    budget = null,
    tags = [],
    freeText = '',
  } = preferences;
  const prefSummary = [];

  if (regions.length) prefSummary.push(`Khu vực: ${regions.join(', ')}`);
  if (categories.length) prefSummary.push(`Danh mục: ${categories.join(', ')}`);
  if (budget) {
    prefSummary.push(`Ngân sách: ${budget === 'low' ? 'Tiết kiệm' : budget === 'medium' ? 'Tầm trung' : 'Cao cấp'}`);
  }
  if (tags.length) prefSummary.push(`Sở thích: ${tags.join(', ')}`);
  if (freeText) prefSummary.push(`Yêu cầu thêm: "${freeText}"`);

  return prefSummary;
}

// Hàm getRecommendations: gọi AI gợi ý, enrich dữ liệu điểm đến và ghi log.
async function getRecommendations(preferences = {}, userId = null) {
  const sessionId = uuidv4();
  const destinations = await buildDestinationContext(30);
  const prefSummary = buildPreferenceSummary(preferences);
  const systemPrompt = `Bạn là chuyên gia tư vấn du lịch Việt Nam. Nhiệm vụ: gợi ý địa điểm du lịch dựa trên sở thích người dùng.

DANH SÁCH ĐỊA ĐIỂM CÓ SẴN:
${JSON.stringify(destinations, null, 2)}

Trả về CHỈ JSON object với format sau:
{
  "recommendations": [
    {
      "id": "uuid-của-địa-điểm",
      "name": "tên địa điểm",
      "reason": "lý do ngắn gọn tại sao phù hợp",
      "matchScore": 85
    }
  ],
  "summary": "tóm tắt 1-2 câu về gợi ý"
}

Quy tắc:
- Trả về 5-8 địa điểm phù hợp nhất
- matchScore 0-100 dựa trên mức độ phù hợp
- reason bằng tiếng Việt, ngắn gọn, thuyết phục
- Chỉ dùng địa điểm có trong danh sách, kèm id chính xác
- Ưu tiên địa điểm có rating cao, isFeatured=true`;
  const userMessage = `Sở thích của tôi: ${prefSummary.join('; ') || 'Không có yêu cầu cụ thể, hãy gợi ý địa điểm tốt nhất'}. Hãy gợi ý cho tôi.`;

  const aiRes = await callDeepSeek([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ]);

  const aiContent = aiRes.choices?.[0]?.message?.content || '{}';
  let aiResult;
  try {
    aiResult = JSON.parse(aiContent);
  } catch {
    aiResult = { recommendations: [], summary: 'Không thể phân tích kết quả AI.' };
  }

  const enrichedRecs = await Promise.all(
    (aiResult.recommendations || []).slice(0, 8).map(async (rec) => {
      const destination = await prisma.destination.findUnique({
        where: { id: rec.id },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { name: true, slug: true } },
          province: { select: { name: true, region: true } },
        },
      });
      return destination ? { ...destination, aiReason: rec.reason, matchScore: rec.matchScore } : null;
    }),
  );

  const recommendations = enrichedRecs.filter(Boolean);
  await prisma.recommendationLog.create({
    data: {
      userId,
      sessionId,
      preferences: JSON.stringify(preferences),
      results: JSON.stringify(recommendations.map(destination => destination.id)),
      algorithm: 'deepseek-v4-pro',
    },
  });

  return {
    sessionId,
    recommendations,
    summary: aiResult.summary || '',
    total: recommendations.length,
    algorithm: 'deepseek-v4-pro',
  };
}

// Hàm getPopularRecommendations: lấy các điểm đến phổ biến theo lượt xem.
function getPopularRecommendations() {
  return prisma.destination.findMany({
    where: { isActive: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
      province: true,
    },
    orderBy: { viewCount: 'desc' },
    take: 6,
  });
}

module.exports = { getRecommendations, getPopularRecommendations };

