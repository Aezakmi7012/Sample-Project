const postService = require('../services/post.service');

/**
 * Post Controller
 * Follows Single Responsibility - handles ONLY HTTP request/response
 * Error handling delegated to global error handler middleware
 */

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await postService.getAllPosts();
    return res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.body, req.user.userId);
    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePost(
      req.params.id,
      req.body,
      req.user.userId
    );
    return res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const result = await postService.deletePost(
      req.params.id,
      req.user.userId,
      req.user.role
    );
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
