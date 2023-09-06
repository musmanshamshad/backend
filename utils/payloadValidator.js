module.exports = (payload, requiredAttribs) => {
  const missingParams = [];
  let customErrors = { errors: [] };
  requiredAttribs.forEach((param) => {
    if (!payload[param]) {
      missingParams.push(param);
    }
  });

  missingParams.forEach((erroro) => {
    customErrors.errors.push({
      field: erroro,
      message: `${erroro} is required field`,
      type: "notNull Violation",
    });
  });

  return customErrors;
};
