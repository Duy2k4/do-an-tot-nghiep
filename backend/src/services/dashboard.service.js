// Service dashboard: gom các thống kê tổng quan cho trang quản trị.
const prisma = require('../utils/prisma');

// Hàm getMonthlyStats: tính thống kê người dùng, đánh giá, yêu cầu theo 6 tháng gần nhất.
async function getMonthlyStats() {
  const now = new Date();
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    const [users, reviews, inquiries] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.review.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.inquiry.count({ where: { createdAt: { gte: start, lte: end } } }),
    ]);

    months.push({
      month: d.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
      users,
      reviews,
      inquiries,
    });
  }

  return months;
}

// Hàm getDashboard: gom toàn bộ số liệu cho dashboard admin.
async function getDashboard() {
  const [
    totalDestinations, totalTours, totalArticles, totalUsers,
    totalReviews, pendingInquiries, activeUsers,
    recentInquiries, recentReviews, recentUsers,
    topDestinations, monthlyStats,
  ] = await Promise.all([
    prisma.destination.count({ where: { isActive: true } }),
    prisma.tour.count({ where: { isActive: true } }),
    prisma.article.count({ where: { isPublished: true } }),
    prisma.user.count(),
    prisma.review.count(),
    prisma.inquiry.count({ where: { status: 'pending' } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.inquiry.findMany({
      where: { status: 'pending' },
      include: { user: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.review.findMany({
      include: {
        user: { select: { fullName: true } },
        destination: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.user.findMany({
      select: { id: true, fullName: true, email: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.destination.findMany({
      where: { isActive: true },
      select: { id: true, name: true, viewCount: true, rating: true, reviewCount: true },
      orderBy: { viewCount: 'desc' },
      take: 5,
    }),
    getMonthlyStats(),
  ]);

  return {
    stats: {
      destinations: totalDestinations,
      tours: totalTours,
      articles: totalArticles,
      users: totalUsers,
      reviews: totalReviews,
      pendingInquiries,
      activeUsers,
    },
    recentInquiries,
    recentReviews,
    recentUsers,
    topDestinations,
    monthlyStats,
  };
}

module.exports = { getDashboard };

