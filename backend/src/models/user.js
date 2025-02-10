import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password hanya required jika bukan user Google
    },
    minlength: 6,
  },
  alamat: {
    type: String,
    required: function() {
      return !this.googleId; // Alamat opsional untuk user Google
    },
    trim: true,
  },
  noTelp: {
    type: String,
    required: function() {
      return !this.googleId; // No telp opsional untuk user Google
    },
    trim: true,
  },
  instansi: {
    type: String,
    trim: true,
  },
  foto: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  role: {
    type: String,
    default: 'user'
  }
}, {
  timestamps: true
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
