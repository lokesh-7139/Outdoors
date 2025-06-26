const Review = require('../models/reviewModel');
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
