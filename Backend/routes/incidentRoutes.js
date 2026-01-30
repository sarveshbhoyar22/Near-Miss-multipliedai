const express = require("express");
const router = express.Router();
const {
  getAllIncidents,
  getIncidentById,
  getIncidentStats,
  getFilterOptions,
} = require("../controllers/incidentController");

// Get statistics (must come before /:id route)
router.get("/stats/summary", getIncidentStats);

// Get filter options (must come before /:id route)
router.get("/filters/options", getFilterOptions);

// Get all incidents with filters and pagination
router.get("/", getAllIncidents);

// Get single incident by ID (must be last to avoid conflicts)
router.get("/:id", getIncidentById);

module.exports = router;

