const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-api");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    error: {
      message: err.message || "Something went wrong. Please try again later.",
      code: err.statusCode,
    },
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ error: { message: err.message } });
  // }

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    customError.error.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  if (err.name === "CastError") {
    customError.error.message = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ error: customError.error });
};

module.exports = errorHandlerMiddleware;
