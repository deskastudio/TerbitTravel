import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from "@/hooks/use-toast" // Import Toast dari ShadCN
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { bookingFormSchema, BookingFormValues } from '@/lib/schemas'

const BookingPage = () => {
  const navigate = useNavigate()
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      email: '',
      telephone: '',
      agency: '',
      tourPackage: '',
      dateRange: '',
      numberOfParticipants: 1,
      busCapacity: 0,
      price: 0,
      noKtp: '',
    },
  })

  const onSubmit = (data: BookingFormValues) => {
    console.log(data)
    fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        console.log(result)
        // Tampilkan toast berhasil
        toast({
          title: "Booking Berhasil",
          description: "Data booking Anda telah berhasil dikirim!",
          duration: 3000,
        })
        // Tunggu hingga toast selesai, lalu navigasi kembali
        setTimeout(() => {
          navigate(-1) // Kembali ke halaman sebelumnya
        }, 3000)
      })
      .catch(error => {
        console.error('Error:', error)
        toast({
          title: "Terjadi Kesalahan",
          description: "Gagal mengirim data booking. Silakan coba lagi.",
          variant: "destructive", // Varian untuk error
          duration: 3000,
        })
      })
  }

  const dateRangeOptions = Array.from({ length: 30 }, (_, i) => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + i)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 7)
    return `${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`
  })

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Booking Form</CardTitle>
          <CardDescription className="text-center">Fill in the details to make a booking</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telephone</FormLabel>
                      <FormControl>
                        <Input placeholder="08123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency</FormLabel>
                      <FormControl>
                        <Input placeholder="Travel Agency" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="tourPackage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Package</FormLabel>
                    <FormControl>
                      <Input placeholder="Bali Adventure" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dateRangeOptions.map((dateRange) => (
                          <SelectItem key={dateRange} value={dateRange}>
                            {dateRange}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="numberOfParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Participants</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="busCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bus Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="noKtp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KTP Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingPage
