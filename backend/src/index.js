require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger } = require('./middlewares/logger');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const destinationRoutes = require('./routes/destination.routes');
const tourRoutes = require('./routes/tour.routes');
const articleRoutes = require('./routes/article.routes');
const reviewRoutes = require('./routes/review.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const categoryRoutes = require('./routes/category.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const uploadRoutes = require('./routes/upload.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const settingsRoutes = require('./routes/settings.routes');
const bookingRoutes = require('./routes/booking.routes');

const app = express();

// Lớp trung gian
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// Tệp tĩnh
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Kiểm tra trạng thái hệ thống
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Các route API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/bookings', bookingRoutes);

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Xử lý lỗi
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(`Tai lieu API: http://localhost:${PORT}/api/health`);
});

module.exports = app;
