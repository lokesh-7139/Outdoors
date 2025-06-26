const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObject');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('Please login to get access.', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user does no longer exist.', 401));
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.checkPassword = catchAsync(async (req, res, next) => {
  const { password } = filterObj(req.body, 'password');
  if (!password) {
    return next(new AppError('Password is required for this action', 400));
  }
  const user = await User.findById(req.user.id).select('+password');
  const isCorrectPassword = await user.checkPassword(
    req.body.password,
    user.password
  );
  if (!isCorrectPassword) {
    return next(new AppError('Entered password is wrong', 401));
  }
  next();
});
