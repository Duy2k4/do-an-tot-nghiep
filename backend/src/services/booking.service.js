// Service booking: kiểm tra điều kiện đặt tour, tính tổng tiền và thao tác Prisma.
const prisma = require('../utils/prisma');

const bookingInclude = {
  user: { select: { id: true, fullName: true, email: true, phone: true } },
  tour: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      discountPrice: true,
      duration: true,
      maxPeople: true,
      imageUrl: true,
      images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }], take: 1 },
    },
  },
};

// Tạo mã booking dễ đọc theo ngày, kèm hậu tố ngẫu nhiên để giảm trùng lặp.
// Hàm generateBookingCode: tạo mã booking theo ngày và hậu tố ngẫu nhiên.
function generateBookingCode() {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BK${ymd}${suffix}`;
}

// Đảm bảo bookingCode là duy nhất trước khi lưu vào database.
// Hàm buildUniqueBookingCode: tạo mã booking không trùng trong database.
async function buildUniqueBookingCode() {
  for (let i = 0; i < 5; i++) {
    const bookingCode = generateBookingCode();
    const existing = await prisma.booking.findUnique({ where: { bookingCode } });
    if (!existing) return bookingCode;
  }
  return `BK${Date.now().toString(36).toUpperCase()}`;
}

// Chuẩn hóa ngày khởi hành từ dữ liệu client gửi lên.
// Hàm parseStartDate: chuyển ngày khởi hành từ client sang Date hợp lệ.
function parseStartDate(value) {
  const startDate = new Date(value);
  if (Number.isNaN(startDate.getTime())) {
    const error = new Error('Start date is invalid');
    error.status = 400;
    throw error;
  }
  return startDate;
}

// Không cho phép đặt tour với ngày đã qua.
// Hàm ensureFutureDate: đảm bảo ngày khởi hành không nằm trong quá khứ.
function ensureFutureDate(startDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const normalized = new Date(startDate);
  normalized.setHours(0, 0, 0, 0);

  if (normalized < today) {
    const error = new Error('Start date must be today or later');
    error.status = 400;
    throw error;
  }
}

// Hàm getBookings: admin lấy danh sách booking có phân trang, lọc và tìm kiếm.
async function getBookings(query) {
  const { page = 1, limit = 20, status, search } = query;
  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);
  const where = {};

  if (status) where.status = status;
  if (search) {
    where.OR = [
      { bookingCode: { contains: search } },
      { contactName: { contains: search } },
      { contactEmail: { contains: search } },
      { contactPhone: { contains: search } },
      { tour: { name: { contains: search } } },
      { user: { fullName: { contains: search } } },
    ];
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: bookingInclude,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    data: bookings,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

// Hàm getMyBookings: lấy danh sách booking của người dùng hiện tại.
function getMyBookings(userId) {
  return prisma.booking.findMany({
    where: { userId },
    include: bookingInclude,
    orderBy: { createdAt: 'desc' },
  });
}

// Hàm getBooking: lấy chi tiết booking và kiểm tra quyền xem.
async function getBooking(id, user) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: bookingInclude,
  });

  if (!booking) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }
  // Người dùng chỉ được xem booking của chính mình; admin được xem tất cả.
  if (booking.userId !== user.id && user.role.name !== 'admin') {
    const error = new Error('Not authorized');
    error.status = 403;
    throw error;
  }

  return booking;
}

// Hàm createBooking: tạo booking mới, kiểm tra tour/số người/ngày và tính tổng tiền.
async function createBooking(userId, data) {
  const peopleCount = Number(data.peopleCount);
  if (!Number.isInteger(peopleCount) || peopleCount < 1) {
    const error = new Error('People count must be at least 1');
    error.status = 400;
    throw error;
  }

  // Chỉ cho đặt tour đang hoạt động để tránh booking tour đã bị tắt.
  const tour = await prisma.tour.findFirst({
    where: { id: data.tourId, isActive: true },
  });
  if (!tour) {
    const error = new Error('Tour not found');
    error.status = 404;
    throw error;
  }
  if (peopleCount > tour.maxPeople) {
    const error = new Error(`People count cannot exceed ${tour.maxPeople}`);
    error.status = 400;
    throw error;
  }

  const startDate = parseStartDate(data.startDate);
  ensureFutureDate(startDate);

  // Tổng tiền được tính lại ở backend để tránh client tự sửa giá.
  const unitPrice = tour.discountPrice || tour.price;
  const booking = await prisma.booking.create({
    data: {
      bookingCode: await buildUniqueBookingCode(),
      userId,
      tourId: tour.id,
      startDate,
      peopleCount,
      totalAmount: unitPrice * peopleCount,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      note: data.note || null,
    },
    include: bookingInclude,
  });

  return { message: 'Booking created', booking };
}

// Hàm updateBookingStatus: admin cập nhật trạng thái booking.
function updateBookingStatus(id, status) {
  return prisma.booking.update({
    where: { id },
    data: { status },
    include: bookingInclude,
  });
}

// Hàm cancelMyBooking: người dùng hủy booking của chính mình khi còn pending.
async function cancelMyBooking(id, userId) {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking || booking.userId !== userId) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }
  if (booking.status !== 'pending') {
    const error = new Error('Only pending bookings can be cancelled');
    error.status = 400;
    throw error;
  }

  return prisma.booking.update({
    where: { id },
    data: { status: 'cancelled' },
    include: bookingInclude,
  });
}

// Hàm deleteBooking: admin xóa booking theo id.
async function deleteBooking(id) {
  await prisma.booking.delete({ where: { id } });
  return { message: 'Booking deleted' };
}

module.exports = {
  getBookings,
  getMyBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  cancelMyBooking,
  deleteBooking,
};

