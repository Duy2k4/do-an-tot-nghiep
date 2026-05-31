const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = Router();

router.get('/', authenticate, requireAdmin, dashboardController.getDashboard);

module.exports = router;
