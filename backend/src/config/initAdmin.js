const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');

const ADMIN_EMAIL = 'admin@blog.com';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin@123456';

/**
 * Admin Initialization Service
 * Follows Single Responsibility - handles ONLY admin user initialization
 * Uses repository pattern for data access (Dependency Inversion)
 */
const initializeAdmin = async () => {
  try {
    const userRepository = new UserRepository();
    const adminExists = await userRepository.findByEmail(ADMIN_EMAIL);

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      await userRepository.create({
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password: hashedPassword,
        role: 'ADMIN'
      });

      console.log('   Admin user created:');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log('   Please change the password after first login!');
    }
  } catch (error) {
    console.error('Failed to initialize admin user:', error.message);
  }
};

module.exports = { initializeAdmin };
