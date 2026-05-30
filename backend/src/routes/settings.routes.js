const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Lấy tất cả cài đặt (công khai khi isPublic=true, admin xem tất cả)
router.get('/', async (req, res, next) => {
  try {
    const { group } = req.query;
    const where = group ? { group } : {};
    
    // Kiểm tra người dùng có phải admin không
    const authHeader = req.headers.authorization;
    let isAdmin = false;
    
    if (authHeader) {
      try {
        const jwt = require('jsonwebtoken');
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        isAdmin = user?.role?.name === 'admin';
      } catch (e) {
        // Chưa xác thực, tiếp tục xử lý
      }
    }

    const settings = await prisma.siteSetting.findMany({
      where: isAdmin ? where : { ...where, isPublic: true },
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });

    // Chuyển đổi sang đối tượng key-value
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });

    res.json({
      settings: settingsObj,
      settingsList: settings,
      isAdmin
    });
  } catch (error) {
    next(error);
  }
});

// Lấy cài đặt theo nhóm
router.get('/group/:group', async (req, res, next) => {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { group: req.params.group },
      orderBy: { key: 'asc' },
    });

    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });

    res.json({ ...settingsObj, _list: settings });
  } catch (error) {
    next(error);
  }
});

// Lấy một cài đặt theo khóa
router.get('/key/:key', async (req, res, next) => {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: req.params.key },
    });

    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json(setting);
  } catch (error) {
    next(error);
  }
});

// Quản trị: Tạo hoặc cập nhật cài đặt
router.put('/', authenticate, requireAdmin, [
  body('key').trim().notEmpty().withMessage('Key is required'),
  body('value').notEmpty().withMessage('Value is required'),
], validate, async (req, res, next) => {
  try {
    const { key, value, group, label, type, isPublic } = req.body;

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: {
        value,
        ...(group && { group }),
        ...(label && { label }),
        ...(type && { type }),
        ...(isPublic !== undefined && { isPublic }),
      },
      create: {
        key,
        value,
        group: group || 'general',
        label: label || key,
        type: type || 'text',
        isPublic: isPublic !== false,
      },
    });

    res.json(setting);
  } catch (error) {
    next(error);
  }
});

// Quản trị: Cập nhật hàng loạt cài đặt
router.put('/bulk', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Settings object is required' });
    }

    const results = [];
    for (const [key, value] of Object.entries(settings)) {
      const setting = await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: {
          key,
          value: String(value),
          group: 'general',
          label: key,
          type: 'text',
          isPublic: true,
        },
      });
      results.push(setting);
    }

    res.json({ message: 'Settings updated', settings: results });
  } catch (error) {
    next(error);
  }
});

// Quản trị: Xóa cài đặt
router.delete('/:key', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.siteSetting.delete({
      where: { key: req.params.key },
    });

    res.json({ message: 'Setting deleted' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Setting not found' });
    }
    next(error);
  }
});

module.exports = router;
