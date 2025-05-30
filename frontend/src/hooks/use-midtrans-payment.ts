// hooks/use-midtrans-payment.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  BookingService,
  PaymentRequestData,
  PaymentResponse,
} from "@/services/booking.service";

export function useMidtransPayment() {
  const { toast } = useToast();

  // State management
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  // Refs untuk tracking
  const snapInitialized = useRef(false);
  const currentBookingId = useRef<string | null>(null);

  // Load Midtrans Snap JS saat komponen mount
  useEffect(() => {
    const initializeSnap = () => {
      // Cek apakah script sudah ada
      const existingScript = document.getElementById("midtrans-script");
      if (existingScript && snapInitialized.current) {
        return; // Already initialized
      }

      // Remove existing script jika ada
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.id = "midtrans-script";
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";

      // Gunakan environment variable yang sesuai dengan Next.js/Vite
      const clientKey =
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ||
        process.env.VITE_MIDTRANS_CLIENT_KEY ||
        process.env.REACT_APP_MIDTRANS_CLIENT_KEY ||
        "SB-Mid-client-xxxxxxx";

      script.setAttribute("data-client-key", clientKey);
      script.async = true;

      script.onload = () => {
        snapInitialized.current = true;
        console.log("✅ Midtrans Snap loaded successfully");
      };

      script.onerror = () => {
        console.error("❌ Failed to load Midtrans Snap");
        snapInitialized.current = false;

        // Development fallback
        if (process.env.NODE_ENV === "development") {
          console.log("🧪 Development mode: assuming Snap is available");
          snapInitialized.current = true;
        }
      };

      document.head.appendChild(script);
    };

    initializeSnap();

    return () => {
      // Cleanup saat unmount
      const script = document.getElementById("midtrans-script");
      if (script) {
        script.remove();
      }
      snapInitialized.current = false;
    };
  }, []);

  // Proses pembayaran dengan Midtrans
  const processPayment = useCallback(
    async (params: PaymentRequestData): Promise<PaymentResponse | null> => {
      try {
        setIsLoadingPayment(true);
        setError(null);
        currentBookingId.current = params.bookingId;

        console.log("💳 Processing payment for booking:", params.bookingId);

        // Panggil API untuk mendapatkan token Midtrans
        const response = await BookingService.processPayment(params);

        if (response && response.success) {
          if (response.snap_token) {
            setSnapToken(response.snap_token);
            console.log("✅ Snap token received");
          }

          return response;
        } else {
          throw new Error(response?.message || "Failed to process payment");
        }
      } catch (error: any) {
        console.error("💥 Error processing payment:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error.message ||
          "Failed to process payment";
        setError(errorMessage);

        toast({
          variant: "destructive",
          title: "Gagal memproses pembayaran",
          description: errorMessage,
        });

        return null;
      } finally {
        setIsLoadingPayment(false);
      }
    },
    [toast]
  );

  // Alias untuk backward compatibility
  const initiatePayment = useCallback(
    async (params: PaymentRequestData): Promise<PaymentResponse | null> => {
      return processPayment(params);
    },
    [processPayment]
  );

  // Cek status pembayaran
  const checkPaymentStatus = useCallback(
    async (
      bookingId: string
    ): Promise<{
      status: string | null;
      canAccessVoucher: boolean;
      data?: any;
    }> => {
      try {
        console.log("🔍 Checking payment status for:", bookingId);

        const response = await BookingService.getPaymentStatus(bookingId);

        if (response.success && response.data) {
          const { paymentStatus, canAccessVoucher } = response.data;
          setPaymentStatus(paymentStatus);

          console.log("✅ Payment status:", {
            status: paymentStatus,
            canAccessVoucher,
          });

          return {
            status: paymentStatus,
            canAccessVoucher,
            data: response.data,
          };
        }

        return { status: null, canAccessVoucher: false };
      } catch (error: any) {
        console.error("❌ Error checking payment status:", error);
        setError(error.message || "Failed to check payment status");
        return { status: null, canAccessVoucher: false };
      }
    },
    []
  );

  // Simulasi pembayaran berhasil (untuk testing)
  const simulatePaymentSuccess = useCallback(
    async (bookingId: string): Promise<boolean> => {
      if (process.env.NODE_ENV !== "development") {
        console.warn(
          "⚠️ Payment simulation only available in development mode"
        );
        return false;
      }

      try {
        setIsLoadingPayment(true);

        console.log("🧪 Simulating payment success for:", bookingId);

        // Call simulate API jika tersedia
        try {
          const response = await BookingService.simulatePaymentSuccess(
            bookingId
          );
          if (response.success) {
            setPaymentStatus("settlement");
            toast({
              title: "Simulasi Pembayaran Berhasil",
              description: "Status pembayaran telah diupdate",
            });
            return true;
          }
        } catch (apiError) {
          console.log("🧪 API simulation failed, using local simulation");
        }

        // Fallback simulation
        setPaymentStatus("settlement");

        // Update localStorage for fallback
        const lastBooking = localStorage.getItem("lastBooking");
        if (lastBooking) {
          try {
            const parsedBooking = JSON.parse(lastBooking);
            if (parsedBooking.bookingId === bookingId) {
              parsedBooking.paymentStatus = "settlement";
              parsedBooking.status = "confirmed";
              parsedBooking.paymentDate = new Date().toISOString();
              localStorage.setItem(
                "lastBooking",
                JSON.stringify(parsedBooking)
              );
            }
          } catch (parseError) {
            console.error("Error updating localStorage:", parseError);
          }
        }

        toast({
          title: "Simulasi Pembayaran Berhasil (Fallback)",
          description: "Status pembayaran telah diupdate secara lokal",
        });

        return true;
      } catch (error: any) {
        console.error("❌ Error simulating payment success:", error);
        setError(error.message || "Failed to simulate payment");

        toast({
          variant: "destructive",
          title: "Gagal simulasi pembayaran",
          description: error.message || "Terjadi kesalahan saat simulasi",
        });

        return false;
      } finally {
        setIsLoadingPayment(false);
      }
    },
    [toast]
  );

  // Buka Snap Midtrans
  const openSnapMidtrans = useCallback(
    (
      token: string,
      callbacks?: {
        onSuccess?: (result: any) => void;
        onPending?: (result: any) => void;
        onError?: (result: any) => void;
        onClose?: () => void;
      }
    ) => {
      // Check if Snap is available
      if (!(window as any).snap || !snapInitialized.current) {
        console.error("❌ Snap is not loaded yet");

        // Development fallback
        if (process.env.NODE_ENV === "development") {
          console.log("🧪 Development mode: simulating Snap interaction");

          if (
            confirm("Snap tidak tersedia. Simulasikan pembayaran berhasil?")
          ) {
            callbacks?.onSuccess?.({
              transaction_id: `dev-${Date.now()}`,
              order_id: `TRX-${currentBookingId.current}-${Date.now()}`,
            });
          } else {
            callbacks?.onClose?.();
          }
          return;
        }

        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Payment gateway tidak tersedia, silakan refresh halaman",
        });
        return;
      }

      // Configure default callbacks
      const defaultCallbacks = {
        onSuccess: (result: any) => {
          console.log("✅ Payment success:", result);
          setPaymentStatus("settlement");
        },
        onPending: (result: any) => {
          console.log("⏳ Payment pending:", result);
          setPaymentStatus("pending");
        },
        onError: (result: any) => {
          console.error("❌ Payment error:", result);
          setPaymentStatus("failure");
          toast({
            variant: "destructive",
            title: "Pembayaran gagal",
            description:
              result.status_message ||
              "Terjadi kesalahan saat memproses pembayaran",
          });
        },
        onClose: () => {
          console.log("👋 Customer closed the popup");
          setIsLoadingPayment(false);
        },
      };

      // Merge dengan callbacks yang diberikan
      const finalCallbacks = callbacks
        ? { ...defaultCallbacks, ...callbacks }
        : defaultCallbacks;

      // Buka Snap popup
      try {
        console.log(
          "🚀 Opening Snap with token:",
          token.substring(0, 20) + "..."
        );
        (window as any).snap.pay(token, finalCallbacks);
      } catch (snapError) {
        console.error("❌ Error opening Snap:", snapError);
        toast({
          variant: "destructive",
          title: "Error membuka pembayaran",
          description: "Silakan coba lagi atau refresh halaman",
        });
      }
    },
    [toast]
  );

  // Reset state
  const reset = useCallback(() => {
    setSnapToken(null);
    setPaymentStatus(null);
    setError(null);
    setIsLoadingPayment(false);
    currentBookingId.current = null;
  }, []);

  return {
    // State
    isLoadingPayment,
    error,
    snapToken,
    paymentStatus,

    // Main functions
    processPayment,
    initiatePayment, // Alias untuk processPayment
    checkPaymentStatus,
    openSnapMidtrans,
    simulatePaymentSuccess,

    // Utility functions
    reset,

    // Status checkers
    isSnapReady: snapInitialized.current,
    currentBooking: currentBookingId.current,
  };
}
