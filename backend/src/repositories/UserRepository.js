const IRepository = require('./IRepository');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * User Repository
 * Implements Dependency Inversion Principle - depends on abstraction (IRepository)
 * Follows Single Responsibility - handles ONLY user data access
 */
class UserRepository extends IRepository {
  constructor() {
    super();
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true
      }
    });
  }

  async findById(id) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true
      }
    });
  }

  async findByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async findByEmailOrUsername(email, username) {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
  }

  async create(data) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true
      }
    });
  }

  async update(id, data) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true
      }
    });
  }

  async delete(id) {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}

module.exports = UserRepository;
