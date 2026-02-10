const { ForbiddenError } = require('../errors/AppError');

/**
 * Authorization Service
 * Follows Single Responsibility - handles ONLY authorization logic
 * Separates authorization concerns from business logic
 */
class AuthorizationService {
  /**
   * Check if user is the owner of a resource
   */
  static isOwner(resourceOwnerId, userId) {
    return resourceOwnerId === userId;
  }

  /**
   * Check if user has admin role
   */
  static isAdmin(userRole) {
    return userRole === 'ADMIN';
  }

  /**
   * Check if user can modify resource (owner or admin)
   */
  static canModifyResource(resourceOwnerId, userId, userRole) {
    return this.isOwner(resourceOwnerId, userId) || this.isAdmin(userRole);
  }

  /**
   * Ensure user can modify resource or throw error
   */
  static ensureCanModify(resourceOwnerId, userId, userRole, resourceName = 'resource') {
    if (!this.canModifyResource(resourceOwnerId, userId, userRole)) {
      throw new ForbiddenError(
        `Access denied. Only the ${resourceName} owner or admin can perform this action.`
      );
    }
  }

  /**
   * Ensure user is the owner or throw error
   */
  static ensureIsOwner(resourceOwnerId, userId, resourceName = 'resource') {
    if (!this.isOwner(resourceOwnerId, userId)) {
      throw new ForbiddenError(`You can only modify your own ${resourceName}s`);
    }
  }
}

module.exports = AuthorizationService;
