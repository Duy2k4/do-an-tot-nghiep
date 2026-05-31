// Controller upload: chuẩn hóa response sau khi multer lưu file.
const uploadService = require('../services/upload.service');

// Hàm uploadImage: trả thông tin một ảnh sau khi multer upload thành công.
function uploadImage(req, res, next) {
  try {
    res.json(uploadService.buildSingleImageResponse(req, req.file));
  } catch (error) {
    next(error);
  }
}

// Hàm uploadImages: trả danh sách ảnh sau khi multer upload thành công.
function uploadImages(req, res, next) {
  try {
    res.json(uploadService.buildMultipleImagesResponse(req, req.files));
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadImage, uploadImages };

