const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const Incident = require("../models/Incident");

dotenv.config();

function cleanMongoURI(uri) {
  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }
  if (uri.startsWith("mongodb+srv://")) {
    return uri.replace(/:\d+(\/|$)/, "$1");
  }
  return uri;
}

async function importData() {
  try {
    // Connect to MongoDB
    const mongoURI = cleanMongoURI(process.env.MONGO_URI);
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");

    // Read JSON file
    const filePath = path.join(__dirname, "../data/db.dashboard_incidents.json");
    console.log(`📖 Reading file: ${filePath}`);

    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    console.log(`📊 Found ${data.length} records to import`);

    // Transform data: convert MongoDB export format to Mongoose format
    const transformedData = data.map((item) => {
      const transformed = {
        id: item.id,
        incident_number: item.incident_number,
        incident_date: new Date(item.incident_date),
        action_cause: item.action_cause || "",
        behavior_type: item.behavior_type || "",
        company_type: item.company_type || "",
        craft_code: item.craft_code || "",
        day_of_year: item.day_of_year,
        gbu: item.gbu || "",
        is_lcv: item.is_lcv || false,
        job: item.job || "",
        location: item.location || "",
        month: item.month,
        near_miss_sub_category: item.near_miss_sub_category || "",
        primary_category: item.primary_category || "",
        region: item.region || "",
        severity_level: item.severity_level || 0,
        unsafe_condition_or_behavior: item.unsafe_condition_or_behavior || "",
        violation_probability_level: item.violation_probability_level || 0,
        violation_risk_severity_level: item.violation_risk_severity_level || 0,
        violation_severity_level: item.violation_severity_level || 0,
        week: item.week,
        year: item.year,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        lastUpdated: item.lastUpdated ? new Date(item.lastUpdated) : new Date(),
      };
      return transformed;
    });

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🗑️  Clearing existing incidents...");
    await Incident.deleteMany({});
    console.log("✅ Existing data cleared");

    // Insert data in batches to avoid memory issues
    const batchSize = 1000;
    let imported = 0;
    let errors = 0;

    console.log(`📦 Importing data in batches of ${batchSize}...`);

    for (let i = 0; i < transformedData.length; i += batchSize) {
      const batch = transformedData.slice(i, i + batchSize);
      try {
        await Incident.insertMany(batch, { ordered: false });
        imported += batch.length;
        console.log(`✅ Imported ${imported}/${transformedData.length} records`);
      } catch (error) {
        // Handle duplicate key errors
        if (error.code === 11000) {
          const duplicates = error.writeErrors?.filter(
            (e) => e.code === 11000
          ).length || 0;
          imported += batch.length - duplicates;
          errors += duplicates;
          console.log(
            `⚠️  Batch ${i / batchSize + 1}: ${duplicates} duplicates skipped`
          );
        } else {
          console.error(`❌ Error in batch ${i / batchSize + 1}:`, error.message);
          errors += batch.length;
        }
      }
    }

    console.log("\n📈 Import Summary:");
    console.log(`   ✅ Successfully imported: ${imported} records`);
    console.log(`   ❌ Errors/Duplicates: ${errors} records`);
    console.log(`   📊 Total processed: ${transformedData.length} records`);

    // Get collection stats
    const totalCount = await Incident.countDocuments();
    console.log(`\n💾 Total records in database: ${totalCount}`);

    await mongoose.connection.close();
    console.log("✅ Import completed and connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Import failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run import
importData();

