const prisma = require('../utils/prisma');

function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/^(tinh|thanh pho|tp)\s+/, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeProvinceName(text) {
  return slugify(text).replace(/-/g, ' ');
}

function inferRegion(name) {
  const normalized = normalizeProvinceName(name);
  const north = new Set([
    'ha noi', 'hai phong', 'quang ninh', 'bac ninh', 'hung yen', 'ninh binh',
    'phu tho', 'lao cai', 'lai chau', 'dien bien', 'son la', 'lang son',
    'cao bang', 'thai nguyen', 'tuyen quang', 'ha giang', 'bac kan', 'yen bai',
    'hoa binh', 'thai binh', 'nam dinh', 'ha nam', 'hai duong', 'vinh phuc',
  ]);
  const central = new Set([
    'thanh hoa', 'nghe an', 'ha tinh', 'quang tri', 'hue', 'thua thien hue',
    'da nang', 'quang ngai', 'gia lai', 'dak lak', 'khanh hoa', 'lam dong',
    'quang binh', 'quang nam', 'binh dinh', 'phu yen', 'ninh thuan',
    'binh thuan', 'kon tum', 'dak nong',
  ]);

  if (north.has(normalized)) return 'NORTH';
  if (central.has(normalized)) return 'CENTRAL';
  return 'SOUTH';
}

function getDestinationCategories() {
  return prisma.destinationCategory.findMany({
    include: { _count: { select: { destinations: true } } },
    orderBy: { name: 'asc' },
  });
}

function getArticleCategories() {
  return prisma.articleCategory.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { name: 'asc' },
  });
}

function getProvinces(region) {
  return prisma.province.findMany({
    where: region ? { region } : {},
    include: { _count: { select: { destinations: true } } },
    orderBy: { name: 'asc' },
  });
}

async function syncExternalProvinces() {
  const response = await fetch('https://provinces.open-api.vn/api/p/');
  if (!response.ok) {
    const error = new Error('Không thể tải danh sách tỉnh/thành từ API ngoài');
    error.status = 502;
    throw error;
  }

  const externalProvinces = await response.json();
  if (!Array.isArray(externalProvinces)) {
    const error = new Error('Dữ liệu tỉnh/thành không hợp lệ');
    error.status = 502;
    throw error;
  }

  await Promise.all(externalProvinces.map(province => {
    const name = province.name;
    const slug = slugify(name);
    return prisma.province.upsert({
      where: { slug },
      update: { name, region: inferRegion(name) },
      create: { name, slug, region: inferRegion(name) },
    });
  }));

  return getProvinces();
}

async function getRegions() {
  const provinces = await prisma.province.findMany({ select: { region: true } });
  const regions = [...new Set(provinces.map(p => p.region))];
  return regions.map(region => ({
    value: region,
    label: region === 'NORTH' ? 'Miền Bắc' : region === 'CENTRAL' ? 'Miền Trung' : 'Miền Nam',
  }));
}

function getTags() {
  return prisma.tag.findMany({
    include: { _count: { select: { destinations: true } } },
    orderBy: { name: 'asc' },
  });
}

function createDestinationCategory(data) {
  return prisma.destinationCategory.create({ data });
}

function updateDestinationCategory(id, data) {
  return prisma.destinationCategory.update({ where: { id }, data });
}

async function deleteDestinationCategory(id) {
  await prisma.destinationCategory.delete({ where: { id } });
  return { message: 'Category deleted' };
}

function createArticleCategory(data) {
  return prisma.articleCategory.create({ data });
}

function updateArticleCategory(id, data) {
  return prisma.articleCategory.update({ where: { id }, data });
}

async function deleteArticleCategory(id) {
  await prisma.articleCategory.delete({ where: { id } });
  return { message: 'Category deleted' };
}

module.exports = {
  getDestinationCategories,
  getArticleCategories,
  getProvinces,
  syncExternalProvinces,
  getRegions,
  getTags,
  createDestinationCategory,
  updateDestinationCategory,
  deleteDestinationCategory,
  createArticleCategory,
  updateArticleCategory,
  deleteArticleCategory,
};
