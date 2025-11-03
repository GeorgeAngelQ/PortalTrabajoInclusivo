const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        success: false,
        message: 'Something went wrong!',
        err
    });
}
export default errorMiddleware;