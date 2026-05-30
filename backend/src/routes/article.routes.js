const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Lấy tất cả bài viết (công khai)
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1, limit = 9,
      search, category, tag,
      sort = 'createdAt', order = 'desc',
      featured
    } = req.query;

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

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orderBy = {};
    if (sort === 'viewCount') orderBy.viewCount = order;
    else orderBy.createdAt = order;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          category: true,
          author: { select: { id: true, fullName: true, avatar: true } },
          images: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy,
        skip,
        take: parseInt(limit),
      }),
      prisma.article.count({ where }),
    ]);

    res.json({
      data: articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Lấy bài viết nổi bật
router.get('/featured', async (req, res, next) => {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true, isFeatured: true },
      include: {
        category: true,
        author: { select: { fullName: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { viewCount: 'desc' },
      take: 6,
    });
    res.json(articles);
  } catch (error) {
    next(error);
  }
});

// Lấy bài viết gần đây
router.get('/recent', async (req, res, next) => {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      include: {
        category: true,
        author: { select: { fullName: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    });
    res.json(articles);
  } catch (error) {
    next(error);
  }
});

// Lấy chi tiết bài viết
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isPublished: true,
      },
      include: {
        category: true,
        author: { select: { id: true, fullName: true, avatar: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Tăng lượt xem
    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });

    res.json(article);
  } catch (error) {
    next(error);
  }
});

// Hàm hỗ trợ tạo slug
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

function cleanArticleImages(images) {
  if (!Array.isArray(images)) return undefined;
  return images.map((img, index) => ({
    url: img.url,
    caption: img.caption || null,
    isPrimary: index === 0,
    sortOrder: index,
  }));
}

// Tạo bài viết (admin)
router.post('/', authenticate, requireAdmin, [
  body('title').trim().isLength({ min: 2 }),
  body('content').notEmpty(),
  body('categoryId').notEmpty(),
], validate, async (req, res, next) => {
  try {
    const data = req.body;
    const { images, slug: inputSlug } = data;
    const articleData = buildArticleData(data);
    const cleanedImages = cleanArticleImages(images);

    const article = await prisma.article.create({
      data: {
        ...articleData,
        slug: inputSlug || generateSlug(articleData.title || 'article'),
        authorId: req.user.id,
        publishedAt: data.isPublished ? new Date() : null,
        images: cleanedImages && cleanedImages.length > 0 ? {
          create: cleanedImages,
        } : undefined,
      },
      include: {
        category: true,
        author: { select: { fullName: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
});

// Cập nhật bài viết (admin)
router.put('/:id', authenticate, requireAdmin, [
  body('title').optional().trim().notEmpty(),
  body('content').optional().trim().notEmpty(),
  body('categoryId').optional().trim().notEmpty(),
], validate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { images, slug: inputSlug } = data;
    const cleanedImages = cleanArticleImages(images);

    const updateData = {
      ...buildArticleData(data),
      publishedAt: data.isPublished ? new Date() : undefined,
    };

    // Chỉ cập nhật slug khi được cung cấp rõ ràng
    if (inputSlug) {
      updateData.slug = inputSlug;
    }

    // Xóa ảnh cũ và tạo ảnh mới
    await prisma.articleImage.deleteMany({ where: { articleId: id } });

    if (cleanedImages && cleanedImages.length > 0) {
      updateData.images = {
        create: cleanedImages,
      };
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        author: { select: { fullName: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
    res.json(article);
  } catch (error) {
    next(error);
  }
});

// Xóa bài viết (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    await prisma.article.delete({ where: { id: req.params.id } });
    res.json({ message: 'Article deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
