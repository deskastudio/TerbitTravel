// scripts/removePackageImageFields.js
const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/terbit_travel";

async function removeImageFields() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get the packages collection
    const db = mongoose.connection.db;
    const packagesCollection = db.collection("packages");

    console.log("📊 Checking current packages...");
    const packageCount = await packagesCollection.countDocuments();
    console.log(`Found ${packageCount} packages in database`);

    // Remove gambar and gambarMulti fields from all documents
    console.log("🗑️ Removing gambar and gambarMulti fields from packages...");
    const result = await packagesCollection.updateMany(
      {},
      {
        $unset: {
          gambar: "",
          gambarMulti: "",
        },
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} packages`);
    console.log("🎉 Package image fields removed successfully!");

    // Close connection
    await mongoose.connection.close();
    console.log("👋 Database connection closed");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run the script
removeImageFields();
