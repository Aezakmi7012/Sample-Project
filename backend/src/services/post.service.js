const { PrismaClient } = require('@prisma/client');
const { sanitizeContent } = require('../utils/sanitize');

const prisma = new PrismaClient();


const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      author: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });

  return posts;
};


const getPostById = async (postId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });

  if (!post) {
    throw { statusCode: 404, message: 'Post not found' };
  }

  return post;
};

const createPost = async (postData, userId) => {
  const { title, content } = postData;

  const sanitizedContent = sanitizeContent(content);

  const post = await prisma.post.create({
    data: {
      title,
      content: sanitizedContent,
      authorId: userId
    },
    include: {
      author: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });

  return post;
};

const updatePost = async (postId, postData, userId, userRole) => {

  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    throw { statusCode: 404, message: 'Post not found' };
  }

  if (post.authorId !== userId) {
    throw { statusCode: 403, message: 'You can only update your own posts' };
  }

  // Sanitize content if provided
  const updateData = { ...postData };
  if (updateData.content) {
    updateData.content = sanitizeContent(updateData.content);
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: updateData,
    include: {
      author: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });

  return updatedPost;
};


const deletePost = async (postId, userId, userRole) => {
  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    throw { statusCode: 404, message: 'Post not found' };
  }

  // Check ownership or admin role
  if (post.authorId !== userId && userRole !== 'ADMIN') {
    throw { statusCode: 403, message: 'Access denied. Only the post owner or admin can delete this post.' };
  }

  await prisma.post.delete({
    where: { id: postId }
  });

  return { message: 'Post deleted successfully' };
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
