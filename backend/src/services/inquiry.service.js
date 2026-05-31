const prisma = require('../utils/prisma');

async function getInquiries(query) {
  const { page = 1, limit = 20, status, type } = query;
  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);
  const where = {};

  if (status) where.status = status;
  if (type) where.type = type;

  const [inquiries, total] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      include: { user: { select: { fullName: true, email: true } }, tour: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.inquiry.count({ where }),
  ]);

  return {
    data: inquiries,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

function getMyInquiries(userId) {
  return prisma.inquiry.findMany({
    where: { userId },
    include: { tour: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

async function createInquiry(data, userId) {
  const { name, email, phone, type, subject, message, tourId } = data;
  const inquiry = await prisma.inquiry.create({
    data: {
      name,
      email,
      phone,
      type: type || 'contact',
      subject,
      message,
      tourId,
      userId,
    },
  });
  return { message: 'Your inquiry has been submitted', inquiry };
}

function updateInquiry(id, data) {
  const { status, reply } = data;
  return prisma.inquiry.update({
    where: { id },
    data: {
      status: status || undefined,
      reply,
      repliedAt: reply ? new Date() : undefined,
    },
  });
}

async function deleteInquiry(id) {
  await prisma.inquiry.delete({ where: { id } });
  return { message: 'Inquiry deleted' };
}

module.exports = {
  getInquiries,
  getMyInquiries,
  createInquiry,
  updateInquiry,
  deleteInquiry,
};
