const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../utils/jwt');

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

const register = async (userData) => {
  const { email, username, password } = userData;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw { statusCode: 409, message: 'Email already registered' };
    }
    if (existingUser.username === username) {
      throw { statusCode: 409, message: 'Username already taken' };
    }
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      role: 'USER'
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true
    }
  });

  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role
  });

  return { user, token };
};

const login = async (credentials) => {
  const { email, password } = credentials;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw { statusCode: 401, message: 'Invalid email or password' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw { statusCode: 401, message: 'Invalid email or password' };
  }

  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role
  });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

module.exports = {
  register,
  login
};
