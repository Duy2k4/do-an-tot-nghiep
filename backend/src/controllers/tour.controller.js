// Controller tour: xử lý API danh sách, chi tiết và CRUD tour.
const tourService = require('../services/tour.service');

// Hàm getTours: lấy danh sách tour có phân trang, tìm kiếm và lọc.
async function getTours(req, res, next) {
  try {
    res.json(await tourService.getTours(req.query));
  } catch (error) {
    next(error);
  }
}

// Hàm getFeaturedTours: lấy danh sách tour nổi bật.
async function getFeaturedTours(req, res, next) {
  try {
    res.json(await tourService.getFeaturedTours());
  } catch (error) {
    next(error);
  }
}

// Hàm getTourDetail: lấy chi tiết tour theo id/slug.
async function getTourDetail(req, res, next) {
  try {
    const tour = await tourService.getTourDetail(req.params.id);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json(tour);
  } catch (error) {
    next(error);
  }
}

// Hàm createTour: admin tạo tour mới kèm lịch trình và ảnh.
async function createTour(req, res, next) {
  try {
    res.status(201).json(await tourService.createTour(req.body));
  } catch (error) {
    next(error);
  }
}

// Hàm updateTour: admin cập nhật tour, lịch trình và ảnh.
async function updateTour(req, res, next) {
  try {
    res.json(await tourService.updateTour(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

// Hàm deleteTour: admin xóa tour theo id.
async function deleteTour(req, res, next) {
  try {
    res.json(await tourService.deleteTour(req.params.id));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTours,
  getFeaturedTours,
  getTourDetail,
  createTour,
  updateTour,
  deleteTour,
};

