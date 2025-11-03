const errorMiddleware = (err, req, res, next) => {
  console.log(err);
  const defaultErrors = {
    statusCode: 500,
    message: err
  };
  if (err.name == "ValidationError") {
    defaultErrors.statusCode = 400;
    defaultErrors.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }

  if(err.code && err.code == 1100){
    defaultErrors.statusCode = 400,
    defaultErrors.message = `${Object.keys(
        err.keyValue
    )} debe ser único`
  }

  res.status(defaultErrors.statusCode).json({
    message: defaultErrors.message,
  });
};
export default errorMiddleware;
