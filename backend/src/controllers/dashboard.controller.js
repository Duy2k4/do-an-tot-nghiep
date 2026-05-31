// Controller dashboard: trả dữ liệu thống kê cho trang quản trị.
const dashboardService = require('../services/dashboard.service');

// Hàm getDashboard: gom toàn bộ số liệu cho dashboard admin.
async function getDashboard(req, res, next) {
  try {
    res.json(await dashboardService.getDashboard());
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboard };

