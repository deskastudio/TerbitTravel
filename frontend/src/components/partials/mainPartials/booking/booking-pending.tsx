// booking-pending.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Clock, AlertCircle, ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BookingService } from "@/services/booking.service"

export default function BookingPending() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const checkStatus = async () => {
      if (!bookingId) return
      
      try {
        setIsLoading(true)
        const response = await BookingService.getPaymentStatus(bookingId)
        
        if (response.success) {
          setPaymentStatus(response.status || 'pending')
          
          // Jika sudah dibayar, redirect ke halaman detail
          if (response.status === 'settlement' || response.status === 'capture') {
            navigate(`/booking-detail/${bookingId}`)
          }
        } else {
          setError(response.message || 'Gagal mengecek status pembayaran')
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
        setError('Gagal mengecek status pembayaran')
      } finally {
        setIsLoading(false)
      }
    }
    
    checkStatus()
    
    // Cek status setiap 5 detik
    const intervalId = setInterval(checkStatus, 5000)
    
    return () => clearInterval(intervalId)
  }, [bookingId, navigate])
  
  const handleCheckStatus = async () => {
    if (!bookingId) return
    
    try {
      setIsLoading(true)
      const response = await BookingService.getPaymentStatus(bookingId)
      
      if (response.success) {
        setPaymentStatus(response.status || 'pending')
        
        if (response.status === 'settlement' || response.status === 'capture') {
          navigate(`/booking-detail/${bookingId}`)
        }
      } else {
        setError(response.message || 'Gagal mengecek status pembayaran')
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
      setError('Gagal mengecek status pembayaran')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-md">
          <CardHeader className="text-center pb-2 bg-primary/5 border-b">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-xl">Pembayaran Sedang Diproses</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Menunggu konfirmasi pembayaran</AlertTitle>
              <AlertDescription>
                <p className="mb-2">Pembayaran Anda sedang diproses. Mohon tunggu beberapa saat.</p>
                <p className="text-sm">Halaman ini akan otomatis diperbarui ketika pembayaran dikonfirmasi.</p>
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Status Pembayaran:</h3>
              <p className="text-yellow-600 font-medium">
                {isLoading ? "Mengecek status..." : (paymentStatus || "Menunggu pembayaran")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Booking ID: {bookingId}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 pt-0">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleCheckStatus}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Perbarui Status
            </Button>
            
            <Button 
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