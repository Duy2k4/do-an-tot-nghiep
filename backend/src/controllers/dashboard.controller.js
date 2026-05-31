const dashboardService = require('../services/dashboard.service');

async function getDashboard(req, res, next) {
  try {
    res.json(await dashboardService.getDashboard());
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboard };
