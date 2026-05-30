const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const { authenticate, optionalAuth } = require('../middlewares/auth');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Lấy đánh giá cho điểm đến
router.get('/destination/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { destinationId: id },
        include: { user: { select: { id: true, fullName: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.review.count({ where: { destinationId: id } }),
    ]);

    res.json({ data: reviews, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
});

// Lấy đánh giá cho tour
router.get('/tour/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { tourId: id },
        include: { user: { select: { id: true, fullName: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.review.count({ where: { tourId: id } }),
    ]);

    res.json({ data: reviews, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
});

// Lấy tất cả đánh giá (admin)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        include: {
          user: { select: { id: true, fullName: true, avatar: true } },
          destination: { select: { id: true, name: true } },
          tour: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.review.count(),
    ]);

    res.json({ data: reviews, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
});

    // Tạo đánh giá (người dùng)
router.post('/', authenticate, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().isLength({ min: 1 }),
], validate, async (req, res, next) => {
  try {
    const { destinationId, tourId, rating, comment } = req.body;

    if (!destinationId && !tourId) {
      return res.status(400).json({ error: 'Must provide destinationId or tourId' });
    }

    const review = await prisma.review.create({
      data: { userId: req.user.id, destinationId, tourId, rating, comment },
      include: { user: { select: { id: true, fullName: true, avatar: true } } },
    });

    // Cập nhật điểm đánh giá điểm đến/tour
    if (destinationId) {
      const stats = await prisma.review.aggregate({
        where: { destinationId },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await prisma.destination.update({
        where: { id: destinationId },
        data: { rating: stats._avg.rating || 0, reviewCount: stats._count.rating },
      });
    }

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

// Xóa đánh giá
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.userId !== req.user.id && req.user.role.name !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await prisma.review.delete({ where: { id: req.params.id } });

    // Cập nhật điểm đánh giá
    if (review.destinationId) {
      const stats = await prisma.review.aggregate({
        where: { destinationId: review.destinationId },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await prisma.destination.update({
        where: { id: review.destinationId },
        data: { rating: stats._avg.rating || 0, reviewCount: stats._count.rating },
      });
    }

    res.json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
