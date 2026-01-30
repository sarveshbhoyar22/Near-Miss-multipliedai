const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
dotenv.config();

const PORT = process.env.PORT || 3000;

function cleanMongoURI(uri) {
  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }
  
  // If using mongodb+srv://, remove any port number
  if (uri.startsWith("mongodb+srv://")) {
    // Remove port number if present (e.g., :27017)
    return uri.replace(/:\d+(\/|$)/, "$1");
  }
  
  return uri;
}

function connectDB() {
  try {
    const mongoURI = cleanMongoURI(process.env.MONGO_URI);
    
    mongoose
      .connect(mongoURI)
      .then(() => {
        console.log("MongoDB Connected");
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
      });
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
}

connectDB();
