const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.isLeadGuideOfTour = catchAsync(async (req, res, next) => {
  const currentTour = await Tour.findById(req.params.id).setOptions({
    includeInactiveTours: true,
    populateGuides: true,
  });
  if (!currentTour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  if (req.user.role !== 'admin' && !currentTour.guides.includes(req.user.id)) {
    return next(new AppError('You cannot update or close this tour', 403));
  }
  req.targetTour = currentTour;
  next();
});
