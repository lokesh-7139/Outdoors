const express = require('express');
const authMiddlewares = require('../middlewares/authMiddlewares');
const rateLimiters = require('../middlewares/rateLimiters');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/verify-email', authController.verifyEmail);
router.post(
  '/resend-verification-code',
  rateLimiters.verificationCodeLimiter,
  authController.resendEmailVerificationCode
);

router.post('/login', rateLimiters.loginLimiter, authController.login);
router.get('/logout', authController.logout);
router.post(
  '/forgotPassword',
  rateLimiters.forgotPasswordLimiter,
  authController.forgotPassword
);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authMiddlewares.protect,
  authController.updatePassword
);

module.exports = router;
