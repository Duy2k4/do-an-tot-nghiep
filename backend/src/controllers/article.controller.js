const articleService = require('../services/article.service');

async function getArticles(req, res, next) {
  try {
    const result = await articleService.getArticles(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getFeaturedArticles(req, res, next) {
  try {
    const articles = await articleService.getFeaturedArticles();
    res.json(articles);
  } catch (error) {
    next(error);
  }
}

async function getRecentArticles(req, res, next) {
  try {
    const articles = await articleService.getRecentArticles();
    res.json(articles);
  } catch (error) {
    next(error);
  }
}

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

async function createArticle(req, res, next) {
  try {
    const article = await articleService.createArticle(req.body, req.user?.id);
    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
}

async function updateArticle(req, res, next) {
  try {
    const article = await articleService.updateArticle(req.params.id, req.body);
    res.json(article);
  } catch (error) {
    next(error);
  }
}

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
