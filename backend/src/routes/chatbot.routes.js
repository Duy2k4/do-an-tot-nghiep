const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const chatbotController = require('../controllers/chatbot.controller');
const { authenticate, optionalAuth } = require('../middlewares/auth');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/', optionalAuth, [
  body('message').trim().isLength({ min: 1 }),
], validate, chatbotController.sendMessage);

router.get('/history', authenticate, chatbotController.getHistory);
router.get('/context', chatbotController.getContextPreview);

module.exports = router;
