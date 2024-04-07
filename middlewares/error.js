class ErrorHandler extends Error {
    constructor (message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}


export const errorHandler = (err, req, res, next) => {
    err.message = err.message || 'internal server error';
    err.statusCode = err.statusCode || 500;

    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid ${err.path}`;
        new ErrorHandler(message, 400);
    };
    
    if (err.code === 11000) {
        const message = `duplicate ${Object.keys(err.keyValue)} Entered`;
        new ErrorHandler(message, 400);
    };
    
    if (err.name === 'JsonWebTokenError') {
        const message = `Json web token is invalid`;
        new ErrorHandler(message, 400);
    };
    
    if (err.name === 'TokenExpiredError') {
        const message = `Json web token is expired`;
        new ErrorHandler(message, 400);
    };
    
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
};

export default ErrorHandler;