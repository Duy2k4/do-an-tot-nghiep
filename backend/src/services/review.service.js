const prisma = require('../utils/prisma');

async function getReviewsByDestination(destinationId, query) {
  return getReviews({ destinationId }, query);
}

async function getReviewsByTour(tourId, query) {
  return getReviews({ tourId }, query);
}

async function getReviews(where, query) {
  const { page = 1, limit = 10 } = query;
  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: { user: { select: { id: true, fullName: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    data: reviews,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

async function getAllReviews(query) {
  const { page = 1, limit = 10 } = query;
  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      include: {
        user: { select: { id: true, fullName: true, avatar: true } },
        destination: { select: { id: true, name: true } },
        tour: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.review.count(),
  ]);

  return {
    data: reviews,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

async function updateDestinationRating(destinationId) {
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

async function createReview(userId, data) {
  const { destinationId, tourId, rating, comment } = data;
  if (!destinationId && !tourId) {
    const error = new Error('Must provide destinationId or tourId');
    error.status = 400;
    throw error;
  }

  const review = await prisma.review.create({
    data: { userId, destinationId, tourId, rating, comment },
    include: { user: { select: { id: true, fullName: true, avatar: true } } },
  });

  if (destinationId) {
    await updateDestinationRating(destinationId);
  }

  return review;
}

async function deleteReview(id, user) {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    const error = new Error('Review not found');
    error.status = 404;
    throw error;
  }
  if (review.userId !== user.id && user.role.name !== 'admin') {
    const error = new Error('Not authorized');
    error.status = 403;
    throw error;
  }

  await prisma.review.delete({ where: { id } });

  if (review.destinationId) {
    await updateDestinationRating(review.destinationId);
  }

  return { message: 'Review deleted' };
}

module.exports = {
  getReviewsByDestination,
  getReviewsByTour,
  getAllReviews,
  createReview,
  deleteReview,
};
