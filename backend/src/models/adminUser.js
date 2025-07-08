// src/models/adminUser.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'super-admin'],
      message: 'Role must be either admin or super-admin'
    },
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  lastLogout: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    default: null
  },
  profileImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index untuk performance
adminUserSchema.index({ email: 1 });
adminUserSchema.index({ role: 1 });
adminUserSchema.index({ isActive: 1 });

// Virtual untuk check jika account terkunci
adminUserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware untuk hash password
adminUserSchema.pre('save', async function(next) {
  // Only hash password if it's new or being modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password dengan salt round 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method untuk compare password
adminUserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method untuk increment login attempts
adminUserSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // After 5 failed attempts, lock account for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method untuk reset login attempts
adminUserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method untuk update last login
adminUserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static method untuk create super admin
adminUserSchema.statics.createSuperAdmin = async function(adminData) {
  const { email, password, name } = adminData;
  
  // Check if super admin already exists
  const existingSuperAdmin = await this.findOne({ role: 'super-admin' });
  if (existingSuperAdmin) {
    throw new Error('Super admin already exists');
  }
  
  const superAdmin = new this({
    email,
    password,
    name,
    role: 'super-admin',
    isActive: true
  });
  
  return await superAdmin.save();
};

// Static method untuk find active admin by email
adminUserSchema.statics.findActiveByEmail = function(email) {
  return this.findOne({ 
    email: email.toLowerCase(), 
    isActive: true 
  });
};

// Transform output (hide sensitive data)
adminUserSchema.methods.toJSON = function() {
  const adminObject = this.toObject();
  delete adminObject.password;
  delete adminObject.loginAttempts;
  delete adminObject.lockUntil;
  return adminObject;
};

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

export default AdminUser;