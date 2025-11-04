const errorMiddleware = (err, req, res, next) => {
  console.log(err);
  const defaultErrors = {
    statusCode: 500,
    message: err.message || err
  };
  if (err.name === "ValidationError") {
    defaultErrors.statusCode = 400;
    defaultErrors.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if(err.code && err.code === 11000){
    defaultErrors.statusCode = 400;
    defaultErrors.message = `${Object.keys(
        err.keyValue
    )} debe ser único`
  };

  res.status(defaultErrors.statusCode).json({
    success: false,
    message: defaultErrors.message,
  });
};
export default errorMiddleware;
