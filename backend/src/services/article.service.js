// Service bài viết: chứa truy vấn Prisma và xử lý dữ liệu bài viết.
const prisma = require('../utils/prisma');

const articleListInclude = {
  category: true,
  author: { select: { id: true, fullName: true, avatar: true } },
  images: { orderBy: { sortOrder: 'asc' } },
};

const articleInclude = {
  category: true,
  author: { select: { fullName: true } },
  images: { orderBy: { sortOrder: 'asc' } },
};

// Hàm generateSlug: tạo slug không dấu từ tiêu đề/tên nội dung.
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

// Hàm buildArticleData: lọc dữ liệu bài viết được phép lưu và nối danh mục.
function buildArticleData(data) {
  const allowedFields = [
    'title',
    'content',
    'excerpt',
    'imageUrl',
    'tags',
    'isFeatured',
    'isPublished',
  ];
  const articleData = {};

  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      articleData[field] = data[field];
    }
  });

  if (data.categoryId !== undefined) {
    articleData.category = { connect: { id: data.categoryId } };
  }

  return articleData;
}

// Hàm cleanArticleImages: chuẩn hóa danh sách ảnh bài viết trước khi lưu.
function cleanArticleImages(images) {
  if (!Array.isArray(images)) return undefined;
  return images.map((img, index) => ({
    url: img.url,
    caption: img.caption || null,
    isPrimary: index === 0,
    sortOrder: index,
  }));
}

// Hàm getArticles: lấy danh sách bài viết có phân trang, tìm kiếm và lọc.
async function getArticles(query) {
  const {
    page = 1, limit = 9,
    search, category, tag,
    sort = 'createdAt', order = 'desc',
    featured,
  } = query;

  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);
  const where = { isPublished: true };

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
    ];
  }
  if (category) where.category = { slug: category };
  if (tag) where.tags = { contains: tag };
  if (featured === 'true') where.isFeatured = true;

  const orderBy = {};
  if (sort === 'viewCount') orderBy.viewCount = order;
  else orderBy.createdAt = order;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: articleListInclude,
      orderBy,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.article.count({ where }),
  ]);

  return {
    data: articles,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

// Hàm getFeaturedArticles: lấy các bài viết nổi bật đang xuất bản.
function getFeaturedArticles() {
  return prisma.article.findMany({
    where: { isPublished: true, isFeatured: true },
    include: articleInclude,
    orderBy: { viewCount: 'desc' },
    take: 6,
  });
}

// Hàm getRecentArticles: lấy các bài viết mới xuất bản gần đây.
function getRecentArticles() {
  return prisma.article.findMany({
    where: { isPublished: true },
    include: articleInclude,
    orderBy: { publishedAt: 'desc' },
    take: 6,
  });
}

// Hàm getArticleDetail: lấy chi tiết bài viết theo id/slug và tăng lượt xem.
async function getArticleDetail(id) {
  const article = await prisma.article.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
      isPublished: true,
    },
    include: articleListInclude,
  });

  if (!article) return null;

  await prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  });

  return article;
}

// Hàm createArticle: tạo bài viết mới kèm tác giả, danh mục và ảnh.
function createArticle(data, authorId) {
  const { images, slug: inputSlug } = data;
  const articleData = buildArticleData(data);
  const cleanedImages = cleanArticleImages(images);

  return prisma.article.create({
    data: {
      ...articleData,
      slug: inputSlug || generateSlug(articleData.title || 'article'),
      author: authorId ? { connect: { id: authorId } } : undefined,
      publishedAt: data.isPublished ? new Date() : null,
      images: cleanedImages && cleanedImages.length > 0 ? {
        create: cleanedImages,
      } : undefined,
    },
    include: articleInclude,
  });
}

// Hàm updateArticle: cập nhật bài viết và thay thế danh sách ảnh nếu có.
async function updateArticle(id, data) {
  const { images, slug: inputSlug } = data;
  const cleanedImages = cleanArticleImages(images);
  const updateData = {
    ...buildArticleData(data),
    publishedAt: data.isPublished ? new Date() : undefined,
  };

  if (inputSlug) {
    updateData.slug = inputSlug;
  }

  await prisma.articleImage.deleteMany({ where: { articleId: id } });

  if (cleanedImages && cleanedImages.length > 0) {
    updateData.images = {
      create: cleanedImages,
    };
  }

  return prisma.article.update({
    where: { id },
    data: updateData,
    include: articleInclude,
  });
}

// Hàm deleteArticle: xóa bài viết theo id.
async function deleteArticle(id) {
  await prisma.article.delete({ where: { id } });
  return { message: 'Article deleted' };
}

module.exports = {
  getArticles,
  getFeaturedArticles,
  getRecentArticles,
  getArticleDetail,
  createArticle,
  updateArticle,
  deleteArticle,
};

