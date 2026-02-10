const PostRepository = require('../repositories/PostRepository');
const AuthorizationService = require('./authorization.service');
const { NotFoundError } = require('../errors/AppError');

/**
 * Post Service
 * Follows Single Responsibility - handles ONLY post business logic
 * Implements Dependency Inversion - depends on PostRepository abstraction
 * Authorization logic extracted to AuthorizationService
 */
class PostService {
  constructor(postRepository = null) {
    this.postRepository = postRepository || new PostRepository();
  }

  async getAllPosts() {
    return this.postRepository.findAll();
  }

  async getPostById(postId) {
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    return post;
  }

  async createPost(postData, userId) {
    const { title, content } = postData;

    return this.postRepository.create({
      title,
      content,
      authorId: userId
    });
  }

  async updatePost(postId, postData, userId) {
    // Find post
    const post = await this.postRepository.findByIdWithoutAuthor(postId);

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    // Check authorization (owner only for update)
    AuthorizationService.ensureIsOwner(post.authorId, userId, 'post');

    // Update post
    return this.postRepository.update(postId, postData);
  }

  async deletePost(postId, userId, userRole) {
    // Find post
    const post = await this.postRepository.findByIdWithoutAuthor(postId);

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    // Check authorization (owner or admin)
    AuthorizationService.ensureCanModify(post.authorId, userId, userRole, 'post');

    // Delete post
    await this.postRepository.delete(postId);

    return { message: 'Post deleted successfully' };
  }
}

// Export singleton instance for backward compatibility
const postService = new PostService();

module.exports = postService;
