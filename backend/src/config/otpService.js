import OTP from '../models/otp.js';
import { sendOTPEmail } from './emailConfig.js';

// Fungsi untuk menghasilkan OTP 6 digit
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Fungsi untuk mengirim OTP ke email pengguna
export const sendOTP = async (email) => {
  try {
    // Hapus OTP sebelumnya jika ada
    await OTP.deleteMany({ email });

    // Buat OTP baru
    const otp = generateOTP();
    
    // Simpan OTP ke database
    const otpDocument = new OTP({
      email,
      otp,
    });
    
    await otpDocument.save();
    
    // Kirim OTP melalui email
    await sendOTPEmail(email, otp);
    
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

//test

// Fungsi untuk memverifikasi OTP
export const verifyOTP = async (email, otp) => {
  try {
    // Cari OTP yang cocok
    const otpRecord = await OTP.findOne({ email, otp });
    
    if (!otpRecord) {
      return { success: false, message: 'Invalid OTP' };
    }
    
    // Hapus OTP dari database setelah diverifikasi
    await OTP.deleteOne({ _id: otpRecord._id });
    
    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Failed to verify OTP');
  }
};