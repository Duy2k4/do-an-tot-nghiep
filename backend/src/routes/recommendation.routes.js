const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const recommendationController = require('../controllers/recommendation.controller');
const { optionalAuth } = require('../middlewares/auth');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/', optionalAuth, [
  body('preferences').optional().isObject(),
], validate, recommendationController.getRecommendations);

router.get('/popular', recommendationController.getPopularRecommendations);

module.exports = router;
