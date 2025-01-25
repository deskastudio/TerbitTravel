import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 5, // maksimal 5 registrasi per IP
  message: {
    status: "error",
    message:
      "Terlalu banyak percobaan registrasi. Silakan coba lagi dalam 1 jam.",
  },
});

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 3, // maksimal 3 percobaan per IP
  message: {
    status: "error",
    message: "Terlalu banyak percobaan OTP. Silakan coba lagi dalam 15 menit.",
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // maksimal 5 percobaan login per IP
  message: {
    status: "error",
    message:
      "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.",
  },
});
