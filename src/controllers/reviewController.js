const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObject');
const getMissingFields = require('../utils/getMissingFields');

exports.getReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Review.find(req.reviewFilter).setOptions({
      populateUser: true,
      populateTour: true,
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reviews = await features.query;

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Review.findById(req.reviewFilter).setOptions({
      populateUser: true,
      populateTour: true,
    }),
    req.query
  ).limitFields();
  const review = await features.query;

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const requiredFields = ['review', 'rating', 'user', 'tour'];
  const filteredBody = filterObj(req.body, ...requiredFields);
  const missingFields = getMissingFields(filteredBody, ...requiredFields);
  if (missingFields.length > 0) {
    return next(
      new AppError(`Missing fields: ${missingFields.join(', ')}`, 400)
    );
  }

  const newReview = await Review.create(filteredBody);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const allowedFields = ['review', 'rating'];
  const filteredbody = filterObj(req.body, ...allowedFields);
  Object.assign(req.targetReview, filteredbody);
  const updatedReview = await req.targetReview.save();

  res.status(200).json({
    status: 'success',
    data: {
      data: updatedReview,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await req.targetReview.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
