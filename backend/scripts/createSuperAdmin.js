// scripts/createSuperAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import AdminUser from "../src/models/adminUser.js";

// Load environment variables
dotenv.config();

const createSuperAdmin = async () => {
  try {
    console.log("🚀 Starting Super Admin creation process...");
    console.log("📡 Connecting to MongoDB...");

    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);

    // Check if super admin already exists
    console.log("🔍 Checking for existing super admin...");
    const existingSuperAdmin = await AdminUser.findOne({ role: 'super-admin' });
    
    if (existingSuperAdmin) {
      console.log("⚠️  Super admin already exists:");
      console.log(`   📧 Email: ${existingSuperAdmin.email}`);
      console.log(`   👤 Name: ${existingSuperAdmin.name}`);
      console.log(`   📅 Created: ${existingSuperAdmin.createdAt}`);
      console.log(`   ✅ Active: ${existingSuperAdmin.isActive}`);
      
      // Ask if user wants to create another admin
      console.log("\n🔄 Creating another admin user instead...");
      
      const adminData = {
        email: "admin@travedia.com",
        password: "Admin123!",
        name: "Admin User",
        role: "admin",
        isActive: true,
        createdBy: existingSuperAdmin._id
      };

      // Check if this admin already exists
      const existingAdmin = await AdminUser.findOne({ email: adminData.email });
      if (existingAdmin) {
        console.log("⚠️  Regular admin also already exists");
        console.log("✨ Available accounts:");
        console.log(`   🔑 Super Admin: ${existingSuperAdmin.email} / SuperAdmin123!`);
        console.log(`   👤 Admin: ${existingAdmin.email} / Admin123!`);
        return;
      }

      const admin = new AdminUser(adminData);
      await admin.save();
      
      console.log("🎉 Regular Admin created successfully!");
      console.log(`📧 Email: ${adminData.email}`);
      console.log(`🔐 Password: ${adminData.password}`);
      return;
    }

    // Super admin data
    const superAdminData = {
      email: "superadmin@travedia.com",
      password: "SuperAdmin123!",
      name: "Super Administrator",
      role: "super-admin",
      isActive: true
    };

    console.log("👑 Creating Super Admin...");

    // Create super admin using the model's static method
    const superAdmin = await AdminUser.createSuperAdmin(superAdminData);

    console.log("🎉 Super Admin created successfully!");
    console.log("═══════════════════════════════════");
    console.log("📧 Email:", superAdminData.email);
    console.log("🔐 Password:", superAdminData.password);
    console.log("👤 Name:", superAdminData.name);
    console.log("🔑 Role:", superAdminData.role);
    console.log("✅ Status: Active");
    console.log("═══════════════════════════════════");
    console.log("");
    console.log("⚠️  IMPORTANT NOTES:");
    console.log("   • Please change the password after first login!");
    console.log("   • Keep these credentials safe!");
    console.log("   • Super Admin has full system access!");
    console.log("");
    console.log("🔗 Login URLs:");
    console.log("   • Local: http://localhost:5173/admin/login");
    console.log("   • Ngrok: https://your-ngrok-url.ngrok-free.app/admin/login");

    // Create a regular admin as well
    console.log("\n👤 Creating regular admin user...");
    
    const adminData = {
      email: "admin@travedia.com",
      password: "Admin123!",
      name: "Admin User",
      role: "admin",
      isActive: true,
      createdBy: superAdmin._id
    };

    const admin = new AdminUser(adminData);
    await admin.save();

    console.log("🎉 Regular Admin created successfully!");
    console.log("═══════════════════════════════════");
    console.log("📧 Email:", adminData.email);
    console.log("🔐 Password:", adminData.password);
    console.log("👤 Name:", adminData.name);
    console.log("🔑 Role:", adminData.role);
    console.log("═══════════════════════════════════");

    console.log("\n🎊 All admin accounts created successfully!");
    console.log("📋 Summary:");
    console.log("   1. Super Admin: superadmin@travedia.com / SuperAdmin123!");
    console.log("   2. Regular Admin: admin@travedia.com / Admin123!");

  } catch (error) {
    console.error("❌ Error creating admin accounts:", error.message);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.log(`📧 Duplicate ${field}: This ${field} already exists in database`);
    } else if (error.name === 'ValidationError') {
      console.log("📋 Validation errors:");
      Object.keys(error.errors).forEach(key => {
        console.log(`   • ${key}: ${error.errors[key].message}`);
      });
    } else {
      console.log("🔍 Full error details:", error);
    }
  } finally {
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("📡 MongoDB connection closed");
    }
    process.exit(0);
  }
};

// Tambahan: Script untuk list semua admin
const listAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📋 Current Admin Users:");
    console.log("═══════════════════════════════════");
    
    const admins = await AdminUser.find({}).select('-password');
    
    if (admins.length === 0) {
      console.log("❌ No admin users found");
    } else {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.email}`);
        console.log(`   👤 Name: ${admin.name}`);
        console.log(`   🔑 Role: ${admin.role}`);
        console.log(`   ✅ Active: ${admin.isActive}`);
        console.log(`   📅 Created: ${admin.createdAt}`);
        console.log("");
      });
    }
  } catch (error) {
    console.error("❌ Error listing admins:", error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(0);
  }
};

// Check command line arguments
const command = process.argv[2];

if (command === 'list') {
  listAdmins();
} else {
  createSuperAdmin();
}