const rateLimit = require('express-rate-limit');

class RateLimiterFactory {
  static create({ windowMinutes, maxRequests, message }) {
    return rateLimit({
      windowMs: windowMinutes * 60 * 1000,
      max: maxRequests,
      message,
      keyGenerator: (req) => {
        return req.user?.id || req.ip;
      },
      handler: (req, res, next, options) => {
        res.status(429).json({
          status: 'fail',
          message: options.message,
        });
      },
    });
  }
}

module.exports = RateLimiterFactory;
