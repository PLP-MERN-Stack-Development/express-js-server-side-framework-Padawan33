// middleware/logger.js

const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    
    // Log the request details to the console
    console.log(`[${timestamp}] ${method} ${url}`);
    
    // Pass control to the next middleware function or route handler
    next();
};

module.exports = logger;