// routes/paymentRoutes.js
import express from 'express';
import { createPayment, handleNotification, getPaymentStatus } from '../controllers/payment.controller.js'; // Dengan ekstensi .js

const router = express.Router();

// Route untuk membuat transaksi pembayaran Midtrans
router.post('/create', createPayment);

// Route untuk menerima notifikasi dari Midtrans (webhook)
router.post('/notification', handleNotification);

// Route untuk mengecek status pembayaran
router.get('/status/:bookingId', getPaymentStatus);

// Tambahkan route untuk simulasi pembayaran berhasil (untuk development)
router.post('/complete/:bookingId', (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Log untuk debugging
    console.log(`Completing payment for booking ${bookingId} (development mode)`);
    
    // Return sukses
    res.status(200).json({
      success: true,
      message: 'Payment completed successfully (development mode)'
    });
  } catch (error) {
    console.error('Error in complete payment route:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing payment'
    });
  }
});

export default router;