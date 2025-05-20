// payment.controller.js
import express from 'express';
import midtransClient from 'midtrans-client';
import { BookingModel } from '../models/booking.js';
import dotenv from 'dotenv';

// Pastikan environment variables dimuat
dotenv.config();

// Inisialisasi Snap API dengan konfigurasi yang benar
const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Fungsi createPayment
export const createPayment = async (req, res) => {
  console.log('Starting createPayment:', req.body);
  
  try {
    const { bookingId, customerInfo, packageInfo, jumlahPeserta, totalAmount } = req.body;
    
    // Validasi parameter yang diterima
    if (!bookingId || !customerInfo || !packageInfo || !jumlahPeserta || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Buat order ID yang unik
    const orderId = `ORDER-${bookingId}-${Date.now()}`;
    
    // Buat parameter untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: parseInt(totalAmount.toString())
      },
      customer_details: {
        first_name: customerInfo.nama ? customerInfo.nama.split(' ')[0] : 'Customer',
        last_name: customerInfo.nama ? customerInfo.nama.split(' ').slice(1).join(' ') : '',
        email: customerInfo.email || 'customer@example.com',
        phone: customerInfo.telepon || '08123456789'
      },
      item_details: [
        {
          id: packageInfo.id || 'tour-package',
          price: parseInt(packageInfo.harga.toString()),
          quantity: parseInt(jumlahPeserta.toString()),
          name: packageInfo.nama || 'Tour Package'
        }
      ],
      // Pastikan callback URL benar
      callbacks: {
        finish: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/booking-detail/${bookingId}`,
        error: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/booking-error/${bookingId}`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/booking-pending/${bookingId}`
      }
    };

    // Log parameter untuk debug
    console.log('Midtrans parameter:', JSON.stringify(parameter));

    // Buat token Snap untuk pembayaran
    const snapInstance = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });
    
    const transaction = await snapInstance.createTransaction(parameter);
    
    // Token yang akan digunakan di frontend
    const snapToken = transaction.token;
    
    console.log('Midtrans transaction created:', {
      token: snapToken,
      redirect_url: transaction.redirect_url
    });
    
    // Simpan booking ke database
    try {
      console.log('Attempting to save booking data to MongoDB');
      
      // Cek apakah booking sudah ada (berdasarkan bookingId)
      let booking = null;
      
      // Jika bookingId adalah objectId MongoDB yang valid
      if (bookingId.match(/^[0-9a-fA-F]{24}$/)) {
        booking = await BookingModel.findById(bookingId);
      } else {
        // Jika tidak, cari dengan custom id field
        booking = await BookingModel.findOne({ customId: bookingId });
      }
      
      if (!booking) {
        console.log('Creating new booking record');
        booking = new BookingModel({
          customId: bookingId, // Tambahkan custom ID jika bookingId bukan ObjectId
          packageId: packageInfo.id || null,
          jumlahPeserta: jumlahPeserta,
          harga: totalAmount,
          status: 'pending',
          customerInfo: {
            nama: customerInfo.nama || '',
            email: customerInfo.email || '',
            telepon: customerInfo.telepon || '',
            alamat: customerInfo.alamat || '',
            instansi: customerInfo.instansi || '',
            catatan: customerInfo.catatan || ''
          },
          paymentToken: snapToken,
          paymentOrderId: orderId,
          paymentStatus: 'pending'
        });
      } else {
        console.log('Updating existing booking:', booking._id);
        booking.status = 'pending';
        booking.paymentToken = snapToken;
        booking.paymentOrderId = orderId;
        booking.paymentStatus = 'pending';
        // Update customer info jika ada
        if (customerInfo) {
          booking.customerInfo = {
            ...booking.customerInfo,
            nama: customerInfo.nama || (booking.customerInfo ? booking.customerInfo.nama : ''),
            email: customerInfo.email || (booking.customerInfo ? booking.customerInfo.email : ''),
            telepon: customerInfo.telepon || (booking.customerInfo ? booking.customerInfo.telepon : '')
          };
        }
      }
      
      // Simpan ke database
      const savedBooking = await booking.save();
      console.log('Booking saved successfully:', savedBooking._id);
    } catch (dbError) {
      console.error('Error saving booking to database:', dbError);
      // Tidak mengembalikan error ke client, karena transaksi Midtrans berhasil
    }
    
    res.status(200).json({
      success: true,
      snap_token: snapToken,
      redirect_url: transaction.redirect_url,
      order_id: orderId
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment: ' + error.message,
      error: error.message
    });
  }
};

// Fungsi getPaymentStatus
export const getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log('Checking payment status for bookingId:', bookingId);
    
    // Cari booking di database (coba kedua kemungkinan)
    let booking = null;
    
    // Coba cari dengan MongoDB ObjectId jika format valid
    if (bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await BookingModel.findById(bookingId);
    } 
    
    // Jika tidak ditemukan, coba cari dengan customId
    if (!booking) {
      booking = await BookingModel.findOne({ customId: bookingId });
    }
    
    if (!booking) {
      console.log(`Booking not found for id: ${bookingId}`);
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }
    
    console.log(`Found booking:`, booking);
    
    // Kembalikan status pembayaran
    res.status(200).json({
      success: true,
      data: {
        bookingId: booking._id,
        customId: booking.customId,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        paymentDate: booking.paymentDate,
        paymentToken: booking.paymentToken,
        redirectUrl: booking.paymentRedirectUrl
      }
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error mendapatkan status pembayaran: ' + error.message
    });
  }
};

// Fungsi handleNotification
export const handleNotification = async (req, res) => {
  try {
    const notificationJson = req.body;
    console.log('Received notification from Midtrans:', JSON.stringify(notificationJson));
    
    // Validasi bahwa notification JSON memiliki data yang diperlukan
    if (!notificationJson || !notificationJson.order_id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification data'
      });
    }
    
    // Verifikasi notifikasi dari Midtrans
    let statusResponse;
    try {
      statusResponse = await snap.transaction.notification(notificationJson);
      console.log('Status response:', JSON.stringify(statusResponse));
    } catch (verifyError) {
      console.error('Error verifying Midtrans notification:', verifyError);
      return res.status(500).json({
        success: false,
        message: 'Error verifying notification'
      });
    }
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;
    
    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);
    
    // Extract bookingId dari orderId (format: ORDER-bookingId-timestamp)
    const bookingId = orderId.split('-')[1];
    
    if (!bookingId) {
      console.error('Could not extract bookingId from orderId:', orderId);
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }
    
    // Update status booking berdasarkan status transaksi
    let bookingStatus;
    
    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        bookingStatus = 'pending_verification';
      } else if (fraudStatus == 'accept') {
        bookingStatus = 'confirmed';
      }
    } else if (transactionStatus == 'settlement') {
      bookingStatus = 'confirmed';
    } else if (transactionStatus == 'pending') {
      bookingStatus = 'pending_verification';
    } else if (transactionStatus == 'deny' || transactionStatus == 'cancel' || transactionStatus == 'expire') {
      bookingStatus = 'cancelled';
    }
    
    if (bookingStatus) {
      try {
        // Cari booking (coba kedua kemungkinan)
        let booking = null;
        
        // Coba cari dengan MongoDB ObjectId jika format valid
        if (bookingId.match(/^[0-9a-fA-F]{24}$/)) {
          booking = await BookingModel.findById(bookingId);
        } 
        
        // Jika tidak ditemukan, coba cari dengan customId
        if (!booking) {
          booking = await BookingModel.findOne({ customId: bookingId });
        }
        
        if (booking) {
          booking.status = bookingStatus;
          booking.paymentStatus = transactionStatus;
          booking.paymentMethod = paymentType;
          booking.paymentDate = new Date();
          booking.midtransResponse = statusResponse; // Simpan respons lengkap
          
          await booking.save();
          console.log(`Successfully updated booking ${bookingId} with status ${bookingStatus}`);
        } else {
          console.error(`Booking ${bookingId} not found`);
        }
      } catch (dbError) {
        console.error(`Error updating booking ${bookingId}:`, dbError);
        // Tetap kembalikan 200 agar Midtrans tidak mencoba lagi
      }
    }
    
    // Selalu kembalikan status 200 ke Midtrans meskipun ada error
    // untuk mencegah percobaan notifikasi berulang
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling notification:', error);
    // Tetap kembalikan 200 ke Midtrans meskipun ada error internal
    res.status(200).json({
      success: true,
      message: 'Notification received with errors'
    });
  }
};