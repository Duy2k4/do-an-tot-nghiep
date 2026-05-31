const reviewService = require('../services/review.service');

async function getReviewsByDestination(req, res, next) {
  try {
    res.json(await reviewService.getReviewsByDestination(req.params.id, req.query));
  } catch (error) {
    next(error);
  }
}

async function getReviewsByTour(req, res, next) {
  try {
    res.json(await reviewService.getReviewsByTour(req.params.id, req.query));
  } catch (error) {
    next(error);
  }
}

async function getAllReviews(req, res, next) {
  try {
    res.json(await reviewService.getAllReviews(req.query));
  } catch (error) {
    next(error);
  }
}

async function createReview(req, res, next) {
  try {
    res.status(201).json(await reviewService.createReview(req.user.id, req.body));
  } catch (error) {
    next(error);
  }
}

async function deleteReview(req, res, next) {
  try {
    res.json(await reviewService.deleteReview(req.params.id, req.user));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getReviewsByDestination,
  getReviewsByTour,
  getAllReviews,
  createReview,
  deleteReview,
};
