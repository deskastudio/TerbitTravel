// hooks/use-midtrans-payment.ts
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BookingService, PaymentRequestData, PaymentResponse } from '@/services/booking.service';

export function useMidtransPayment() {
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { toast } = useToast();

  // Load Midtrans Snap JS saat komponen mount
  useEffect(() => {
    // Tambahkan script Midtrans hanya jika belum ada
    if (!document.getElementById('midtrans-script')) {
      const script = document.createElement('script');
      script.id = 'midtrans-script';
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      // Gunakan environment variable jika tersedia, jika tidak gunakan placeholder
      script.setAttribute('data-client-key', process.env.REACT_APP_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-xxxxxxx');
      document.body.appendChild(script);
    }
    
    return () => {
      // Cleanup jika diperlukan
    };
  }, []);

  // Proses pembayaran dengan Midtrans
  const processPayment = useCallback(async (params: PaymentRequestData): Promise<PaymentResponse | null> => {
    try {
      setIsLoadingPayment(true);
      setError(null);

      // Panggil API untuk mendapatkan token Midtrans
      const response = await BookingService.processPayment(params);
      
      if (response.success) {
        if (response.snap_token) {
          setSnapToken(response.snap_token);
        }
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to process payment');
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      setError(error.message || 'Failed to process payment');
      
      toast({
        variant: "destructive",
        title: "Gagal memproses pembayaran",
        description: error.message || "Terjadi kesalahan saat memproses pembayaran"
      });
      
      return null;
    } finally {
      setIsLoadingPayment(false);
    }
  }, [toast]);
  
  // Cek status pembayaran
  const checkPaymentStatus = useCallback(async (bookingId: string): Promise<string | null> => {
    try {
      const response = await BookingService.getPaymentStatus(bookingId);
      
      if (response.success && response.status) {
        setPaymentStatus(response.status);
        return response.status;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error checking payment status:', error);
      setError(error.message || 'Failed to check payment status');
      return null;
    }
  }, []);
  
  // Simulasi pembayaran berhasil (untuk testing)
  const simulatePaymentSuccess = useCallback(async (bookingId: string): Promise<boolean> => {
    try {
      setIsLoadingPayment(true);
      const response = await BookingService.completePayment(bookingId);
      
      if (response.success) {
        toast({
          title: "Pembayaran berhasil",
          description: "Pembayaran Anda telah berhasil dikonfirmasi"
        });
        return true;
    } else {
      throw new Error(response.message || 'Failed to complete payment');
    }
  } catch (error: any) {
    console.error('Error simulating payment success:', error);
    setError(error.message || 'Failed to complete payment');
    
    toast({
      variant: "destructive",
      title: "Gagal menyelesaikan pembayaran",
      description: error.message || "Terjadi kesalahan saat menyelesaikan pembayaran"
    });
    
    return false;
  } finally {
    setIsLoadingPayment(false);
  }
}, [toast]);

// Buka Snap Midtrans
const openSnapMidtrans = useCallback((token: string, callbacks?: {
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
}) => {
  if (!(window as any).snap) {
    console.error('Snap is not loaded yet');
    toast({
      variant: "destructive",
      title: "Error",
      description: "Payment gateway tidak tersedia, silakan coba lagi nanti"
    });
    return;
  }
  
  // Configure default callbacks
  const defaultCallbacks = {
    onSuccess: (result: any) => {
      console.log('Payment success:', result);
    },
    onPending: (result: any) => {
      console.log('Payment pending:', result);
    },
    onError: (result: any) => {
      console.log('Payment error:', result);
      toast({
        variant: "destructive",
        title: "Pembayaran gagal",
        description: "Terjadi kesalahan saat memproses pembayaran"
      });
    },
    onClose: () => {
      console.log('Customer closed the popup without finishing the payment');
      setIsLoadingPayment(false);
    }
  };
  
  // Merge with provided callbacks
  const finalCallbacks = callbacks ? { ...defaultCallbacks, ...callbacks } : defaultCallbacks;
  
  // Open Snap popup
  (window as any).snap.pay(token, finalCallbacks);
}, [toast]);

// Reset state
const reset = useCallback(() => {
  setSnapToken(null);
  setPaymentStatus(null);
  setError(null);
}, []);

return {
  isLoadingPayment,
  error,
  snapToken,
  paymentStatus,
  processPayment,
  checkPaymentStatus,
  simulatePaymentSuccess,
  openSnapMidtrans,
  reset
};
}