const Incident = require("../models/Incident");

// Get all incidents with pagination and filters
const getAllIncidents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      year,
      month,
      region,
      gbu,
      primary_category,
      severity_level,
      location,
      search,
      sortBy = "incident_date",
      sortOrder = "desc",
    } = req.query;

    console.log("\n📥 GET /api/incidents - Request received");
    console.log("Query params:", req.query);

    // Build filter object
    const filter = {};

    if (year) filter.year = parseInt(year);
    if (month) filter.month = parseInt(month);
    if (region) filter.region = { $regex: region, $options: "i" };
    if (gbu) filter.gbu = { $regex: gbu, $options: "i" };
    if (primary_category)
      filter.primary_category = { $regex: primary_category, $options: "i" };
    if (severity_level) filter.severity_level = parseInt(severity_level);
    if (location) filter.location = { $regex: location, $options: "i" };

    // Search across multiple fields
    if (search) {
      filter.$or = [
        { incident_number: { $regex: search, $options: "i" } },
        { job: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { primary_category: { $regex: search, $options: "i" } },
        { action_cause: { $regex: search, $options: "i" } },
      ];
    }

    console.log("🔍 Filter object:", JSON.stringify(filter, null, 2));

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    console.log(`📄 Pagination: page=${page}, limit=${limit}, skip=${skip}`);
    console.log(`🔄 Sort: ${sortBy} ${sortOrder}`);

    // Execute query
    const [incidents, total] = await Promise.all([
      Incident.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Incident.countDocuments(filter),
    ]);

    console.log(`✅ Query executed: Found ${incidents.length} incidents (Total: ${total})`);
    console.log("📊 First incident sample:", incidents[0] ? {
      id: incidents[0].id,
      incident_number: incidents[0].incident_number,
      incident_date: incidents[0].incident_date,
      primary_category: incidents[0].primary_category,
      severity_level: incidents[0].severity_level,
      region: incidents[0].region,
    } : "No incidents found");

    const response = {
      success: true,
      data: incidents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };

    console.log("📤 Response pagination:", response.pagination);
    console.log("✅ Response sent successfully\n");

    res.json(response);
  } catch (error) {
    console.error("❌ Error in getAllIncidents:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching incidents",
      error: error.message,
    });
  }
};

// Get single incident by ID
const getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`\n📥 GET /api/incidents/${id} - Request received`);

    const incident = await Incident.findOne({ id });

    if (!incident) {
      console.log(`❌ Incident with id "${id}" not found`);
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    console.log("✅ Incident found:", {
      id: incident.id,
      incident_number: incident.incident_number,
      primary_category: incident.primary_category,
      severity_level: incident.severity_level,
      region: incident.region,
    });
    console.log("📤 Sending incident data\n");

    res.json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.error("❌ Error in getIncidentById:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching incident",
      error: error.message,
    });
  }
};

// Get statistics/aggregations
const getIncidentStats = async (req, res) => {
  try {
    const { year, region, gbu } = req.query;
    console.log("\n📥 GET /api/incidents/stats/summary - Request received");
    console.log("Query params:", { year, region, gbu });

    const filter = {};

    if (year) filter.year = parseInt(year);
    if (region) filter.region = { $regex: region, $options: "i" };
    if (gbu) filter.gbu = { $regex: gbu, $options: "i" };

    console.log("🔍 Filter object:", JSON.stringify(filter, null, 2));

    const stats = await Incident.aggregate([
      { $match: filter },
      {
        $facet: {
          totalIncidents: [{ $count: "count" }],
          bySeverity: [
            {
              $group: {
                _id: "$severity_level",
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          byCategory: [
            {
              $group: {
                _id: "$primary_category",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
          ],
          byRegion: [
            {
              $group: {
                _id: "$region",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
          byMonth: [
            {
              $group: {
                _id: { year: "$year", month: "$month" },
                count: { $sum: 1 },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
          ],
          byGBU: [
            {
              $group: {
                _id: "$gbu",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    const responseData = {
      total: stats[0].totalIncidents[0]?.count || 0,
      bySeverity: stats[0].bySeverity,
      byCategory: stats[0].byCategory,
      byRegion: stats[0].byRegion,
      byMonth: stats[0].byMonth,
      byGBU: stats[0].byGBU,
    };

    console.log("📊 Statistics calculated:");
    console.log(`   Total: ${responseData.total}`);
    console.log(`   By Severity: ${responseData.bySeverity.length} levels`);
    console.log(`   By Category: ${responseData.byCategory.length} categories`);
    console.log(`   By Region: ${responseData.byRegion.length} regions`);
    console.log(`   By Month: ${responseData.byMonth.length} month entries`);
    console.log(`   By GBU: ${responseData.byGBU.length} GBUs`);
    console.log("📤 Sending statistics data\n");

    res.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("❌ Error in getIncidentStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
};

// Get unique values for filters (for dropdowns)
const getFilterOptions = async (req, res) => {
  try {
    console.log("\n📥 GET /api/incidents/filters/options - Request received");

    const [years, regions, gbus, categories, locations] = await Promise.all([
      Incident.distinct("year").sort((a, b) => b - a),
      Incident.distinct("region").sort(),
      Incident.distinct("gbu").sort(),
      Incident.distinct("primary_category").sort(),
      Incident.distinct("location").sort(),
    ]);

    const responseData = {
      years,
      regions,
      gbus,
      categories,
      locations,
    };

    console.log("📋 Filter options retrieved:");
    console.log(`   Years: ${years.length} (${years.slice(0, 3).join(", ")}...)`);
    console.log(`   Regions: ${regions.length} (${regions.slice(0, 3).join(", ")}...)`);
    console.log(`   GBUs: ${gbus.length} (${gbus.slice(0, 3).join(", ")}...)`);
    console.log(`   Categories: ${categories.length} (${categories.slice(0, 3).join(", ")}...)`);
    console.log(`   Locations: ${locations.length} (${locations.slice(0, 3).join(", ")}...)`);
    console.log("📤 Sending filter options\n");

    res.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("❌ Error in getFilterOptions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching filter options",
      error: error.message,
    });
  }
};

module.exports = {
  getAllIncidents,
  getIncidentById,
  getIncidentStats,
  getFilterOptions,
};

