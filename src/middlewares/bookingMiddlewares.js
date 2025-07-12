const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.checkAccess = catchAsync(async (req, res, next) => {
  if (req.user.role === 'admin') {
    req.bookingFilter = {};
    if (req.params.tourId) {
      req.bookingFilter.tour = req.params.tourId;
    }
    if (req.params.id) {
      req.bookingFilter.id = req.params.id;
    }
  } else if (req.user.role === 'lead-guide') {
    if (!req.params.tourId) {
      return next(
        new AppError('You are not authorized to perform this action', 403)
      );
    }
    const currentTour = await Tour.findById(req.params.tourId);
    if (!currentTour) {
      return next(new AppError('Invalid tour', 401));
    }

    if (!currentTour.guides.includes(req.user.id)) {
      return next(
        new AppError('You are not authorized to perform this action', 403)
      );
    }

    req.bookingFilter = { tour: req.params.tourId };
    if (req.params.id) {
      req.bookingFilter.id = req.params.id;
    }
  } else if (req.user.role === 'user') {
    if (!req.meMode) {
      return next(
        new AppError('You are not authorized to perform this action', 403)
      );
    }
    req.bookingFilter = { user: req.user.id };
    if (req.params.id) {
      req.bookingFilter.id = req.params.id;
    }
  }

  next();
});

exports.modifyBody = catchAsync(async (req, res, next) => {
  if (req.user.role === 'user') {
    if (!req.meMode) {
      return next(
        new AppError('You are not authorized to perform this action', 403)
      );
    }

    req.body.tour = req.params.tourId;
    req.body.user = req.user.id;
  }

  next();
});
