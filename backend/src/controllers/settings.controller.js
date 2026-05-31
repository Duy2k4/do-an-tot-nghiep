const settingsService = require('../services/settings.service');

async function getSettings(req, res, next) {
  try {
    res.json(await settingsService.getSettings(req.query, req.headers.authorization));
  } catch (error) {
    next(error);
  }
}

async function getSettingsByGroup(req, res, next) {
  try {
    res.json(await settingsService.getSettingsByGroup(req.params.group));
  } catch (error) {
    next(error);
  }
}

async function getSettingByKey(req, res, next) {
  try {
    res.json(await settingsService.getSettingByKey(req.params.key));
  } catch (error) {
    next(error);
  }
}

async function upsertSetting(req, res, next) {
  try {
    res.json(await settingsService.upsertSetting(req.body));
  } catch (error) {
    next(error);
  }
}

async function updateSettingsBulk(req, res, next) {
  try {
    res.json(await settingsService.updateSettingsBulk(req.body.settings));
  } catch (error) {
    next(error);
  }
}

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
