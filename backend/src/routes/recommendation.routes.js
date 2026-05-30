const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const { authenticate, optionalAuth } = require('../middlewares/auth');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ override: true });

const router = Router();

const DEEPSEEK_MODEL = 'deepseek-v4-flash';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Lấy tất cả điểm đến đang hoạt động làm ngữ cảnh AI
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

  return destinations.map(d => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    category: d.category.name,
    region: d.province.region === 'NORTH' ? 'Miền Bắc' : d.province.region === 'CENTRAL' ? 'Miền Trung' : 'Miền Nam',
    province: d.province.name,
    rating: d.rating,
    reviewCount: d.reviewCount,
    estimatedCost: d.estimatedCost || 'Chưa có',
    isFeatured: d.isFeatured,
    description: d.description?.substring(0, 300) || '',
    tags: d.tags.map(t => t.tag.name),
  }));
}

// Gọi API DeepSeek
async function callDeepSeek(messages) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === 'your-deepseek-api-key-here') {
    throw new Error('DEEPSEEK_API_KEY chưa được cấu hình');
  }

  const res = await fetch(DEEPSEEK_API_URL, {
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

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API error: ${res.status} - ${err}`);
  }

  return res.json();
}

// Gợi ý bằng AI
router.post('/', optionalAuth, [
  body('preferences').optional().isObject(),
], validate, async (req, res, next) => {
  try {
    const { preferences = {} } = req.body;
    const userId = req.user?.id || null;
    const sessionId = uuidv4();

    const {
      regions = [],
      categories = [],
      budget = null,
      tags = [],
      freeText = '',
    } = preferences;

    // Xây dựng ngữ cảnh điểm đến
    const destinations = await buildDestinationContext(30);

    // Xây dựng tóm tắt sở thích người dùng
    const prefSummary = [];
    if (regions.length) prefSummary.push(`Khu vực: ${regions.join(', ')}`);
    if (categories.length) prefSummary.push(`Danh mục: ${categories.join(', ')}`);
    if (budget) prefSummary.push(`Ngân sách: ${budget === 'low' ? 'Tiết kiệm' : budget === 'medium' ? 'Tầm trung' : 'Cao cấp'}`);
    if (tags.length) prefSummary.push(`Sở thích: ${tags.join(', ')}`);
    if (freeText) prefSummary.push(`Yêu cầu thêm: "${freeText}"`);

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

    // Gọi DeepSeek
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

    // Bổ sung dữ liệu điểm đến đầy đủ từ cơ sở dữ liệu cho gợi ý
    const enrichedRecs = await Promise.all(
      (aiResult.recommendations || []).slice(0, 8).map(async (rec) => {
        const dest = await prisma.destination.findUnique({
          where: { id: rec.id },
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            category: { select: { name: true, slug: true } },
            province: { select: { name: true, region: true } },
          },
        });
        return dest ? { ...dest, aiReason: rec.reason, matchScore: rec.matchScore } : null;
      })
    );

    const recommendations = enrichedRecs.filter(Boolean);

    // Ghi log
    await prisma.recommendationLog.create({
      data: {
        userId,
        sessionId,
        preferences: JSON.stringify(preferences),
        results: JSON.stringify(recommendations.map(d => d.id)),
        algorithm: 'deepseek-v4-pro',
      },
    });

    res.json({
      sessionId,
      recommendations,
      summary: aiResult.summary || '',
      total: recommendations.length,
      algorithm: 'deepseek-v4-pro',
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    next(error);
  }
});

// Lấy điểm đến phổ biến
router.get('/popular', async (req, res, next) => {
  try {
    const destinations = await prisma.destination.findMany({
      where: { isActive: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
        province: true,
      },
      orderBy: { viewCount: 'desc' },
      take: 6,
    });
    res.json(destinations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
