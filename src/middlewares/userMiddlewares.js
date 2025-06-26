exports.limitUserFields = (req, res, next) => {
  const fieldsAllowed = ['name', 'email', 'photo', 'role'];
  let fields = [];
  if (req.query.fields) {
    let fieldsAsked = req.query.fields.split(',');
    fields = fieldsAsked.filter((field) => fieldsAllowed.includes(field));
    if (fields.length === 0) {
      return next(new AppError('No valid fields requested', 400));
    }
  } else {
    fields = [...fieldsAllowed];
  }
  req.query.fields = fields.join(',');
  next();
};
