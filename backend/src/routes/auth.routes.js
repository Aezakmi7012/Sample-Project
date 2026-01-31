const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');
const { loginRateLimiter } = require('../middleware/rateLimiter');

router.post(
  '/register',
  validate(registerSchema),
  authController.register
);

router.post(
  '/login',
  loginRateLimiter,
  validate(loginSchema),
  authController.login
);

router.post('/logout', authController.logout);

module.exports = router;
