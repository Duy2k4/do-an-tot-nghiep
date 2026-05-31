// Route booking: user đặt/hủy tour, admin quản lý toàn bộ booking.
const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const bookingController = require('../controllers/booking.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = Router();

// Hàm validate: kiểm tra lỗi validation từ express-validator trước khi vào controller.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const createBookingValidators = [
  body('tourId').trim().notEmpty(),
  body('startDate').isISO8601().withMessage('Ngày khởi hành không hợp lệ'),
  body('peopleCount').isInt({ min: 1 }).withMessage('Số người phải lớn hơn 0'),
  body('contactName').trim().isLength({ min: 2 }),
  body('contactEmail').isEmail(),
  body('contactPhone').trim().notEmpty(),
  body('note').optional().trim(),
];

router.get('/', authenticate, requireAdmin, bookingController.getBookings);
router.get('/my', authenticate, bookingController.getMyBookings);
router.get('/:id', authenticate, bookingController.getBooking);

router.post('/', authenticate, createBookingValidators, validate, bookingController.createBooking);
router.patch('/:id/status', authenticate, requireAdmin, [
  body('status').isIn(['pending', 'confirmed', 'cancelled']).withMessage('Trạng thái không hợp lệ'),
], validate, bookingController.updateBookingStatus);
router.patch('/:id/cancel', authenticate, bookingController.cancelMyBooking);
router.delete('/:id', authenticate, requireAdmin, bookingController.deleteBooking);

module.exports = router;

