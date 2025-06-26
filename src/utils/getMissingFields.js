module.exports = function getMissingFields(obj, ...requiredFields) {
  return requiredFields.filter(
    (field) =>
      !Object.prototype.hasOwnProperty.call(obj, field) ||
      obj[field] === '' ||
      obj[field] == null
  );
};
