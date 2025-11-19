# Express.js Products API

## Overview
This project demonstrates building a RESTful API using Express.js. It supports standard CRUD operations, routing, middleware, error handling, and advanced features like filtering, pagination, and search.

## Folder Structure
```
express_products_api/
│── README.md
│── server.js
```
## Features
- RESTful API for products
- Logger, authentication, and validation middleware
- Global error handling
- Query parameters for filtering and pagination
- Search endpoint and product statistics

## Setup
1. Ensure Node.js is installed (v18+ recommended)
2. Install dependencies:
   ```bash
   npm install express body-parser uuid
   ```
3. Run the server:
   ```bash
   node server.js
   ```

## API Endpoints
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
- GET /api/products/search/:name
- GET /api/products/stats

## Authentication
All requests require an API key header:
```
api-key: 123456
```

## Author
Generated for Week 2 Express.js assignment submission.
