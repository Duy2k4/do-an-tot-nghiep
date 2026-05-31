const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/destination/:id', reviewController.getReviewsByDestination);
router.get('/tour/:id', reviewController.getReviewsByTour);
router.get('/', authenticate, reviewController.getAllReviews);

router.post('/', authenticate, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().isLength({ min: 1 }),
], validate, reviewController.createReview);

router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router;
