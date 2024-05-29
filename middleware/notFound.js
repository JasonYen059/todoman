const NotFound = (req, res, next) => {
    const error = new Error('Nah');
    error.status = 404;
    next(error);
}

export default NotFound;