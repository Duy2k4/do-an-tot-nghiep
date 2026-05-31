// Route dashboard: chỉ admin được truy cập thống kê tổng quan.
const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = Router();

router.get('/', authenticate, requireAdmin, dashboardController.getDashboard);

module.exports = router;

