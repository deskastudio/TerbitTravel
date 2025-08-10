// components/partials/mainPartials/payment/payment-redirect.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";

interface PaymentRedirectProps {
  type: "success" | "pending" | "error";
}

export default function PaymentRedirect({ type }: PaymentRedirectProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Extract Midtrans parameters
    const orderId = searchParams.get("order_id");
    const statusCode = searchParams.get("status_code");
    const transactionStatus = searchParams.get("transaction_status");

    // Extract booking ID from order_id (format: TRX-{bookingId}-{timestamp})
    let bookingId = "";
    if (orderId) {
      const match = orderId.match(/^TRX-(.+)-\d+$/);
      if (match) {
        bookingId = match[1];
      }
    }

    console.log(`🔄 Payment ${type} redirect:`, {
      orderId,
      statusCode,
      transactionStatus,
      bookingId,
      allParams: Object.fromEntries(searchParams),
    });

    // Redirect to appropriate page after 3 seconds
    const timer = setTimeout(() => {
      if (bookingId) {
        switch (type) {
          case "success":
            navigate(
              `/booking-detail/${bookingId}?payment_success=true&transaction_status=${transactionStatus}&from=midtrans`
            );
            break;
          case "pending":
            navigate(
              `/booking-detail/${bookingId}?payment_success=pending&transaction_status=${transactionStatus}&from=midtrans`
            );
            break;
          case "error":
            navigate(
              `/booking-error/${bookingId}?reason=payment_error&transaction_status=${transactionStatus}&from=midtrans`
            );
            break;
        }
      } else {
        // Fallback if no booking ID found
        navigate("/paket-wisata");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [type, searchParams, navigate]);

  const getConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-600" />,
          title: "Pembayaran Berhasil!",
          message: "Transaksi Anda telah berhasil diproses.",
          bgColor: "bg-green-50",
          textColor: "text-green-800",
        };
      case "pending":
        return {
          icon: <Clock className="h-16 w-16 text-yellow-600" />,
          title: "Pembayaran Dalam Proses",
          message: "Menunggu konfirmasi pembayaran.",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-800",
        };
      case "error":
        return {
          icon: <AlertCircle className="h-16 w-16 text-red-600" />,
          title: "Pembayaran Gagal",
          message: "Terjadi kesalahan dalam proses pembayaran.",
          bgColor: "bg-red-50",
          textColor: "text-red-800",
        };
    }
  };

  const config = getConfig();

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${config.bgColor}`}
    >
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-6 flex justify-center">{config.icon}</div>

        <h1 className={`text-2xl font-bold mb-4 ${config.textColor}`}>
          {config.title}
        </h1>

        <p className="text-gray-600 mb-6">{config.message}</p>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Mengalihkan ke halaman detail...</span>
        </div>

        <div className="mt-6 text-xs text-gray-400">
          Anda akan dialihkan otomatis dalam 3 detik
        </div>
      </div>
    </div>
  );
}
