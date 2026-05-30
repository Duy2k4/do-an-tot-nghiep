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

// Lấy tất cả yêu cầu tư vấn (admin)
router.get('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: { user: { select: { fullName: true, email: true } }, tour: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.inquiry.count({ where }),
    ]);

    res.json({ data: inquiries, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
});

// Lấy yêu cầu tư vấn của người dùng
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      where: { userId: req.user.id },
      include: { tour: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(inquiries);
  } catch (error) {
    next(error);
  }
});

// Tạo yêu cầu tư vấn (công khai)
router.post('/', [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail(),
  body('subject').trim().isLength({ min: 2 }),
  body('message').trim().isLength({ min: 10 }),
], validate, async (req, res, next) => {
  try {
    const { name, email, phone, type, subject, message, tourId } = req.body;
    const inquiry = await prisma.inquiry.create({
      data: {
        name, email, phone, type: type || 'contact',
        subject, message, tourId,
        userId: req.user?.id,
      },
    });
    res.status(201).json({ message: 'Your inquiry has been submitted', inquiry });
  } catch (error) {
    next(error);
  }
});

// Cập nhật trạng thái yêu cầu tư vấn (admin)
router.put('/:id', authenticate, requireAdmin, [
  body('status').optional().isIn(['pending', 'replied', 'closed']).withMessage('Trạng thái không hợp lệ'),
  body('reply').optional().trim(),
], validate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reply } = req.body;
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        status: status || undefined,
        reply,
        repliedAt: reply ? new Date() : undefined,
      },
    });
    res.json(inquiry);
  } catch (error) {
    next(error);
  }
});

// Xóa yêu cầu tư vấn (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.inquiry.delete({ where: { id: req.params.id } });
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
