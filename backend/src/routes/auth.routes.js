// Route xác thực: đăng ký, đăng nhập, hồ sơ và đổi mật khẩu.
const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

// Hàm validate: kiểm tra lỗi validation từ express-validator trước khi vào controller.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('fullName').trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone('vi-VN'),
], validate, authController.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], validate, authController.login);

router.get('/profile', authenticate, authController.getProfile);

router.put('/profile', authenticate, [
  body('fullName').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone('vi-VN'),
], validate, authController.updateProfile);

router.put('/change-password', authenticate, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
], validate, authController.changePassword);

module.exports = router;

