// Service cài đặt: đọc public settings và cho admin cập nhật cấu hình.
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

// Hàm resolveIsAdmin: đọc token tùy chọn để xác định request có phải admin không.
async function resolveIsAdmin(authHeader) {
  if (!authHeader) return false;
  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });
    return user?.role?.name === 'admin';
  } catch {
    return false;
  }
}

// Hàm toSettingsObject: chuyển danh sách setting thành object key-value.
function toSettingsObject(settings) {
  const settingsObj = {};
  settings.forEach(setting => {
    settingsObj[setting.key] = setting.value;
  });
  return settingsObj;
}

// Hàm getSettings: lấy settings public hoặc toàn bộ settings nếu là admin.
async function getSettings(query, authHeader) {
  const { group } = query;
  const where = group ? { group } : {};
  const isAdmin = await resolveIsAdmin(authHeader);
  const settings = await prisma.siteSetting.findMany({
    where: isAdmin ? where : { ...where, isPublic: true },
    orderBy: [{ group: 'asc' }, { key: 'asc' }],
  });

  return { settings: toSettingsObject(settings), settingsList: settings, isAdmin };
}

// Hàm getSettingsByGroup: lấy settings theo nhóm cấu hình.
async function getSettingsByGroup(group) {
  const settings = await prisma.siteSetting.findMany({
    where: { group },
    orderBy: { key: 'asc' },
  });
  return { ...toSettingsObject(settings), _list: settings };
}

// Hàm getSettingByKey: lấy một setting theo key.
async function getSettingByKey(key) {
  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  if (!setting) {
    const error = new Error('Setting not found');
    error.status = 404;
    throw error;
  }
  return setting;
}

// Hàm upsertSetting: admin tạo mới hoặc cập nhật một setting.
function upsertSetting(data) {
  const { key, value, group, label, type, isPublic } = data;
  return prisma.siteSetting.upsert({
    where: { key },
    update: {
      value,
      ...(group && { group }),
      ...(label && { label }),
      ...(type && { type }),
      ...(isPublic !== undefined && { isPublic }),
    },
    create: {
      key,
      value,
      group: group || 'general',
      label: label || key,
      type: type || 'text',
      isPublic: isPublic !== false,
    },
  });
}

// Hàm updateSettingsBulk: admin cập nhật nhiều setting cùng lúc.
async function updateSettingsBulk(settings) {
  if (!settings || typeof settings !== 'object') {
    const error = new Error('Settings object is required');
    error.status = 400;
    throw error;
  }

  const results = [];
  for (const [key, value] of Object.entries(settings)) {
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: {
        key,
        value: String(value),
        group: 'general',
        label: key,
        type: 'text',
        isPublic: true,
      },
    });
    results.push(setting);
  }

  return { message: 'Settings updated', settings: results };
}

// Hàm deleteSetting: admin xóa setting theo key.
async function deleteSetting(key) {
  await prisma.siteSetting.delete({ where: { key } });
  return { message: 'Setting deleted' };
}

module.exports = {
  getSettings,
  getSettingsByGroup,
  getSettingByKey,
  upsertSetting,
  updateSettingsBulk,
  deleteSetting,
};

