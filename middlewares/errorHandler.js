module.exports = function (e, req, res, next) {
  let statusCode = 500;
  console.log("================================", e);
  let customErrors = { errors: [] };
  try {
    if (e && e.errors) {
      statusCode = 400;
      console.log(e.errors);
      e.errors.forEach(function (error) {
        const { type, path } = error;
        if (type === "unique violation") {
          let message = "";
          switch (path) {
            case "email":
              message = "Email address has already been taken";
              break;
            default:
              message = error.message;
              break;
          }
          customErrors.errors.push({
            field: path,
            message,
            type,
          });
        } else if (type === "notNull Violation") {
          customErrors.errors.push({
            field: path,
            message: error.message,
            type,
          });
        } else {
          customErrors.errors.push({
            field: path || error.field,
            message: error.message,
            type,
          });
        }
      });
    } else if (e["original"]) {
      customErrors.errors.push({
        field: e["original"]["constraint"],
        message: e["original"]["detail"],
        type: "ForeignKeyConstraintError",
      });
      e.statusCode = 400;
    }
  } catch (error) {
    console.log("catch error", error);
  }

  console.log(">>>>>>>>>>============", customErrors);
  let serverError = {
    error: true,
    customErrors: customErrors,
    response: customErrors.errors.length ? "bad request" : "server error",
  };
  if (e.data) {
    serverError.data = e.data;
  }

  if (e && e.statusCode) {
    serverError.response = e.message;
    statusCode = e.statusCode;
  }
  return res.status(statusCode).json(serverError);
};
