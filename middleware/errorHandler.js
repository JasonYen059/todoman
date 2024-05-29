const ErrorHandler = (err, req, res, next) => {
    const errStatus = err.status || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).json({
        error:{
            code: errStatus,
            message: errMsg
        }
    })
}

export default ErrorHandler;