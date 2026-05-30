const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Đăng ký
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('fullName').trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone('vi-VN'),
], validate, async (req, res, next) => {
  try {
    const { email, password, fullName, phone } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userRole = await prisma.role.findUnique({ where: { name: 'user' } });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        phone,
        roleId: userRole.id,
      },
      include: { role: true },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Đăng nhập
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Lấy hồ sơ
router.get('/profile', require('../middlewares/auth').authenticate, async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
});

// Cập nhật hồ sơ
router.put('/profile', require('../middlewares/auth').authenticate, [
  body('fullName').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone('vi-VN'),
], validate, async (req, res, next) => {
  try {
    const { fullName, phone, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { fullName, phone, avatar },
      include: { role: true },
    });
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    next(error);
  }
});

// Đổi mật khẩu
router.put('/change-password', require('../middlewares/auth').authenticate, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
], validate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
