const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

exports.getUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      data: users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    User.findById(req.params.id),
    req.query
  ).limitFields();
  const user = await features.query;

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

exports.promoteUser = catchAsync(async (req, res, next) => {
  const filteredbody = filterObj(req.body, 'role');
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    filteredbody,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: updatedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
