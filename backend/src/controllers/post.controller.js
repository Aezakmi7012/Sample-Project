const postService = require('../services/post.service');

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();

    res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: posts
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      data: post
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.body, req.user.userId);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await postService.updatePost(
      req.params.id,
      req.body,
      req.user.userId,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const result = await postService.deletePost(
      req.params.id,
      req.user.userId,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
