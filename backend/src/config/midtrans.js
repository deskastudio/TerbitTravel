// Perbaikan pada midtrans.js
import midtransClient from "midtrans-client";
import dotenv from "dotenv";
dotenv.config();

// Pastikan environment variables sudah dimuat dan gunakan hanya dari env
const snap = new midtransClient.Snap({
  isProduction: false, // tetap gunakan sandbox untuk pengembangan
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const createPaymentTransaction = async (order) => {
  const parameter = {
    transaction_details: {
      order_id: `TRX-${order._id}`,
      gross_amount: order.harga,
    },
    customer_details: {
      first_name: order.userId.nama,
      email: order.userId.email,
      phone: order.userId.noTelp,
    },
    item_details: [
      {
        id: order.packageId._id,
        price: order.harga,
        quantity: 1,
        name: `Paket: ${order.packageId.nama}`,
      },
    ],
    callbacks: {
      finish: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking-success`,
      error: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking-error`,
      pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking-pending`
    }
  };

  const transaction = await snap.createTransaction(parameter);
  return transaction;
};