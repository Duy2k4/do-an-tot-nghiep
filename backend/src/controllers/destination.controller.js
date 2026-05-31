// Controller điểm đến: xử lý API danh sách, chi tiết và CRUD điểm đến.
const destinationService = require('../services/destination.service');

// Hàm getDestinations: lấy danh sách điểm đến có phân trang, tìm kiếm và lọc.
async function getDestinations(req, res, next) {
  try {
    res.json(await destinationService.getDestinations(req.query));
  } catch (error) {
    next(error);
  }
}

// Hàm getFeaturedDestinations: lấy danh sách điểm đến nổi bật.
async function getFeaturedDestinations(req, res, next) {
  try {
    res.json(await destinationService.getFeaturedDestinations());
  } catch (error) {
    next(error);
  }
}

// Hàm getDestinationDetail: lấy chi tiết điểm đến theo id/slug và tăng lượt xem.
async function getDestinationDetail(req, res, next) {
  try {
    const destination = await destinationService.getDestinationDetail(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    next(error);
  }
}

// Hàm createDestination: admin tạo điểm đến mới kèm ảnh và tag.
async function createDestination(req, res, next) {
  try {
    res.status(201).json(await destinationService.createDestination(req.body));
  } catch (error) {
    next(error);
  }
}

// Hàm updateDestination: admin cập nhật điểm đến và thay ảnh nếu có.
async function updateDestination(req, res, next) {
  try {
    res.json(await destinationService.updateDestination(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

// Hàm deleteDestination: admin xóa điểm đến theo id.
async function deleteDestination(req, res, next) {
  try {
    res.json(await destinationService.deleteDestination(req.params.id));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDestinations,
  getFeaturedDestinations,
  getDestinationDetail,
  createDestination,
  updateDestination,
  deleteDestination,
};

