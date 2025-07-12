const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObject');
const getMissingFields = require('../utils/getMissingFields');

exports.getBookings = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Booking.find(req.bookingFilter).setOptions({
      populateTour: true,
      populateUser: true,
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const bookings = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      bookings,
    },
  });
});

exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.find(req.bookingFilter);

  if (!booking) {
    return next(new AppError('No booking found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const requiredFields = [
    'tour',
    'user',
    'price',
    'numberOfPeople',
    'travelDate',
  ];
  const allowedFields = [...requiredFields, 'userNotes'];
  const filteredBody = filterObj(req.body, ...allowedFields);
  const missingFields = getMissingFields(req.body, ...filteredBody);
  if (missingFields.length > 0) {
    return next(
      new AppError(`Missing fields: ${missingFields.join(', ')}`, 400)
    );
  }

  const booking = await Booking.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      booking,
    },
  });
});
