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

// Lấy tất cả tour (công khai)
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1, limit = 12,
      search, destinationId, minPrice, maxPrice,
      sort = 'createdAt', order = 'desc',
      featured
    } = req.query;

    const where = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (destinationId) where.destinationId = destinationId;
    if (featured === 'true') where.isFeatured = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orderBy = {};
    if (sort === 'price') {
      orderBy.price = order;
    } else if (sort === 'rating') {
      orderBy = { reviews: { _count: order } };
    } else {
      orderBy.createdAt = order;
    }

    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where,
        include: {
          destination: true,
          images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
          schedules: { orderBy: [{ day: 'asc' }, { time: 'asc' }] },
          reviews: { select: { rating: true } },
        },
        orderBy,
        skip,
        take: parseInt(limit),
      }),
      prisma.tour.count({ where }),
    ]);

    // Tính điểm đánh giá trung bình
    const toursWithRating = tours.map(tour => ({
      ...tour,
      avgRating: tour.reviews.length > 0
        ? tour.reviews.reduce((sum, r) => sum + r.rating, 0) / tour.reviews.length
        : 0,
      reviewCount: tour.reviews.length,
    }));

    res.json({
      data: toursWithRating,
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

// Lấy tour nổi bật
router.get('/featured', async (req, res, next) => {
  try {
    const tours = await prisma.tour.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        destination: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
        schedules: { orderBy: [{ day: 'asc' }, { time: 'asc' }], take: 3 },
      },
      take: 6,
    });
    res.json(tours);
  } catch (error) {
    next(error);
  }
});

// Lấy chi tiết tour
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour = await prisma.tour.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        destination: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
        schedules: { orderBy: [{ day: 'asc' }, { time: 'asc' }] },
        reviews: {
          include: { user: { select: { id: true, fullName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    res.json(tour);
  } catch (error) {
    next(error);
  }
});

function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now().toString(36);
}

function buildTourData(data) {
  const allowedFields = [
    'name',
    'description',
    'shortDescription',
    'duration',
    'maxPeople',
    'price',
    'discountPrice',
    'includes',
    'excludes',
    'imageUrl',
    'isFeatured',
    'isActive',
  ];
  const tourData = {};

  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      tourData[field] = data[field];
    }
  });

  if (data.destinationId !== undefined) {
    tourData.destination = data.destinationId
      ? { connect: { id: data.destinationId } }
      : { disconnect: true };
  }

  return tourData;
}

function cleanSchedules(schedules) {
  if (!Array.isArray(schedules)) return undefined;
  return schedules.map(schedule => ({
    day: schedule.day,
    time: schedule.time,
    title: schedule.title,
    description: schedule.description,
    location: schedule.location || null,
  }));
}

// Tạo tour (admin)
router.post('/', authenticate, requireAdmin, [
  body('name').trim().isLength({ min: 2 }),
  body('price').isFloat({ min: 0 }),
  body('maxPeople').isInt({ min: 1 }),
], validate, async (req, res, next) => {
  try {
    const data = req.body;
    const { images, slug: inputSlug, schedules } = data;
    const tourData = buildTourData(data);
    const cleanedSchedules = cleanSchedules(schedules);

    const tour = await prisma.tour.create({
      data: {
        ...tourData,
        slug: inputSlug || generateSlug(tourData.name || 'tour'),
        schedules: cleanedSchedules ? {
          create: cleanedSchedules,
        } : undefined,
        images: images && images.length > 0 ? {
          create: images.map((img, idx) => ({
            url: img.url,
            caption: img.caption || null,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        } : undefined,
      },
      include: {
        schedules: true,
        images: { orderBy: { sortOrder: 'asc' } },
        destination: true,
      },
    });

    res.status(201).json(tour);
  } catch (error) {
    next(error);
  }
});

// Cập nhật tour (admin)
// Cập nhật tour (admin)
router.put('/:id', authenticate, requireAdmin, [
  body('name').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('maxPeople').optional().isInt({ min: 1 }),
], validate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { images, slug: inputSlug, schedules } = data;
    const cleanedSchedules = cleanSchedules(schedules);

    // Xóa lịch trình và ảnh hiện có trước khi tạo lại
    if (cleanedSchedules) {
      await prisma.tourSchedule.deleteMany({ where: { tourId: id } });
    }
    if (images) {
      await prisma.tourImage.deleteMany({ where: { tourId: id } });
    }

    const updateData = buildTourData(data);
    if (inputSlug) updateData.slug = inputSlug;

    if (cleanedSchedules) {
      updateData.schedules = { create: cleanedSchedules };
    }
    if (images && images.length > 0) {
      updateData.images = {
        create: images.map((img, idx) => ({
          url: img.url,
          caption: img.caption || null,
          isPrimary: idx === 0,
          sortOrder: idx,
        })),
      };
    }

    const tour = await prisma.tour.update({
      where: { id },
      data: updateData,
      include: {
        schedules: true,
        images: { orderBy: { sortOrder: 'asc' } },
        destination: true,
      },
    });

    res.json(tour);
  } catch (error) {
    next(error);
  }
});

// Xóa tour (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.tour.delete({ where: { id: req.params.id } });
    res.json({ message: 'Tour deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
