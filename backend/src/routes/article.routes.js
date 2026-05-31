const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const articleController = require('../controllers/article.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const createArticleValidators = [
  body('title').trim().isLength({ min: 2 }),
  body('content').notEmpty(),
  body('categoryId').notEmpty(),
];

const updateArticleValidators = [
  body('title').optional().trim().notEmpty(),
  body('content').optional().trim().notEmpty(),
  body('categoryId').optional().trim().notEmpty(),
];

router.get('/', articleController.getArticles);
router.get('/featured', articleController.getFeaturedArticles);
router.get('/recent', articleController.getRecentArticles);
router.get('/:id', articleController.getArticleDetail);

router.post(
  '/',
  authenticate,
  requireAdmin,
  createArticleValidators,
  validate,
  articleController.createArticle,
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  updateArticleValidators,
  validate,
  articleController.updateArticle,
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  articleController.deleteArticle,
);

module.exports = router;
