const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@blog.com';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin@123456';

const initializeAdmin = async () => {
  try {
    const adminExists = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL }
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      await prisma.user.create({
        data: {
          email: ADMIN_EMAIL,
          username: ADMIN_USERNAME,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });

      console.log('✅ Admin user created:');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log('   ⚠️  Please change the password after first login!');
    }
  } catch (error) {
    console.error('Failed to initialize admin user:', error.message);
  }
};

module.exports = { initializeAdmin };
