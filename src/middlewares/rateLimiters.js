const RateLimiterFactory = require('../utils/rateLimiterFactory');

exports.apiLimiter = RateLimiterFactory.create({
  windowMinutes: 60,
  maxRequests: 120,
  message: 'Too many requests from this Ip, please try again in an hour!',
});

exports.loginLimiter = RateLimiterFactory.create({
  windowMinutes: 10,
  maxRequests: 5,
  message: 'Too many login attempts. Please try again later.',
});

exports.forgotPasswordLimiter = RateLimiterFactory.create({
  windowMinutes: 15,
  maxRequests: 3,
  message: 'Too many password reset attempts. Try again later.',
});

exports.verificationCodeLimiter = RateLimiterFactory.create({
  windowMinutes: 10,
  maxRequests: 4,
  message: 'Too many attempts. Try again later.',
});
