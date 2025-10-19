// errors/NotFoundError.js

const ApiError = require('./ApiError');

class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(message, 404); // Status code for Not Found
    }
}

module.exports = NotFoundError;