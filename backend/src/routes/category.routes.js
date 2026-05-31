// Route danh mục: danh mục điểm đến, bài viết, tỉnh thành và tag.
const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const categoryController = require('../controllers/category.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = Router();

// Hàm validate: kiểm tra lỗi validation từ express-validator trước khi vào controller.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

const categoryValidators = [
  body('name').trim().notEmpty().withMessage('Tên danh mục không được để trống'),
  body('slug').trim().notEmpty().withMessage('Slug không được để trống'),
];

const updateCategoryValidators = [
  body('name').optional().trim().notEmpty(),
  body('slug').optional().trim().notEmpty(),
];

router.get('/destinations', categoryController.getDestinationCategories);
router.get('/articles', categoryController.getArticleCategories);
router.get('/provinces', categoryController.getProvinces);
router.post('/provinces/sync-external', authenticate, requireAdmin, categoryController.syncExternalProvinces);
router.get('/regions', categoryController.getRegions);
router.get('/tags', categoryController.getTags);

router.post('/destinations', authenticate, requireAdmin, categoryValidators, validate, categoryController.createDestinationCategory);
router.put('/destinations/:id', authenticate, requireAdmin, updateCategoryValidators, validate, categoryController.updateDestinationCategory);
router.delete('/destinations/:id', authenticate, requireAdmin, categoryController.deleteDestinationCategory);

router.post('/articles', authenticate, requireAdmin, categoryValidators, validate, categoryController.createArticleCategory);
router.put('/articles/:id', authenticate, requireAdmin, updateCategoryValidators, validate, categoryController.updateArticleCategory);
router.delete('/articles/:id', authenticate, requireAdmin, categoryController.deleteArticleCategory);

module.exports = router;

