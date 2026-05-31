const prisma = require('../utils/prisma');

const destinationCardInclude = {
  images: { where: { isPrimary: true }, take: 1 },
  category: true,
  province: true,
};

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

async function getDestinations(query) {
  const {
    page = 1, limit = 12,
    search, category, province, region,
    sort = 'createdAt', order = 'desc',
    featured, minRating,
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
  if (category) where.category = { slug: category };
  if (province) where.provinceId = province;
  if (featured === 'true') where.isFeatured = true;
  if (minRating) where.rating = { gte: parseFloat(minRating) };
  if (region) where.province = { region };

  const orderBy = {};
  if (sort === 'rating') orderBy.rating = order;
  else if (sort === 'reviewCount') orderBy.reviewCount = order;
  else if (sort === 'viewCount') orderBy.viewCount = order;
  else orderBy.createdAt = order;

  const [destinations, total] = await Promise.all([
    prisma.destination.findMany({
      where,
      include: destinationCardInclude,
      orderBy,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.destination.count({ where }),
  ]);

  return {
    data: destinations,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

function getFeaturedDestinations() {
  return prisma.destination.findMany({
    where: { isActive: true, isFeatured: true },
    include: destinationCardInclude,
    orderBy: { rating: 'desc' },
    take: 8,
  });
}

async function getDestinationDetail(id) {
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

  if (!destination) return null;

  await prisma.destination.update({
    where: { id: destination.id },
    data: { viewCount: { increment: 1 } },
  });

  return destination;
}

function createDestination(data) {
  const destinationData = buildDestinationData(data);
  const images = cleanDestinationImages(data.images);

  return prisma.destination.create({
    data: {
      ...destinationData,
      images: images ? { create: images } : undefined,
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
}

function updateDestination(id, data) {
  const destinationData = buildDestinationData(data);
  const images = cleanDestinationImages(data.images);

  return prisma.destination.update({
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
}

async function deleteDestination(id) {
  await prisma.destination.delete({ where: { id } });
  return { message: 'Destination deleted' };
}

module.exports = {
  getDestinations,
  getFeaturedDestinations,
  getDestinationDetail,
  createDestination,
  updateDestination,
  deleteDestination,
};
