// errors/ValidationError.js

const ApiError = require('./ApiError');

class ValidationError extends ApiError {
    constructor(message = 'Invalid request data') {
        super(message, 400); // Status code for Bad Request
    }
}

module.exports = ValidationError;