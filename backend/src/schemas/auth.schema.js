const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(100)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

module.exports = {
  registerSchema,
  loginSchema
};
