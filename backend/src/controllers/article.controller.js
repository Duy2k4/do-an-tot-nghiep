// Controller bài viết: nhận request/response và chuyển xử lý nghiệp vụ sang service.
const articleService = require('../services/article.service');

// Hàm getArticles: lấy danh sách bài viết có phân trang, tìm kiếm và lọc.
async function getArticles(req, res, next) {
  try {
    const result = await articleService.getArticles(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

// Hàm getFeaturedArticles: lấy các bài viết nổi bật đang xuất bản.
async function getFeaturedArticles(req, res, next) {
  try {
    const articles = await articleService.getFeaturedArticles();
    res.json(articles);
  } catch (error) {
    next(error);
  }
}

// Hàm getRecentArticles: lấy các bài viết mới xuất bản gần đây.
async function getRecentArticles(req, res, next) {
  try {
    const articles = await articleService.getRecentArticles();
    res.json(articles);
  } catch (error) {
    next(error);
  }
}

// Hàm getArticleDetail: lấy chi tiết bài viết theo id/slug và tăng lượt xem.
async function getArticleDetail(req, res, next) {
  try {
    const article = await articleService.getArticleDetail(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    next(error);
  }
}

// Hàm createArticle: tạo bài viết mới kèm tác giả, danh mục và ảnh.
async function createArticle(req, res, next) {
  try {
    const article = await articleService.createArticle(req.body, req.user?.id);
    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
}

// Hàm updateArticle: cập nhật bài viết và thay thế danh sách ảnh nếu có.
async function updateArticle(req, res, next) {
  try {
    const article = await articleService.updateArticle(req.params.id, req.body);
    res.json(article);
  } catch (error) {
    next(error);
  }
}

// Hàm deleteArticle: xóa bài viết theo id.
async function deleteArticle(req, res, next) {
  try {
    const result = await articleService.deleteArticle(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
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

