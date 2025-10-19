// middleware/errorHandler.js

const ApiError = require('../errors/ApiError');

const errorHandler = (err, req, res, next) => {
    // Determine status code: 
    // Use the custom error's statusCode, or 500 for generic server errors
    const statusCode = err.statusCode || 500; 

    // Determine message: 
    // Use the error message, or a generic message for 500 errors
    const message = statusCode === 500 
        ? 'Internal Server Error' 
        : err.message;

    // Send the standardized error response
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        // Optional: include stack trace in development mode
        // stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};

module.exports = errorHandler;