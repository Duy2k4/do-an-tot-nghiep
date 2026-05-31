// Route điểm đến: public xem dữ liệu, admin CRUD điểm đến.
const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const destinationController = require('../controllers/destination.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = Router();

// Hàm validate: kiểm tra lỗi validation từ express-validator trước khi vào controller.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', destinationController.getDestinations);
router.get('/featured', destinationController.getFeaturedDestinations);
router.get('/:id', destinationController.getDestinationDetail);

router.post('/', authenticate, requireAdmin, [
  body('name').trim().isLength({ min: 2 }),
  body('slug').trim().isLength({ min: 2 }),
  body('description').notEmpty(),
  body('address').notEmpty(),
  body('provinceId').notEmpty(),
  body('categoryId').notEmpty(),
], validate, destinationController.createDestination);

router.put('/:id', authenticate, requireAdmin, [
  body('name').optional().trim().notEmpty(),
  body('slug').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
], validate, destinationController.updateDestination);

router.delete('/:id', authenticate, requireAdmin, destinationController.deleteDestination);

module.exports = router;

