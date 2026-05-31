// Route tour: public xem tour, admin tạo/sửa/xóa tour.
const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const tourController = require('../controllers/tour.controller');
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

router.get('/', tourController.getTours);
router.get('/featured', tourController.getFeaturedTours);
router.get('/:id', tourController.getTourDetail);

router.post('/', authenticate, requireAdmin, [
  body('name').trim().isLength({ min: 2 }),
  body('price').isFloat({ min: 0 }),
  body('maxPeople').isInt({ min: 1 }),
], validate, tourController.createTour);

router.put('/:id', authenticate, requireAdmin, [
  body('name').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('maxPeople').optional().isInt({ min: 1 }),
], validate, tourController.updateTour);

router.delete('/:id', authenticate, requireAdmin, tourController.deleteTour);

module.exports = router;

