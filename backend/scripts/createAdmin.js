// scripts/createAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import AdminUser from "../src/models/adminUser.js";

dotenv.config();

async function createAdmin() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({
      email: "admin@example.com",
    });

    if (existingAdmin) {
      console.log("ℹ️ Admin already exists:");
      console.log(`   📧 Email: ${existingAdmin.email}`);
      console.log(`   👤 Name: ${existingAdmin.name}`);
      console.log(`   🔑 Role: ${existingAdmin.role}`);
      console.log(`   ✅ Active: ${existingAdmin.isActive}`);
      return;
    }

    // Create super admin
    console.log("🔄 Creating super admin...");
    const superAdmin = await AdminUser.createSuperAdmin({
      email: "admin@example.com",
      password: "SuperAdmin123!",
      name: "Super Administrator",
      role: "super-admin",
      isActive: true,
    });

    console.log("✅ Super admin created successfully!");
    console.log("📧 Email: admin@example.com");
    console.log("🔑 Password: SuperAdmin123!");
    console.log("👤 Name: Super Administrator");
    console.log("🔐 Role: super-admin");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

createAdmin();
