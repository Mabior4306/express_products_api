const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const API_KEY = "123456";
app.use((req, res, next) => {
  const apiKey = req.headers["api-key"];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API key" });
  }
  next();
});

// In-memory products
let products = [];

// Validation middleware
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || price == null || !category || inStock == null) {
    return res.status(400).json({ error: "Validation Error: Missing fields" });
  }
  next();
}

// Routes
app.get("/api/products", (req, res) => {
  let result = [...products];
  if (req.query.category) {
    result = result.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginated = result.slice(startIndex, endIndex);
  res.json({ total: result.length, page, limit, products: paginated });
});

app.get("/api/products/:id", (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next({ status: 404, message: "Product not found" });
  res.json(product);
});

app.post("/api/products", validateProduct, (req, res) => {
  const newProduct = { id: uuidv4(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", validateProduct, (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next({ status: 404, message: "Product not found" });
  products[index] = { id: req.params.id, ...req.body };
  res.json(products[index]);
});

app.delete("/api/products/:id", (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next({ status: 404, message: "Product not found" });
  const deleted = products.splice(index, 1);
  res.json(deleted[0]);
});

app.get("/api/products/search/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const result = products.filter(p => p.name.toLowerCase().includes(name));
  res.json(result);
});

app.get("/api/products/stats", (req, res) => {
  const stats = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  res.json(stats);
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello World! Express.js API is running.");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
