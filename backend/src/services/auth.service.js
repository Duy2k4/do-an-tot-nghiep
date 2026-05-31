const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

function buildAuthResponse(message, user) {
  const token = jwt.sign(
    { userId: user.id, role: user.role.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  return {
    message,
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role.name,
    },
  };
}

async function register(data) {
  const { email, password, fullName, phone } = data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('Email already registered');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const userRole = await prisma.role.findUnique({ where: { name: 'user' } });
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, fullName, phone, roleId: userRole.id },
    include: { role: true },
  });

  return buildAuthResponse('Registration successful', user);
}

async function login(data) {
  const { email, password } = data;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Account is deactivated');
    error.status = 403;
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  return buildAuthResponse('Login successful', user);
}

function getProfile(user) {
  return { user };
}

async function updateProfile(userId, data) {
  const { fullName, phone, avatar } = data;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { fullName, phone, avatar },
    include: { role: true },
  });
  return { message: 'Profile updated', user };
}

async function changePassword(userId, data) {
  const { currentPassword, newPassword } = data;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const isValid = await bcrypt.compare(currentPassword, user.password);

  if (!isValid) {
    const error = new Error('Current password is incorrect');
    error.status = 400;
    throw error;
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  return { message: 'Password changed successfully' };
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
