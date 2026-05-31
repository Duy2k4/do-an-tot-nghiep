const prisma = require('../utils/prisma');

function getFavorites(userId) {
  return prisma.favorite.findMany({
    where: { userId },
    include: {
      destination: {
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: true,
          province: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function addFavorite(userId, destinationId) {
  const existing = await prisma.favorite.findUnique({
    where: { userId_destinationId: { userId, destinationId } },
  });
  if (existing) {
    const error = new Error('Already in favorites');
    error.status = 409;
    throw error;
  }

  return prisma.favorite.create({
    data: { userId, destinationId },
    include: {
      destination: {
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: true,
        },
      },
    },
  });
}

async function removeFavorite(userId, destinationId) {
  await prisma.favorite.deleteMany({ where: { userId, destinationId } });
  return { message: 'Removed from favorites' };
}

async function checkFavorite(userId, destinationId) {
  const favorite = await prisma.favorite.findUnique({
    where: { userId_destinationId: { userId, destinationId } },
  });
  return { isFavorite: !!favorite };
}

module.exports = { getFavorites, addFavorite, removeFavorite, checkFavorite };
