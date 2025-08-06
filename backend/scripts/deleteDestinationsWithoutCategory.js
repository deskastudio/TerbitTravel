// Delete destinations without category (USE WITH CAUTION!)
import mongoose from "mongoose";
import Destination from "../src/models/destination.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect("mongodb://localhost:27017/terbit_travel", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  console.log("🔌 Connected to MongoDB");

  try {
    // Find destinations without category
    const destinationsWithoutCategory = await Destination.find({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: "" },
      ],
    });

    console.log(
      `⚠️  Found ${destinationsWithoutCategory.length} destinations without category:`
    );
    destinationsWithoutCategory.forEach((dest) => {
      console.log(`  - ${dest.nama} (${dest._id})`);
    });

    if (destinationsWithoutCategory.length === 0) {
      console.log("✅ No destinations without category found!");
      await mongoose.disconnect();
      process.exit(0);
      return;
    }

    console.log(
      "\n⚠️  WARNING: This will permanently delete these destinations and their images!"
    );
    console.log("⚠️  Make sure you want to proceed...");

    // Comment out the following lines to prevent accidental deletion
    /*
    // Delete associated images
    for (const dest of destinationsWithoutCategory) {
      if (dest.foto && dest.foto.length > 0) {
        for (const fotoPath of dest.foto) {
          const filePath = path.join(__dirname, "../../", fotoPath);
          try {
            if (fs.existsSync(filePath)) {
              await fs.promises.unlink(filePath);
              console.log(`🗑️  Deleted image: ${filePath}`);
            }
          } catch (error) {
            console.error(`❌ Error deleting image ${filePath}:`, error);
          }
        }
      }
    }
    
    // Delete destinations from database
    const deleteResult = await Destination.deleteMany({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: "" }
      ]
    });
    
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} destinations`);
    */

    console.log(
      "🚫 DELETION BLOCKED - Uncomment the deletion code if you really want to delete"
    );
  } catch (error) {
    console.error("❌ Error:", error);
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB");
  process.exit(0);
});
