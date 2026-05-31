const recommendationService = require('../services/recommendation.service');

async function getRecommendations(req, res, next) {
  try {
    res.json(await recommendationService.getRecommendations(req.body.preferences || {}, req.user?.id || null));
  } catch (error) {
    console.error('Recommendation error:', error);
    next(error);
  }
}

async function getPopularRecommendations(req, res, next) {
  try {
    res.json(await recommendationService.getPopularRecommendations());
  } catch (error) {
    next(error);
  }
}

module.exports = { getRecommendations, getPopularRecommendations };
