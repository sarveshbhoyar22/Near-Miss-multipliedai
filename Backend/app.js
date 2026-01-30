const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors( {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
} ));
app.use(express.json());

// Request logging middleware (after body parser)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🌐 [${timestamp}] ${req.method} ${req.originalUrl}`);
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`   Query:`, req.query);
  }
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`   Body:`, req.body);
  }
  next();
});

// Routes
const incidentRoutes = require("./routes/incidentRoutes");
app.use("/api/incidents", incidentRoutes);

app.get("/", (req, res) => {
  res.send("Near Miss Backend Running");
});

module.exports = app;
