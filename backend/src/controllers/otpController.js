import { sendOTP, verifyOTP } from '../config/otpService.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Sesuaikan dengan nama model User Anda

// Controller untuk mengirim OTP
export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    // Cek apakah email terdaftar
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'Email not registered' });
    }
    
    // Kirim OTP
    const result = await sendOTP(email);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in send-otp controller:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to send OTP' 
    });
  }
};

// Controller untuk verifikasi OTP dan login
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }
    
    // Verifikasi OTP
    const result = await verifyOTP(email, otp);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Buat JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Return token dan info user
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // tambahkan field user lain yang diperlukan
      }
    });
  } catch (error) {
    console.error('Error in verify-otp controller:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to verify OTP' 
    });
  }
};