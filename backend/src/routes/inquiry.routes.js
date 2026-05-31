// Route yêu cầu tư vấn: public gửi yêu cầu, admin quản lý phản hồi.
const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const inquiryController = require('../controllers/inquiry.controller');
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

router.get('/', authenticate, requireAdmin, inquiryController.getInquiries);
router.get('/my', authenticate, inquiryController.getMyInquiries);

router.post('/', [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail(),
  body('subject').trim().isLength({ min: 2 }),
  body('message').trim().isLength({ min: 10 }),
], validate, inquiryController.createInquiry);

router.put('/:id', authenticate, requireAdmin, [
  body('status').optional().isIn(['pending', 'replied', 'closed']).withMessage('Trạng thái không hợp lệ'),
  body('reply').optional().trim(),
], validate, inquiryController.updateInquiry);

router.delete('/:id', authenticate, requireAdmin, inquiryController.deleteInquiry);

module.exports = router;

