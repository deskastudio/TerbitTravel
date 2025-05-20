// booking-error.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { XCircle, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BookingService } from "@/services/booking.service"
import { useMidtransPayment } from "@/hooks/use-midtrans-payment"

export default function BookingError() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [bookingData, setBookingData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { initiatePayment, isLoadingPayment } = useMidtransPayment()
  
  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) return
      
      try {
        setIsLoading(true)
        const response = await BookingService.getBookingById(bookingId)
        setBookingData(response)
      } catch (error) {
        console.error('Error fetching booking data:', error)
        setError('Gagal mengambil data pemesanan')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBookingData()
  }, [bookingId])
  
  const handleRetryPayment = async () => {
    if (!bookingData) return
    
    try {
      // Inisiasi pembayaran Midtrans lagi
      await initiatePayment({
        bookingId: bookingData.bookingId,
        customerInfo: bookingData.customerInfo,
        packageInfo: bookingData.packageInfo,
        jumlahPeserta: bookingData.jumlahPeserta,
        totalAmount: bookingData.totalAmount
      })
    } catch (error) {
      console.error("Error initiating payment:", error)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-md">
          <CardHeader className="text-center pb-2 bg-primary/5 border-b">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl">Pembayaran Gagal</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Terjadi kesalahan saat pembayaran</AlertTitle>
              <AlertDescription>
                <p className="mb-2">Pembayaran Anda tidak dapat diproses. Silakan coba kembali dengan metode pembayaran yang berbeda.</p>
              </AlertDescription>
            </Alert>
            
            {bookingData && (
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Detail Pemesanan:</h3>
                <p className="text-sm text-muted-foreground">
                  Booking ID: {bookingData.bookingId}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total: {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(bookingData.totalAmount)}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 pt-0">
            <Button 
              className="w-full" 
              onClick={handleRetryPayment}
              disabled={isLoadingPayment || isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingPayment ? 'animate-spin' : ''}`} />
              Coba Bayar Lagi
            </Button>
            
            <Button 
              variant="outline"
              className="w-full" 
              onClick={() => navigate(`/booking-detail/${bookingId}`)}
            >
              Lihat Detail Pemesanan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}