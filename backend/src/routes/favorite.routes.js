const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const favoriteController = require('../controllers/favorite.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/', authenticate, favoriteController.getFavorites);
router.post('/', authenticate, [
  body('destinationId').trim().notEmpty().withMessage('destinationId không được để trống'),
], validate, favoriteController.addFavorite);
router.delete('/:destinationId', authenticate, favoriteController.removeFavorite);
router.get('/check/:destinationId', authenticate, favoriteController.checkFavorite);

module.exports = router;
