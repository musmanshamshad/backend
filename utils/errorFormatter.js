module.exports = function (
  field,
  type = "unique violation",
  message = null,
  data
) {
  return {
    errors: [
      {
        field,
        message: message || `${field} should be unique.`,
        type,
      },
    ],
    data,
  };
};
