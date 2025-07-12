const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.isUserOfReview = catchAsync(async (req, res, next) => {
  const currentReview = await Review.findById(req.params.id).setOptions({
    populateUser: true,
    populateTour: true,
  });
  if (!currentReview) {
    return next(new AppError('No Review found', 404));
  }
  if (req.user.role !== 'admin' && currentReview.user.id !== req.user.id) {
    return next(new AppError('You cannot update or delete this Review', 403));
  }
  req.targetReview = currentReview;

  next();
});

exports.addReviewFilter = (req, res, next) => {
  if (req.user.role === 'admin') {
    req.reviewFilter = {};
    if (req.params.tourId) {
      req.reviewFilter.tour = req.params.tourId;
    }
    if (req.params.id) {
      req.reviewFilter.id = req.params.id;
    }
  } else if (req.user.role === 'lead-guide' || req.user.role === 'guide') {
    if (!req.params.tourId) {
      return next(
        new AppError('You are not authorized to perform this action', 403)
      );
    }
    req.reviewFilter = { tour: req.params.tourId };
    if (req.params.id) {
      req.reviewFilter.id = req.params.id;
    }
  } else if (req.user.role === 'user') {
    if (!req.params.tourId && !req.meMode) {
      return next(
        new AppError('You are not authorized to perform this action', 403)
      );
    }
    req.reviewFilter = {};
    if (req.meMode) {
      req.reviewFilter.user = req.user.id;
    }
    if (req.params.tourId) {
      req.reviewFilter.tour = req.params.tourId;
    }
    if (req.params.id) {
      req.reviewFilter.id = req.params.id;
    }
  }

  next();
};

exports.modifyBody = (req, res, next) => {
  if (!req.params.tourId) {
    return next(
      new AppError('You are not authorized to perform this action', 403)
    );
  }

  req.body.tour = req.params.tourId;
  req.body.user = req.user.id;

  next();
};

exports.verifyTourBookingForReview = catchAsync(async (req, res, next) => {
  const booking = await Booking.find({
    tour: req.body.tour,
    user: req.body.user,
  });

  if (!booking || booking.tourStatus !== 'completed') {
    return next(new AppError('You cannot give review to this tour', 403));
  }

  next();
});
