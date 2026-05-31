const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const settingsController = require('../controllers/settings.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', settingsController.getSettings);
router.get('/group/:group', settingsController.getSettingsByGroup);
router.get('/key/:key', settingsController.getSettingByKey);

router.put('/', authenticate, requireAdmin, [
  body('key').trim().notEmpty().withMessage('Key is required'),
  body('value').notEmpty().withMessage('Value is required'),
], validate, settingsController.upsertSetting);

router.put('/bulk', authenticate, requireAdmin, settingsController.updateSettingsBulk);
router.delete('/:key', authenticate, requireAdmin, settingsController.deleteSetting);

module.exports = router;
