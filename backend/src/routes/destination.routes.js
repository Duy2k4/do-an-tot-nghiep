const { Router } = require('express');
const { body, query, validationResult } = require('express-validator');
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

// Lấy tất cả điểm đến (công khai)
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1, limit = 12,
      search, category, province, region,
      sort = 'createdAt', order = 'desc',
      featured, minRating
    } = req.query;

    const where = { isActive: true };
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (category) where.category = { slug: category };
    if (province) where.provinceId = province;
    if (featured === 'true') where.isFeatured = true;
    if (minRating) where.rating = { gte: parseFloat(minRating) };
    if (region) {
      where.province = { region };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orderBy = {};
    if (sort === 'rating') {
      orderBy.rating = order;
    } else if (sort === 'reviewCount') {
      orderBy.reviewCount = order;
    } else if (sort === 'viewCount') {
      orderBy.viewCount = order;
    } else {
      orderBy.createdAt = order;
    }

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: true,
          province: true,
        },
        orderBy,
        skip,
        take: parseInt(limit),
      }),
      prisma.destination.count({ where }),
    ]);

    res.json({
      data: destinations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Lấy điểm đến nổi bật
router.get('/featured', async (req, res, next) => {
  try {
    const destinations = await prisma.destination.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
        province: true,
      },
      orderBy: { rating: 'desc' },
      take: 8,
    });
    res.json(destinations);
  } catch (error) {
    next(error);
  }
});

// Lấy chi tiết điểm đến
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const destination = await prisma.destination.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
        category: true,
        province: true,
        tags: { include: { tag: true } },
        reviews: {
          include: { user: { select: { id: true, fullName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        relatedTo: { include: { from: { include: { images: { where: { isPrimary: true }, take: 1 } } } } },
      },
    });

    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    // Tăng lượt xem
    await prisma.destination.update({
      where: { id: destination.id },
      data: { viewCount: { increment: 1 } },
    });

    res.json(destination);
  } catch (error) {
    next(error);
  }
});

function buildDestinationData(data) {
  const allowedFields = [
    'name',
    'slug',
    'description',
    'shortDescription',
    'address',
    'latitude',
    'longitude',
    'bestTime',
    'estimatedCost',
    'tips',
    'highlights',
    'isFeatured',
    'isActive',
  ];
  const destinationData = {};

  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      destinationData[field] = data[field];
    }
  });

  if (data.provinceId !== undefined) {
    destinationData.province = { connect: { id: data.provinceId } };
  }

  if (data.categoryId !== undefined) {
    destinationData.category = { connect: { id: data.categoryId } };
  }

  if (Array.isArray(destinationData.highlights)) {
    destinationData.highlights = JSON.stringify(destinationData.highlights);
  }

  return destinationData;
}

function cleanDestinationImages(images) {
  if (!Array.isArray(images)) return undefined;
  return images.map((img, idx) => ({
    url: img.url,
    caption: img.caption || null,
    isPrimary: idx === 0,
    sortOrder: idx,
  }));
}

// Tạo điểm đến (admin)
router.post('/', authenticate, requireAdmin, [
  body('name').trim().isLength({ min: 2 }),
  body('slug').trim().isLength({ min: 2 }),
  body('description').notEmpty(),
  body('address').notEmpty(),
  body('provinceId').notEmpty(),
  body('categoryId').notEmpty(),
], validate, async (req, res, next) => {
  try {
    const data = req.body;
    const destinationData = buildDestinationData(data);
    const images = cleanDestinationImages(data.images);

    const destination = await prisma.destination.create({
      data: {
        ...destinationData,
        images: images ? {
          create: images,
        } : undefined,
        tags: data.tagIds ? {
          create: data.tagIds.map(tagId => ({ tag: { connect: { id: tagId } } })),
        } : undefined,
      },
      include: {
        images: true,
        category: true,
        province: true,
        tags: { include: { tag: true } },
      },
    });

    res.status(201).json(destination);
  } catch (error) {
    next(error);
  }
});

// Cập nhật điểm đến (admin)
// Cập nhật điểm đến (admin)
router.put('/:id', authenticate, requireAdmin, [
  body('name').optional().trim().notEmpty(),
  body('slug').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
], validate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const destinationData = buildDestinationData(data);
    const images = cleanDestinationImages(data.images);

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        ...destinationData,
        images: images ? {
          deleteMany: {},
          create: images,
        } : undefined,
      },
      include: {
        images: true,
        category: true,
        province: true,
        tags: { include: { tag: true } },
      },
    });

    res.json(destination);
  } catch (error) {
    next(error);
  }
});

// Xóa điểm đến (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.destination.delete({ where: { id: req.params.id } });
    res.json({ message: 'Destination deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
