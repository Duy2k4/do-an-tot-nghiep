// Service người dùng: tìm kiếm, khóa/mở khóa và xóa tài khoản.
const prisma = require('../utils/prisma');

// Hàm getUsers: admin lấy danh sách người dùng có phân trang và tìm kiếm.
async function getUsers(query) {
  const { page = 1, limit = 20, search, role } = query;
  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);
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
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

// Hàm toggleUserActive: admin khóa hoặc mở khóa tài khoản người dùng.
async function toggleUserActive(id, currentUserId) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  if (user.id === currentUserId) {
    const error = new Error('Cannot deactivate yourself');
    error.status = 400;
    throw error;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
  });
  return { message: 'User status updated', user: { id: updated.id, isActive: updated.isActive } };
}

// Hàm deleteUser: admin xóa người dùng, không cho tự xóa chính mình.
async function deleteUser(id, currentUserId) {
  if (id === currentUserId) {
    const error = new Error('Cannot delete yourself');
    error.status = 400;
    throw error;
  }
  await prisma.user.delete({ where: { id } });
  return { message: 'User deleted' };
}

module.exports = { getUsers, toggleUserActive, deleteUser };

