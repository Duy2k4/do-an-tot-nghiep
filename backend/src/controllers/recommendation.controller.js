// Controller gợi ý: trả kết quả đề xuất điểm đến từ service AI.
const recommendationService = require('../services/recommendation.service');

// Hàm getRecommendations: gọi AI gợi ý, enrich dữ liệu điểm đến và ghi log.
async function getRecommendations(req, res, next) {
  try {
    res.json(await recommendationService.getRecommendations(req.body.preferences || {}, req.user?.id || null));
  } catch (error) {
    console.error('Recommendation error:', error);
    next(error);
  }
}

// Hàm getPopularRecommendations: lấy các điểm đến phổ biến theo lượt xem.
async function getPopularRecommendations(req, res, next) {
  try {
    res.json(await recommendationService.getPopularRecommendations());
  } catch (error) {
    next(error);
  }
}

module.exports = { getRecommendations, getPopularRecommendations };

