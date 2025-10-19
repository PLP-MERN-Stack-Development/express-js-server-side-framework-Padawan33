# RESTful Product API with Express.js (Week 2 Assignment)

This project implements a comprehensive RESTful API for managing a product catalog. It is built using Node.js and the Express.js framework, featuring custom middleware for logging, authentication, and validation, as well as robust error handling and advanced querying features like filtering, searching, and pagination.

## 🚀 Getting Started

Follow these steps to set up and run the server locally.

### Prerequisites

* Node.js (v18 or higher)
* npm (Node Package Manager)

### Installation

1.  Clone the repository:
    ```bash
    git clone [YOUR_REPO_URL]
    cd express-js-server-side-framework-[YOUR_USERNAME]
    ```

2.  Install the required dependencies:
    ```bash
    npm install
    ```

### Environment Setup

This API uses an API Key for authentication on data-modifying routes (`POST`, `PUT`, `DELETE`).

1.  Create a file named **`.env`** in the root directory.
2.  Copy the variable from the provided `.env.example` file and set a secret value:

    **.env**
    ```
    API_KEY=my_secret_production_key_12345
    ```

### Running the Server

Start the application using the defined `start` script:

```bash
npm start

The server will run on **http://localhost:3000**.

---

## 📊 API Endpoints Documentation

**[Heading 1: API Endpoints Documentation]**

The base URL for all product resources is `/api/products`.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/products` | Get all products. Supports filtering, searching, and pagination. | No |
| **GET** | `/api/products/:id` | Get a specific product by ID. | No |
| **POST** | `/api/products` | Create a new product. **Validated** fields: `name`, `description`, `price`, `category`. | **Yes** |
| **PUT** | `/api/products/:id` | Update an existing product. **Validated** fields: `name`, `description`, `price`, `category`. | **Yes** |
| **DELETE** | `/api/products/:id` | Delete a product by ID. | **Yes** |
| **GET** | `/api/products/stats` | Get product count grouped by category. | No |

### Advanced Query Parameters (GET /api/products)
**[Heading 2: Advanced Query Parameters]**

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `category` | String | Filters products by category (case-insensitive). | `?category=electronics` |
| `search` | String | Searches products where the name contains the query string (case-insensitive). | `?search=phone` |
| `limit` | Number | Sets the number of results per page (Default: 10). | `?limit=5` |
| `page` | Number | Sets the page number for results (Default: 1). | `?page=2` |

---

## 💡 Examples of Requests and Responses


### 1. Successful Product Creation (POST)
**[Successful Product Creation (POST)]**

Demonstrates successful authentication and validation, resulting in a **201 Created**.

**Request:** `POST http://localhost:3000/api/products`

**Headers:**
* `x-api-key`: `my_secret_production_key_12345`
* `Content-Type`: `application/json`

**Body (JSON):**
```json
{
    "name": "E-Book Reader",
    "description": "Latest generation digital reader",
    "price": 129.99,
    "category": "electronics",
    "inStock": true
}

Response (201 Created):

{
    "id": "e45b4c1a-7b3b-4c5a-9d2c-1a2b3c4d5e6f",
    "name": "E-Book Reader",
    "description": "Latest generation digital reader",
    "price": 129.99,
    "category": "electronics",
    "inStock": true
}

### 2. Authentication Failure

Demonstrates the custom authentication middleware blocking a request when the API key is missing or incorrect.

**Request:** `DELETE http://localhost:3000/api/products/1`
Headers: (Missing x-api-key header)

Response (401 Unauthorized):

{
    "success": false,
    "status": 401,
    "message": "Access Denied. Invalid or missing API key.",
    "hint": "Use the x-api-key header."
}

### 3. Validation Failure (POST)

Demonstrates the validation middleware catching a missing required field.

Request: POST http://localhost:3000/api/products (With correct x-api-key, but missing price)

Response (400 Bad Request):

{
    "success": false,
    "status": 400,
    "message": "Validation Error: Missing required fields.",
    "missing": ["price"]
}

### 4. Combined Advanced Query (GET)

Demonstrates filtering, searching, and pagination applied simultaneously.

Request: GET http://localhost:3000/api/products?category=electronics&search=reader&limit=1&page=1

Response (200 OK):

{
    "totalProducts": 1,
    "totalPages": 1,
    "currentPage": 1,
    "pageSize": 1,
    "products": [
        {
            "id": "e45b4c1a-7b3b-4c5a-9d2c-1a2b3c4d5e6f",
            "name": "E-Book Reader",
            "description": "Latest generation digital reader",
            "price": 129.99,
            "category": "electronics",
            "inStock": true
        }
    ]
}

