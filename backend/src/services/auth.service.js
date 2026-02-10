const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');
const { generateToken } = require('../utils/jwt');
const { ConflictError, UnauthorizedError } = require('../errors/AppError');

/**
 * Authentication Service
 * Follows Single Responsibility - handles ONLY authentication business logic
 * Implements Dependency Inversion - depends on UserRepository abstraction
 */
class AuthService {
  constructor(userRepository = null) {
    this.userRepository = userRepository || new UserRepository();
    this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
  }

  async register(userData) {
    const { email, username, password } = userData;

    // Check for existing user
    const existingUser = await this.userRepository.findByEmailOrUsername(email, username);

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictError('Email already registered');
      }
      if (existingUser.username === username) {
        throw new ConflictError('Username already taken');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.bcryptRounds);

    // Create user
    const user = await this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      role: 'USER'
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    return { user, token };
  }

  async login(credentials) {
    const { email, password } = credentials;

    // Find user
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}

// Export singleton instance for backward compatibility
const authService = new AuthService();

module.exports = authService;
