// middleware/auth.js

const authenticate = (req, res, next) => {
    // 1. Get the secret key from environment variables
    const secretKey = process.env.API_KEY; 
    
    // 2. Get the key provided by the client (e.g., in a header named 'x-api-key')
    const clientApiKey = req.header('x-api-key'); 

    // 3. Check for valid key
    if (!clientApiKey || clientApiKey !== secretKey) {
        // Task 4: Error Handling consideration (401 Unauthorized)
        return res.status(401).json({ 
            message: 'Access Denied. Invalid or missing API key.', 
            hint: 'Use the x-api-key header.' 
        });
    }

    // Key is valid, proceed to the next handler/middleware
    next();
};

module.exports = authenticate;