const prisma = require('../utils/prisma');

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

function cleanTourImages(images) {
  if (!Array.isArray(images)) return undefined;
  return images.map((img, idx) => ({
    url: img.url,
    caption: img.caption || null,
    isPrimary: idx === 0,
    sortOrder: idx,
  }));
}

function withRating(tours) {
  return tours.map(tour => ({
    ...tour,
    avgRating: tour.reviews.length > 0
      ? tour.reviews.reduce((sum, review) => sum + review.rating, 0) / tour.reviews.length
      : 0,
    reviewCount: tour.reviews.length,
  }));
}

async function getTours(query) {
  const {
    page = 1, limit = 12,
    search, destinationId, minPrice, maxPrice,
    sort = 'createdAt', order = 'desc',
    featured,
  } = query;
  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);
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

  let orderBy = {};
  if (sort === 'price') orderBy.price = order;
  else if (sort === 'rating') orderBy = { reviews: { _count: order } };
  else orderBy.createdAt = order;

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
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.tour.count({ where }),
  ]);

  return {
    data: withRating(tours),
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

function getFeaturedTours() {
  return prisma.tour.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      destination: true,
      images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      schedules: { orderBy: [{ day: 'asc' }, { time: 'asc' }], take: 3 },
    },
    take: 6,
  });
}

function getTourDetail(id) {
  return prisma.tour.findFirst({
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
}

function createTour(data) {
  const { images, slug: inputSlug, schedules } = data;
  const tourData = buildTourData(data);
  const cleanedSchedules = cleanSchedules(schedules);
  const cleanedImages = cleanTourImages(images);

  return prisma.tour.create({
    data: {
      ...tourData,
      slug: inputSlug || generateSlug(tourData.name || 'tour'),
      schedules: cleanedSchedules ? { create: cleanedSchedules } : undefined,
      images: cleanedImages && cleanedImages.length > 0 ? { create: cleanedImages } : undefined,
    },
    include: {
      schedules: true,
      images: { orderBy: { sortOrder: 'asc' } },
      destination: true,
    },
  });
}

async function updateTour(id, data) {
  const { images, slug: inputSlug, schedules } = data;
  const cleanedSchedules = cleanSchedules(schedules);
  const cleanedImages = cleanTourImages(images);

  if (cleanedSchedules) {
    await prisma.tourSchedule.deleteMany({ where: { tourId: id } });
  }
  if (images) {
    await prisma.tourImage.deleteMany({ where: { tourId: id } });
  }

  const updateData = buildTourData(data);
  if (inputSlug) updateData.slug = inputSlug;
  if (cleanedSchedules) updateData.schedules = { create: cleanedSchedules };
  if (cleanedImages && cleanedImages.length > 0) updateData.images = { create: cleanedImages };

  return prisma.tour.update({
    where: { id },
    data: updateData,
    include: {
      schedules: true,
      images: { orderBy: { sortOrder: 'asc' } },
      destination: true,
    },
  });
}

async function deleteTour(id) {
  await prisma.tour.delete({ where: { id } });
  return { message: 'Tour deleted' };
}

module.exports = {
  getTours,
  getFeaturedTours,
  getTourDetail,
  createTour,
  updateTour,
  deleteTour,
};
