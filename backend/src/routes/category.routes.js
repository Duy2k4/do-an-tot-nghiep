const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/^(tinh|thanh pho|tp)\s+/, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeProvinceName(text) {
  return slugify(text).replace(/-/g, ' ');
}

function inferRegion(name) {
  const normalized = normalizeProvinceName(name);
  const north = new Set([
    'ha noi', 'hai phong', 'quang ninh', 'bac ninh', 'hung yen', 'ninh binh',
    'phu tho', 'lao cai', 'lai chau', 'dien bien', 'son la', 'lang son',
    'cao bang', 'thai nguyen', 'tuyen quang', 'ha giang', 'bac kan', 'yen bai',
    'hoa binh', 'thai binh', 'nam dinh', 'ha nam', 'hai duong', 'vinh phuc',
  ]);
  const central = new Set([
    'thanh hoa', 'nghe an', 'ha tinh', 'quang tri', 'hue', 'thua thien hue',
    'da nang', 'quang ngai', 'gia lai', 'dak lak', 'khanh hoa', 'lam dong',
    'quang binh', 'quang nam', 'binh dinh', 'phu yen', 'ninh thuan',
    'binh thuan', 'kon tum', 'dak nong',
  ]);

  if (north.has(normalized)) return 'NORTH';
  if (central.has(normalized)) return 'CENTRAL';
  return 'SOUTH';
}

// Danh mục điểm đến
router.get('/destinations', async (req, res, next) => {
  try {
    const categories = await prisma.destinationCategory.findMany({
      include: { _count: { select: { destinations: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Danh mục bài viết
router.get('/articles', async (req, res, next) => {
  try {
    const categories = await prisma.articleCategory.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Tỉnh thành
router.get('/provinces', async (req, res, next) => {
  try {
    const { region } = req.query;
    const where = region ? { region } : {};
    const provinces = await prisma.province.findMany({
      where,
      include: { _count: { select: { destinations: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(provinces);
  } catch (error) {
    next(error);
  }
});

router.post('/provinces/sync-external', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const response = await fetch('https://provinces.open-api.vn/api/p/');
    if (!response.ok) {
      return res.status(502).json({ error: 'Không thể tải danh sách tỉnh/thành từ API ngoài' });
    }

    const externalProvinces = await response.json();
    if (!Array.isArray(externalProvinces)) {
      return res.status(502).json({ error: 'Dữ liệu tỉnh/thành không hợp lệ' });
    }

    await Promise.all(externalProvinces.map(province => {
      const name = province.name;
      const slug = slugify(name);
      return prisma.province.upsert({
        where: { slug },
        update: {
          name,
          region: inferRegion(name),
        },
        create: {
          name,
          slug,
          region: inferRegion(name),
        },
      });
    }));

    const provinces = await prisma.province.findMany({
      include: { _count: { select: { destinations: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(provinces);
  } catch (error) {
    next(error);
  }
});

// Vùng miền
router.get('/regions', async (req, res, next) => {
  try {
    const provinces = await prisma.province.findMany({ select: { region: true } });
    const regions = [...new Set(provinces.map(p => p.region))];
    res.json(regions.map(r => ({ value: r, label: r === 'NORTH' ? 'Miền Bắc' : r === 'CENTRAL' ? 'Miền Trung' : 'Miền Nam' })));
  } catch (error) {
    next(error);
  }
});

// Thẻ
router.get('/tags', async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { destinations: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(tags);
  } catch (error) {
    next(error);
  }
});

// Quản trị: CRUD danh mục
router.post('/destinations', authenticate, requireAdmin, [
  body('name').trim().notEmpty().withMessage('Tên danh mục không được để trống'),
  body('slug').trim().notEmpty().withMessage('Slug không được để trống'),
], validate, async (req, res, next) => {
  try {
    const category = await prisma.destinationCategory.create({ data: req.body });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

router.put('/destinations/:id', authenticate, requireAdmin, [
  body('name').optional().trim().notEmpty(),
  body('slug').optional().trim().notEmpty(),
], validate, async (req, res, next) => {
  try {
    const category = await prisma.destinationCategory.update({ where: { id: req.params.id }, data: req.body });
    res.json(category);
  } catch (error) {
    next(error);
  }
});

router.delete('/destinations/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.destinationCategory.delete({ where: { id: req.params.id } });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
});

router.post('/articles', authenticate, requireAdmin, [
  body('name').trim().notEmpty().withMessage('Tên danh mục không được để trống'),
  body('slug').trim().notEmpty().withMessage('Slug không được để trống'),
], validate, async (req, res, next) => {
  try {
    const category = await prisma.articleCategory.create({ data: req.body });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

router.put('/articles/:id', authenticate, requireAdmin, [
  body('name').optional().trim().notEmpty(),
  body('slug').optional().trim().notEmpty(),
], validate, async (req, res, next) => {
  try {
    const category = await prisma.articleCategory.update({ where: { id: req.params.id }, data: req.body });
    res.json(category);
  } catch (error) {
    next(error);
  }
});

router.delete('/articles/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.articleCategory.delete({ where: { id: req.params.id } });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
