module.exports = function filterObj(obj, ...allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (
      allowedFields.includes(key) &&
      Object.prototype.hasOwnProperty.call(obj, key)
    ) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};
