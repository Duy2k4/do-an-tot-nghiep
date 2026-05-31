// Controller booking: xử lý HTTP cho đặt tour và quản lý trạng thái booking.
const bookingService = require('../services/booking.service');

// Hàm getBookings: admin lấy danh sách booking có phân trang, lọc và tìm kiếm.
async function getBookings(req, res, next) {
  try {
    res.json(await bookingService.getBookings(req.query));
  } catch (error) {
    next(error);
  }
}

// Hàm getMyBookings: lấy danh sách booking của người dùng hiện tại.
async function getMyBookings(req, res, next) {
  try {
    res.json(await bookingService.getMyBookings(req.user.id));
  } catch (error) {
    next(error);
  }
}

// Hàm getBooking: lấy chi tiết booking và kiểm tra quyền xem.
async function getBooking(req, res, next) {
  try {
    res.json(await bookingService.getBooking(req.params.id, req.user));
  } catch (error) {
    next(error);
  }
}

// Hàm createBooking: tạo booking mới, kiểm tra tour/số người/ngày và tính tổng tiền.
async function createBooking(req, res, next) {
  try {
    res.status(201).json(await bookingService.createBooking(req.user.id, req.body));
  } catch (error) {
    next(error);
  }
}

// Hàm updateBookingStatus: admin cập nhật trạng thái booking.
async function updateBookingStatus(req, res, next) {
  try {
    res.json(await bookingService.updateBookingStatus(req.params.id, req.body.status));
  } catch (error) {
    next(error);
  }
}

// Hàm cancelMyBooking: người dùng hủy booking của chính mình khi còn pending.
async function cancelMyBooking(req, res, next) {
  try {
    res.json(await bookingService.cancelMyBooking(req.params.id, req.user.id));
  } catch (error) {
    next(error);
  }
}

// Hàm deleteBooking: admin xóa booking theo id.
async function deleteBooking(req, res, next) {
  try {
    res.json(await bookingService.deleteBooking(req.params.id));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBookings,
  getMyBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  cancelMyBooking,
  deleteBooking,
};

