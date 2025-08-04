// src/controllers/adminAuthController.js
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import AdminUser from "../models/adminUser.js";

// Generate JWT token
const generateToken = (adminData) => {
  const payload = {
    adminId: adminData._id,
    email: adminData.email,
    role: adminData.role,
  };

  const jwtSecret = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET;
  const expiresIn = "8h"; // Admin session 8 hours

  return jwt.sign(payload, jwtSecret, { expiresIn });
};

// Membuat akun admin / super admin
export const createAdminAccount = async (req, res) => {
  try {
    console.log("🚀 Starting Admin Account Creation...");

    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const {
      email,
      password,
      name,
      role = "admin",
      createdBy = null,
    } = req.body;

    // Periksa apakah email sudah digunakan
    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
        error: "EMAIL_EXISTS",
      });
    }

    // Jika membuat super-admin, pastikan tidak ada super-admin lain
    if (role === "super-admin") {
      const existingSuperAdmin = await AdminUser.findOne({
        role: "super-admin",
      });

      if (existingSuperAdmin) {
        return res.status(400).json({
          success: false,
          message: "Super Admin already exists",
          error: "SUPER_ADMIN_EXISTS",
        });
      }

      // Buat super admin menggunakan metode statis dari model
      const superAdmin = await AdminUser.createSuperAdmin({
        email,
        password,
        name,
        role: "super-admin",
        isActive: true,
      });

      return res.status(201).json({
        success: true,
        message: "Super Admin created successfully",
        admin: superAdmin,
      });
    }

    // Jika bukan super-admin, buat admin biasa
    const adminData = {
      email,
      password,
      name,
      role: "admin",
      isActive: true,
      createdBy,
    };

    const admin = new AdminUser(adminData);
    await admin.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin,
    });
  } catch (error) {
    console.error("❌ Error creating admin account:", error.message);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Duplicate ${field}`,
        error: "DUPLICATE_FIELD",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating admin",
      error: error.message,
    });
  }
};

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    console.log("\n🚀 ========== ADMIN LOGIN DEBUG START ==========");
    console.log("📥 Request body:", JSON.stringify(req.body, null, 2));
    console.log("🌐 Request headers:", JSON.stringify(req.headers, null, 2));

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation errors:", errors.array());
      return res.status(400).json({
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    console.log(`🔍 Login attempt details:`);
    console.log(`   📧 Email: "${email}"`);
    console.log(`   🔑 Password: "${password}"`);
    console.log(`   📏 Email length: ${email ? email.length : "undefined"}`);
    console.log(
      `   📏 Password length: ${password ? password.length : "undefined"}`
    );
    console.log(`   🔤 Email type: ${typeof email}`);
    console.log(`   🔤 Password type: ${typeof password}`);

    // Find admin by email
    console.log(`\n🔍 Searching for admin with email: "${email}"`);
    const admin = await AdminUser.findActiveByEmail(email);

    if (!admin) {
      console.log(`❌ Admin not found in database`);
      console.log(`🔍 Checking all admins in database...`);

      const allAdmins = await AdminUser.find({}).select("email isActive");
      console.log(`📊 Total admins found: ${allAdmins.length}`);
      allAdmins.forEach((a, index) => {
        console.log(
          `   ${index + 1}. Email: "${a.email}" | Active: ${a.isActive}`
        );
      });

      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    console.log(`✅ Admin found in database:`);
    console.log(`   📧 Email: "${admin.email}"`);
    console.log(`   👤 Name: "${admin.name}"`);
    console.log(`   🔑 Role: "${admin.role}"`);
    console.log(`   ✅ Active: ${admin.isActive}`);
    console.log(`   🔒 Locked: ${admin.isLocked}`);
    console.log(`   🔢 Login attempts: ${admin.loginAttempts}`);
    console.log(`   🕒 Lock until: ${admin.lockUntil}`);
    console.log(
      `   🔑 Password hash (first 30 chars): ${admin.password.substring(
        0,
        30
      )}...`
    );
    console.log(`   📏 Password hash length: ${admin.password.length}`);

    // Check if account is locked
    if (admin.isLocked) {
      console.log(`🔒 Account is locked`);
      return res.status(423).json({
        message:
          "Akun Anda terkunci sementara karena terlalu banyak percobaan login yang gagal. Coba lagi nanti.",
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      console.log(`⚠️ Account is not active`);
      return res.status(403).json({
        message: "Akun admin Anda telah dinonaktifkan",
      });
    }

    // Verify password
    console.log(`\n🔍 Password verification:`);
    console.log(`   🔑 Input password: "${password}"`);
    console.log(`   🔒 Stored hash: ${admin.password}`);
    console.log(`   📏 Input length: ${password.length}`);
    console.log(`   📏 Hash length: ${admin.password.length}`);

    try {
      const isPasswordValid = await admin.comparePassword(password);
      console.log(`   ✅ Password comparison result: ${isPasswordValid}`);

      // Test dengan bcrypt secara langsung juga
      const bcrypt = await import("bcryptjs");
      const directCompare = await bcrypt.default.compare(
        password,
        admin.password
      );
      console.log(`   🔑 Direct bcrypt compare: ${directCompare}`);

      if (!isPasswordValid) {
        console.log(`❌ Password invalid for: ${email}`);
        console.log(`🔍 Troubleshooting info:`);
        console.log(`   • Make sure password is exactly: "SuperAdmin123!"`);
        console.log(`   • Check for extra spaces or special characters`);
        console.log(`   • Verify the admin was created properly`);

        // Increment failed login attempts
        await admin.incLoginAttempts();
        console.log(`📈 Login attempts incremented`);

        return res.status(401).json({
          message: "Email atau password salah",
        });
      }
    } catch (passwordError) {
      console.error(`❌ Password comparison error:`, passwordError);
      return res.status(500).json({
        message: "Error during password verification",
      });
    }

    console.log(`✅ Password verification successful!`);

    // Reset login attempts on successful login
    if (admin.loginAttempts > 0) {
      await admin.resetLoginAttempts();
      console.log(`🔄 Login attempts reset`);
    }

    // Update last login
    await admin.updateLastLogin();
    console.log(`⏰ Last login updated`);

    // Generate token
    console.log(`\n🎫 Generating JWT token...`);
    console.log(
      `   🔐 JWT Secret available: ${!!(
        process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET
      )}`
    );
    console.log(
      `   🔑 Secret length: ${
        (process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET)?.length || 0
      }`
    );

    const token = generateToken(admin);
    console.log(`   ✅ Token generated: ${token.substring(0, 50)}...`);

    // Response data (exclude sensitive information)
    const adminResponse = {
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      lastLogin: admin.lastLogin,
    };

    console.log(`🎉 Login successful for: ${email} (${admin.role})`);
    console.log(`📤 Response data:`, JSON.stringify(adminResponse, null, 2));
    console.log("🏁 ========== ADMIN LOGIN DEBUG END ==========\n");

    res.json({
      message: "Login berhasil",
      token,
      user: adminResponse,
      expiresIn: 8 * 60 * 60, // 8 hours in seconds
    });
  } catch (error) {
    console.error("💥 Admin login error:", error);
    console.error("📊 Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    console.log("🏁 ========== ADMIN LOGIN DEBUG END (ERROR) ==========\n");

    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Logout admin
export const logoutAdmin = async (req, res) => {
  try {
    console.log(`🚪 Admin logout attempt for: ${req.admin?.email}`);

    const adminId = req.admin.adminId;

    // Update logout time in database
    const admin = await AdminUser.findById(adminId);
    if (admin) {
      admin.lastLogout = new Date();
      await admin.save();
      console.log(`✅ Logout time updated for: ${admin.email}`);
    }

    console.log(`🎉 Admin logout successful: ${req.admin.email}`);

    res.json({
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("❌ Admin logout error:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    console.log(`👤 Getting profile for admin: ${req.admin?.email}`);

    const admin = await AdminUser.findById(req.admin.adminId).select(
      "-password"
    );

    if (!admin) {
      console.log(`❌ Admin not found: ${req.admin.adminId}`);
      return res.status(404).json({
        message: "Admin tidak ditemukan",
      });
    }

    console.log(`✅ Profile retrieved for: ${admin.email}`);

    res.json({
      data: admin,
    });
  } catch (error) {
    console.error("❌ Get admin profile error:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Verify admin token
export const verifyAdminToken = (req, res) => {
  try {
    console.log(`🔐 Token verification for: ${req.admin?.email}`);

    // If middleware passes, token is valid
    res.json({
      message: "Token valid",
      admin: {
        adminId: req.admin.adminId,
        email: req.admin.email,
        name: req.admin.name,
        role: req.admin.role,
      },
    });
  } catch (error) {
    console.error("❌ Token verification error:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    console.log(`📝 Profile update attempt for: ${req.admin?.email}`);

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation errors:", errors.array());
      return res.status(400).json({
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const adminId = req.admin.adminId;
    const { name, email } = req.body;

    console.log(`📥 Update data:`, { name, email });

    // Find admin
    const admin = await AdminUser.findById(adminId);
    if (!admin) {
      console.log(`❌ Admin not found: ${adminId}`);
      return res.status(404).json({
        message: "Admin tidak ditemukan",
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== admin.email) {
      const existingAdmin = await AdminUser.findOne({
        email: email.toLowerCase(),
        _id: { $ne: adminId },
      });

      if (existingAdmin) {
        console.log(`❌ Email already exists: ${email}`);
        return res.status(400).json({
          message: "Email sudah digunakan oleh admin lain",
        });
      }

      admin.email = email.toLowerCase();
      console.log(`📧 Email updated to: ${email}`);
    }

    // Update name if provided
    if (name) {
      admin.name = name;
      console.log(`👤 Name updated to: ${name}`);
    }

    await admin.save();

    console.log(`✅ Profile updated successfully for: ${admin.email}`);

    res.json({
      message: "Profile berhasil diperbarui",
      data: admin,
    });
  } catch (error) {
    console.error("❌ Update admin profile error:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Change admin password
export const changeAdminPassword = async (req, res) => {
  try {
    console.log(`🔐 Password change attempt for: ${req.admin?.email}`);

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation errors:", errors.array());
      return res.status(400).json({
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const adminId = req.admin.adminId;
    const { currentPassword, newPassword } = req.body;

    console.log(`🔍 Password change data received`);

    // Find admin with password
    const admin = await AdminUser.findById(adminId);
    if (!admin) {
      console.log(`❌ Admin not found: ${adminId}`);
      return res.status(404).json({
        message: "Admin tidak ditemukan",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    console.log(`🔐 Current password valid: ${isCurrentPasswordValid}`);

    if (!isCurrentPasswordValid) {
      console.log(`❌ Current password invalid for: ${admin.email}`);
      return res.status(400).json({
        message: "Password saat ini salah",
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    console.log(`✅ Password changed successfully for: ${admin.email}`);

    res.json({
      message: "Password berhasil diubah",
    });
  } catch (error) {
    console.error("❌ Change admin password error:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
