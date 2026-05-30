const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = Router();

// Đảm bảo thư mục tải lên tồn tại
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

function getPublicUploadUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

// Tải lên một ảnh
router.post('/image', authenticate, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const url = getPublicUploadUrl(req, req.file.filename);
  res.json({ url, filename: req.file.filename, originalName: req.file.originalname });
});

// Tải lên nhiều ảnh
router.post('/images', authenticate, requireAdmin, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  const files = req.files.map(file => ({
    url: getPublicUploadUrl(req, file.filename),
    filename: file.filename,
    originalName: file.originalname,
  }));
  res.json(files);
});

module.exports = router;
