// Controller đánh giá: xử lý API xem, tạo và xóa đánh giá.
const reviewService = require('../services/review.service');

// Hàm getReviewsByDestination: lấy đánh giá của một điểm đến.
async function getReviewsByDestination(req, res, next) {
  try {
    res.json(await reviewService.getReviewsByDestination(req.params.id, req.query));
  } catch (error) {
    next(error);
  }
}

// Hàm getReviewsByTour: lấy đánh giá của một tour.
async function getReviewsByTour(req, res, next) {
  try {
    res.json(await reviewService.getReviewsByTour(req.params.id, req.query));
  } catch (error) {
    next(error);
  }
}

// Hàm getAllReviews: admin lấy toàn bộ đánh giá có phân trang.
async function getAllReviews(req, res, next) {
  try {
    res.json(await reviewService.getAllReviews(req.query));
  } catch (error) {
    next(error);
  }
}

// Hàm createReview: người dùng tạo đánh giá cho điểm đến hoặc tour.
async function createReview(req, res, next) {
  try {
    res.status(201).json(await reviewService.createReview(req.user.id, req.body));
  } catch (error) {
    next(error);
  }
}

// Hàm deleteReview: xóa đánh giá nếu là chủ sở hữu hoặc admin.
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

