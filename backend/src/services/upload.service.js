// Service upload: tạo URL public cho file đã được multer lưu.
// Hàm getPublicUploadUrl: tạo URL public cho file upload.
function getPublicUploadUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

// Hàm buildSingleImageResponse: tạo response cho một ảnh vừa upload.
function buildSingleImageResponse(req, file) {
  if (!file) {
    const error = new Error('No file uploaded');
    error.status = 400;
    throw error;
  }

  return {
    url: getPublicUploadUrl(req, file.filename),
    filename: file.filename,
    originalName: file.originalname,
  };
}

// Hàm buildMultipleImagesResponse: tạo response cho nhiều ảnh vừa upload.
function buildMultipleImagesResponse(req, files) {
  if (!files || files.length === 0) {
    const error = new Error('No files uploaded');
    error.status = 400;
    throw error;
  }

  return files.map(file => ({
    url: getPublicUploadUrl(req, file.filename),
    filename: file.filename,
    originalName: file.originalname,
  }));
}

module.exports = { buildSingleImageResponse, buildMultipleImagesResponse };

