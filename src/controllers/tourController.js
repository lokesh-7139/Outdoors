const Tour = require('../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Tour.find().setOptions({
      includeInactiveTours: true,
      populateGuides: true,
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).setOptions({
    includeInactiveTours: true,
    populateGuides: true,
    populateReviews: true,
  });
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  // may be put some filters same as userUpdate and reviewUpdate

  if (!req.targetTour.isActive) {
    return next(new AppError('You cannot update a closed tour', 403));
  }

  Object.assign(req.targetTour, req.body);
  const updatedTour = await req.targetTour.save();

  res.status(200).json({
    status: 'success',
    data: {
      updatedTour,
    },
  });
});

exports.toggleTourStatus = catchAsync(async (req, res, next) => {
  req.targetTour.isActive = !req.targetTour.isActive;
  await req.targetTour.save({ runValidators: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      distances,
    },
  });
});
