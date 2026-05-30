const { Router } = require('express');
const prisma = require('../utils/prisma');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = Router();

// Lấy tất cả người dùng (admin)
router.get('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (role) {
      where.role = { name: role };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          avatar: true,
          isActive: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ data: users, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
});

// Bật/tắt trạng thái người dùng (admin)
router.put('/:id/toggle-active', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.id === req.user.id) return res.status(400).json({ error: 'Cannot deactivate yourself' });

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: !user.isActive },
    });
    res.json({ message: 'User status updated', user: { id: updated.id, isActive: updated.isActive } });
  } catch (error) {
    next(error);
  }
});

// Xóa người dùng (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
