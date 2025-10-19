// middleware/validation.js

const validateProduct = (req, res, next) => {
    const product = req.body;
    
    // Define required fields and their expected types (for price)
    const requiredFields = ['name', 'description', 'price', 'category'];
    const missingFields = requiredFields.filter(field => product[field] === undefined);

    // 1. Check for missing required fields
    if (missingFields.length > 0) {
        // Task 4: Error Handling consideration (400 Bad Request)
        return res.status(400).json({ 
            message: 'Validation Error: Missing required fields.',
            missing: missingFields 
        });
    }

    // 2. Check data types (Price must be a valid number > 0)
    if (isNaN(product.price) || typeof product.price !== 'number' || product.price <= 0) {
        // Task 4: Error Handling consideration (400 Bad Request)
        return res.status(400).json({ 
            message: 'Validation Error: Price must be a positive number.' 
        });
    }

    // If validation passes, move to the next handler/route
    next();
};

module.exports = validateProduct;