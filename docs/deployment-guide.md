# Deployment Guide - Du Lịch Quảng Bá

## 1. Prerequisites

### Required Software
- Node.js 18+ (https://nodejs.org)
- npm 9+ (comes with Node.js)
- MySQL 8.0+ (https://dev.mysql.com/downloads/mysql/)
- Git (optional, for cloning)

### Optional
- Angular CLI: `npm install -g @angular/cli`

## 2. Environment Setup

### 2.1 Database Setup
```sql
-- Create database
CREATE DATABASE webquangbadulich CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'webquangbadulich'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON webquangbadulich.* TO 'webquangbadulich'@'localhost';
FLUSH PRIVILEGES;
```

### 2.2 Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed data
npm run db:seed
```

### 2.3 Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
```

## 3. Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Angular dev server runs on http://localhost:4200
```

### Production Build

**Backend:**
```bash
cd backend
npm run build  # if build script exists
npm start     # or node dist/index.js
```

**Frontend:**
```bash
cd frontend
ng build --configuration=production
# Serve dist folder with nginx/apache
```

## 4. Configuration

### Environment Variables (.env)

```env
DATABASE_URL="mysql://root:password@localhost:3306/webquangbadulich"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:4200"
```

## 5. Testing

### Backend API
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
ng test
```

## 6. Demo Accounts

| Account | Email | Password | Role |
|---------|-------|----------|------|
| Admin | admin@webquangbadulich.com | admin123 | Administrator |
| User | user@webquangbadulich.com | user123 | Regular User |

## 7. Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

### Port Already in Use
- Change PORT in .env
- Or kill the process using the port

### Prisma Issues
```bash
npx prisma validate        # Check schema
npx prisma db push --force # Reset schema
npm run db:seed           # Re-seed data
```
