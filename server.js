// server.js 
require('dotenv').config(); // 

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Import middleware files (Task 3)
const loggerMiddleware = require('./middleware/logger');
const authMiddleware = require('./middleware/auth');
const validateProductMiddleware = require('./middleware/validation');
const errorHandler = require('./middleware/errorHandler');
const NotFoundError = require('./errors/NotFoundError');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------------------------------------------------------
// Middleware setup (Task 3)
// ----------------------------------------------------------------------

// Task 3, Step 2: Implement middleware to parse JSON request bodies
app.use(bodyParser.json());

// Task 3, Step 1: Add custom logger middleware
app.use(loggerMiddleware); 

// Sample in-memory products database (Task 2, Step 1)
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route (Task 1, Step 4 equivalent)
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// ----------------------------------------------------------------------
// Task 2: Implementation of RESTful API Routes 
// ----------------------------------------------------------------------

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  const { category, search, page, limit } = req.query; 

  let resultProducts = products;

  // 1. Filtering by Category
  if (category) {
    resultProducts = resultProducts.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // 2. Searching by Name
  if (search) {
    const searchLower = search.toLowerCase();
    resultProducts = resultProducts.filter(
      (p) => p.name.toLowerCase().includes(searchLower)
    );
  }

  // 3. Pagination (Task 5, Step 2)
  const pageNum = parseInt(page) || 1; // Default to page 1
  const limitNum = parseInt(limit) || 10; // Default limit to 10
  
  // Calculate start and end indexes for slicing
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResults = resultProducts.slice(startIndex, endIndex);
  
  // Calculate total pages for response metadata
  const totalPages = Math.ceil(resultProducts.length / limitNum);

  // Send the paginated data with metadata
  res.json({
    totalProducts: resultProducts.length,
    totalPages: totalPages,
    currentPage: pageNum,
    pageSize: limitNum,
    products: paginatedResults,
  });
});

// GET /api/products/stats - Get product statistics (Task 5, Step 4)
app.get('/api/products/stats', (req, res) => {
  const stats = products.reduce((acc, product) => {
    const { category } = product;
    
    // Initialize category count if it doesn't exist
    if (!acc[category]) {
      acc[category] = 0;
    }
    
    // Increment category count
    acc[category] += 1;
    
    return acc;
  }, {}); // Start with an empty object as the accumulator

  res.json({
    totalCount: products.length,
    countByCategory: stats
  });
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res, next) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id);

  if (product) {
    res.json(product);
  } else {
    // Basic 404 handling
    return next(new NotFoundError(`Product with id ${id} not found.`));
  }
});

// POST /api/products - Create a new product
app.post('/api/products', authMiddleware,
  validateProductMiddleware,
  (req, res) => {
  const newProduct = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    inStock: req.body.inStock !== undefined ? req.body.inStock : true
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', authMiddleware,
  validateProductMiddleware,
  (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex !== -1) {
    products[productIndex] = { 
      ...products[productIndex],
      ...updateData,
      id: id // Ensure the ID remains the route parameter ID
    };
    
    res.json(products[productIndex]);
  } else {
    return next(new NotFoundError(`Product with id ${id} not found.`));
  }
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', authMiddleware, (req, res, next) => {
  const { id } = req.params;
  
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);

  if (products.length < initialLength) {
    res.status(204).send(); 
  } else {
    return next(new NotFoundError(`Product with id ${id} not found.`));
  }
});

app.use((req, res, next) => {
    const err = new NotFoundError(`Cannot find ${req.originalUrl} on this server!`);
    next(err); // Pass the error to the error handler middleware
});

app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;