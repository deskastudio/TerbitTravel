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

  // Tambahkan URL notifikasi menggunakan URL Ngrok
  if (process.env.WEBHOOK_URL) {
    parameter.notification = {
      payment_notification: process.env.WEBHOOK_URL,
      finish_notification: process.env.WEBHOOK_URL
    };
  }

  const transaction = await snap.createTransaction(parameter);
  return transaction;
};