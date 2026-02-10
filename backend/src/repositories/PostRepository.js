const IRepository = require('./IRepository');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Post Repository
 * Implements Dependency Inversion Principle - depends on abstraction (IRepository)
 * Follows Single Responsibility - handles ONLY post data access
 */
class PostRepository extends IRepository {
  constructor() {
    super();
    this.prisma = prisma;
    this.includeAuthor = {
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    };
  }

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      ...this.includeAuthor
    });
  }

  async findById(id) {
    return this.prisma.post.findUnique({
      where: { id },
      ...this.includeAuthor
    });
  }

  async findByIdWithoutAuthor(id) {
    return this.prisma.post.findUnique({
      where: { id }
    });
  }

  async create(data) {
    return this.prisma.post.create({
      data,
      ...this.includeAuthor
    });
  }

  async update(id, data) {
    return this.prisma.post.update({
      where: { id },
      data,
      ...this.includeAuthor
    });
  }

  async delete(id) {
    return this.prisma.post.delete({
      where: { id }
    });
  }
}

module.exports = PostRepository;
