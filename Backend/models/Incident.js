const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    incident_number: {
      type: String,
      required: true,
      index: true,
    },
    incident_date: {
      type: Date,
      required: true,
      index: true,
    },
    action_cause: {
      type: String,
      default: "",
    },
    behavior_type: {
      type: String,
      default: "",
    },
    company_type: {
      type: String,
      default: "",
    },
    craft_code: {
      type: String,
      default: "",
    },
    day_of_year: {
      type: Number,
    },
    gbu: {
      type: String,
      default: "",
      index: true,
    },
    is_lcv: {
      type: Boolean,
      default: false,
    },
    job: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
      index: true,
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
    },
    near_miss_sub_category: {
      type: String,
      default: "",
    },
    primary_category: {
      type: String,
      default: "",
      index: true,
    },
    region: {
      type: String,
      default: "",
      index: true,
    },
    severity_level: {
      type: Number,
      min: 0,
      index: true,
    },
    unsafe_condition_or_behavior: {
      type: String,
      default: "",
    },
    violation_probability_level: {
      type: Number,
      default: 0,
    },
    violation_risk_severity_level: {
      type: Number,
      default: 0,
    },
    violation_severity_level: {
      type: Number,
      default: 0,
    },
    week: {
      type: Number,
      min: 1,
      max: 53,
    },
    year: {
      type: Number,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // We're handling createdAt/lastUpdated manually
    collection: "dashboard_incidents",
  }
);

// Indexes for common queries
incidentSchema.index({ year: 1, month: 1 });
incidentSchema.index({ region: 1, year: 1 });
incidentSchema.index({ primary_category: 1, severity_level: 1 });
incidentSchema.index({ incident_date: -1 });

module.exports = mongoose.model("Incident", incidentSchema);

