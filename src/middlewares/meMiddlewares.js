exports.setMeMode = (req, res, next) => {
  req.meMode = true;
  next();
};
