// scripts/createLocalAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import AdminUser from "../src/models/adminUser.js";

dotenv.config();

async function createLocalAdmin() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const adminData = {
      email: "superadmin@gmail.com",
      password: "SuperAdmin123!",
      name: "Local Admin",
      role: "admin",
      isActive: true,
    };

    console.log(`\n🔍 Checking if admin exists: ${adminData.email}`);

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log("🔄 Admin exists, updating password...");

      // Update existing admin password
      existingAdmin.password = adminData.password;
      await existingAdmin.save();

      console.log("✅ Admin password updated!");
    } else {
      console.log("🔄 Creating new admin...");

      // Create new admin
      const newAdmin = new AdminUser(adminData);
      await newAdmin.save();

      console.log("✅ New admin created!");
    }

    console.log("\n🎉 Admin credentials:");
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`🔑 Password: ${adminData.password}`);
    console.log("\nYou can now login with these credentials.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

createLocalAdmin();
