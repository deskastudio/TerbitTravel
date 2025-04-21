import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h', // OTP kedaluwarsa setelah 24 jam
  },
});

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;