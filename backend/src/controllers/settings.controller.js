// Controller cài đặt: đọc và cập nhật cấu hình website.
const settingsService = require('../services/settings.service');

// Hàm getSettings: lấy settings public hoặc toàn bộ settings nếu là admin.
async function getSettings(req, res, next) {
  try {
    res.json(await settingsService.getSettings(req.query, req.headers.authorization));
  } catch (error) {
    next(error);
  }
}

// Hàm getSettingsByGroup: lấy settings theo nhóm cấu hình.
async function getSettingsByGroup(req, res, next) {
  try {
    res.json(await settingsService.getSettingsByGroup(req.params.group));
  } catch (error) {
    next(error);
  }
}

// Hàm getSettingByKey: lấy một setting theo key.
async function getSettingByKey(req, res, next) {
  try {
    res.json(await settingsService.getSettingByKey(req.params.key));
  } catch (error) {
    next(error);
  }
}

// Hàm upsertSetting: admin tạo mới hoặc cập nhật một setting.
async function upsertSetting(req, res, next) {
  try {
    res.json(await settingsService.upsertSetting(req.body));
  } catch (error) {
    next(error);
  }
}

// Hàm updateSettingsBulk: admin cập nhật nhiều setting cùng lúc.
async function updateSettingsBulk(req, res, next) {
  try {
    res.json(await settingsService.updateSettingsBulk(req.body.settings));
  } catch (error) {
    next(error);
  }
}

// Hàm deleteSetting: admin xóa setting theo key.
async function deleteSetting(req, res, next) {
  try {
    res.json(await settingsService.deleteSetting(req.params.key));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSettings,
  getSettingsByGroup,
  getSettingByKey,
  upsertSetting,
  updateSettingsBulk,
  deleteSetting,
};

