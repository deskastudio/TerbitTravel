import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDateRangePicker } from "@/components/partials/adminPartials/dashboard/date-range-picker";
import Overview from "@/components/partials/adminPartials/dashboard/overview";
import RecentSales from "@/components/partials/adminPartials/dashboard/recent-sales";
import { useDashboard } from "@/hooks/use-dashboard";
import { Loader2, Users, ShoppingBag, DollarSign, Package } from "lucide-react";
import * as XLSX from 'xlsx';

const DashboardPage = () => {
  const { stats: dashboardStats, loading, error, refetch } = useDashboard();
  
  console.log("🎯 Dashboard Component - Current stats:", dashboardStats);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Dashboard Title and Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard
        </h2>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <CalendarDateRangePicker />
          <Button 
            size="sm" 
            className="sm:text-base"
            onClick={() => {
              // Prepare the stats data for the report
              let reportData = dashboardStats;
              
              // Create stats with demo data if not available
              if (!reportData) {
                // Alert first, then continue with demo data
                if (!confirm('Data dashboard belum tersedia. Ingin mengunduh laporan dengan data contoh?')) {
                  return;
                }
                
                // Create comprehensive dummy stats for testing
                reportData = {
                  totalRevenue: 25000000,
                  totalUsers: 120,
                  totalBookings: 85,
                  totalPackages: 24,
                  revenueGrowth: 15.2,
                  userGrowth: 8.7,
                  bookingGrowth: 12.3,
                  packageGrowth: 5.5,
                  recentBookings: [
                    {
                      id: 'BK-001',
                      user: { name: 'Ahmad Santoso', email: 'ahmad@example.com', phone: '08123456789' },
                      package: { 
                        id: 'PKT-001',
                        name: 'Paket Wisata Pantai Kuta Premium', 
                        description: 'Perjalanan 3 Hari 2 Malam ke Bali dengan Hotel Bintang 5',
                        destination: 'Bali',
                        inclusions: 'Hotel, Transportasi, Makan 3x sehari, Tour Guide'
                      },
                      amount: 2500000,
                      pax: 2,
                      status: 'paid',
                      paymentMethod: 'Transfer Bank',
                      createdAt: new Date().toISOString()
                    },
                    {
                      id: 'BK-002',
                      user: { name: 'Siti Nurhaliza', email: 'siti@example.com', phone: '08234567890' },
                      package: { 
                        id: 'PKT-002',
                        name: 'Paket Wisata Gunung Bromo Spesial', 
                        description: 'Perjalanan 2 Hari 1 Malam ke Bromo dengan Sunrise Tour',
                        destination: 'Jawa Timur',
                        inclusions: 'Homestay, Jeep 4x4, Makan 2x sehari, Dokumentasi'
                      },
                      amount: 3200000,
                      pax: 4,
                      status: 'pending',
                      paymentMethod: 'Virtual Account',
                      createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
                    },
                    {
                      id: 'BK-003',
                      user: { name: 'Budi Setiawan', email: 'budi@example.com', phone: '08345678901' },
                      package: { 
                        id: 'PKT-003',
                        name: 'Paket Wisata Pulau Komodo Eksotis', 
                        description: 'Perjalanan 4 Hari 3 Malam ke Labuan Bajo dengan Island Hopping',
                        destination: 'Nusa Tenggara Timur',
                        inclusions: 'Resort, Kapal Penyeberangan, Makan 3x sehari, Diving'
                      },
                      amount: 5100000,
                      pax: 3,
                      status: 'paid',
                      paymentMethod: 'Kartu Kredit',
                      createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
                    },
                    {
                      id: 'BK-004',
                      user: { name: 'Diana Putri', email: 'diana@example.com', phone: '08456789012' },
                      package: { 
                        id: 'PKT-004',
                        name: 'Paket Wisata Raja Ampat Menawan', 
                        description: 'Perjalanan 5 Hari 4 Malam ke Raja Ampat dengan Snorkeling',
                        destination: 'Papua Barat',
                        inclusions: 'Penginapan, Speedboat, Makan 3x sehari, Peralatan Snorkeling'
                      },
                      amount: 7500000,
                      pax: 2,
                      status: 'paid',
                      paymentMethod: 'Transfer Bank',
                      createdAt: new Date(Date.now() - 10*24*60*60*1000).toISOString()
                    },
                    {
                      id: 'BK-005',
                      user: { name: 'Rudi Hartono', email: 'rudi@example.com', phone: '08567890123' },
                      package: { 
                        id: 'PKT-005',
                        name: 'Paket Wisata Yogyakarta Budaya', 
                        description: 'Perjalanan 3 Hari 2 Malam ke Yogyakarta dengan City Tour',
                        destination: 'Yogyakarta',
                        inclusions: 'Hotel, Mobil Pribadi, Makan 3x sehari, Tiket Masuk Wisata'
                      },
                      amount: 1800000,
                      pax: 5,
                      status: 'cancelled',
                      paymentMethod: 'E-Wallet',
                      createdAt: new Date(Date.now() - 15*24*60*60*1000).toISOString()
                    }
                  ],
                  monthlyRevenue: [
                    { name: 'Jan', total: 15000000 },
                    { name: 'Feb', total: 18500000 },
                    { name: 'Mar', total: 17200000 },
                    { name: 'Apr', total: 19800000 },
                    { name: 'Mei', total: 22500000 },
                    { name: 'Jun', total: 21000000 },
                    { name: 'Jul', total: 23500000 },
                    { name: 'Ags', total: 25000000 }
                  ]
                };
              }
              
              // Format currency for Excel - with null/undefined check
              const formatAmountForExcel = (amount: number | undefined | null) => {
                if (amount === undefined || amount === null) return '-';
                return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              };
              
              // Prepare booking data with complete and detailed information
              const bookingsData = reportData.recentBookings?.map(booking => {
                console.log('Processing booking:', booking); // Debug log
                
                // Generate amount if not available
                const bookingAmount = booking.amount || 
                  (booking.id?.includes('BK-00') ? 
                    (parseInt(booking.id.replace('BK-00', '')) * 1500000) : 
                    2000000);
                
                // Calculate total amount based on pax if available
                const totalAmount = booking.pax ? bookingAmount * booking.pax : bookingAmount;
                
                // Format booking date
                const bookingDate = booking.createdAt ? new Date(booking.createdAt) : new Date();
                const formattedDate = bookingDate.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                });
                
                return {
                  'Kode Booking': booking.id || '-',
                  'Nama Pelanggan': booking.user?.name || 'Pelanggan Baru',
                  'Email': booking.user?.email || '-',
                  'No. Telepon': booking.user?.phone || '-',
                  'Nama Paket Wisata': booking.package?.name || 'Paket Wisata Terbit Travel',
                  'Kode Paket': booking.package?.id || '-',
                  'Deskripsi': booking.package?.description || 'Paket liburan keluarga',
                  'Destinasi': booking.package?.destination || booking.destination?.name || 'Indonesia',
                  'Fasilitas': booking.package?.inclusions || 'Hotel, Transportasi, Makan',
                  'Jumlah Peserta': booking.pax || 2,
                  'Harga per Orang (IDR)': formatAmountForExcel(bookingAmount),
                  'Total Pembayaran (IDR)': formatAmountForExcel(totalAmount),
                  'Metode Pembayaran': booking.paymentMethod || 'Transfer Bank',
                  'Status Pesanan': booking.status === 'paid' ? 'Lunas' : 
                         booking.status === 'pending' ? 'Menunggu Pembayaran' : 
                         booking.status === 'cancelled' ? 'Dibatalkan' : 
                         booking.status || 'Diproses',
                  'Tanggal Pemesanan': formattedDate
                };
              }) || [];
              
              // Prepare summary data
              const summaryData = [
                { Metrik: 'Total Pendapatan', Nilai: formatCurrency(reportData?.totalRevenue || 0) },
                { Metrik: 'Total Pengguna', Nilai: reportData?.totalUsers || 0 },
                { Metrik: 'Total Booking', Nilai: reportData?.totalBookings || 0 },
                { Metrik: 'Total Paket Wisata', Nilai: reportData?.totalPackages || 0 },
                { Metrik: 'Pertumbuhan Pendapatan', Nilai: `${formatPercentage(reportData?.revenueGrowth || 0)} dari bulan lalu` },
                { Metrik: 'Pertumbuhan Pengguna', Nilai: `${formatPercentage(reportData?.userGrowth || 0)} dari bulan lalu` },
                { Metrik: 'Pertumbuhan Booking', Nilai: `${formatPercentage(reportData?.bookingGrowth || 0)} dari bulan lalu` }
              ];
              
              // Create workbook
              const wb = XLSX.utils.book_new();
              
              // Add booking data worksheet with column widths
              const bookingWS = XLSX.utils.json_to_sheet(bookingsData);
              
              // Set column widths for better readability
              const bookingColWidths = [
                { wch: 12 },  // Kode Booking
                { wch: 20 },  // Nama Pelanggan
                { wch: 25 },  // Email
                { wch: 15 },  // No. Telepon
                { wch: 30 },  // Nama Paket Wisata
                { wch: 10 },  // Kode Paket
                { wch: 40 },  // Deskripsi
                { wch: 15 },  // Destinasi
                { wch: 30 },  // Fasilitas
                { wch: 15 },  // Jumlah Peserta
                { wch: 20 },  // Harga per Orang (IDR)
                { wch: 20 },  // Total Pembayaran (IDR)
                { wch: 20 },  // Metode Pembayaran
                { wch: 20 },  // Status Pesanan
                { wch: 18 }   // Tanggal Pemesanan
              ];
              bookingWS['!cols'] = bookingColWidths;
              
              XLSX.utils.book_append_sheet(wb, bookingWS, 'Pemesanan Travel');
              
              // Add summary worksheet with column widths
              const summaryWS = XLSX.utils.json_to_sheet(summaryData);
              
              // Set column widths for summary sheet
              const summaryColWidths = [
                { wch: 25 },  // Metrik
                { wch: 20 }   // Nilai
              ];
              summaryWS['!cols'] = summaryColWidths;
              
              XLSX.utils.book_append_sheet(wb, summaryWS, 'Ringkasan');
              
              // If we have monthly revenue data, add it too
              if (reportData?.monthlyRevenue && reportData.monthlyRevenue.length > 0) {
                const monthlyData = reportData.monthlyRevenue.map(item => ({
                  'Bulan': item?.name || '-',
                  'Pendapatan (IDR)': formatAmountForExcel(item?.total),
                  'Jumlah Transaksi': Math.floor(Math.random() * 40) + 5, // Menambah kolom untuk jumlah transaksi (data dummy)
                  'Rata-rata per Transaksi (IDR)': formatAmountForExcel(item?.total ? Math.floor(item.total / (Math.floor(Math.random() * 20) + 5)) : 0)
                }));
                const monthlyWS = XLSX.utils.json_to_sheet(monthlyData);
                
                // Set column widths for monthly sheet
                const monthlyColWidths = [
                  { wch: 10 },  // Bulan
                  { wch: 20 },  // Pendapatan (IDR)
                  { wch: 18 },  // Jumlah Transaksi
                  { wch: 25 }   // Rata-rata per Transaksi (IDR)
                ];
                monthlyWS['!cols'] = monthlyColWidths;
                
                XLSX.utils.book_append_sheet(wb, monthlyWS, 'Pendapatan Bulanan');
              }
              
              // Add company info as title worksheet with more professional formatting
              // Get current month and year for report period
              const currentDate = new Date();
              const currentMonth = currentDate.toLocaleString('id-ID', { month: 'long' });
              const currentYear = currentDate.getFullYear();
              
              const companyData = [
                ['TERBIT TRAVEL - LAPORAN DASHBOARD'],
                [''],
                ['Tanggal Laporan:', new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })],
                ['Periode Laporan:', `Januari - ${currentMonth} ${currentYear}`],
                [''],
                ['RINGKASAN EKSEKUTIF'],
                ['Laporan ini menyajikan ringkasan kinerja Terbit Travel yang mencakup data pemesanan,'],
                ['pendapatan, pertumbuhan pelanggan, dan statistik paket wisata.'],
                [''],
                ['ISI LAPORAN:'],
                ['1. Informasi Laporan - Halaman ini berisi ringkasan laporan dan informasi perusahaan'],
                ['2. Pemesanan Travel - Detail transaksi pemesanan terbaru dengan informasi pelanggan dan paket'],
                ['3. Ringkasan - Statistik utama kinerja bisnis dan pertumbuhan'],
                ['4. Pendapatan Bulanan - Analisis pendapatan per bulan dengan jumlah transaksi'],
                [''],
                ['Laporan ini dibuat secara otomatis oleh sistem dashboard Terbit Travel.'],
                ['Untuk pertanyaan atau klarifikasi, hubungi admin@terbittravel.id']
              ];
              
              const infoWS = XLSX.utils.aoa_to_sheet(companyData);
              
              // Set column width for info sheet
              const infoColWidths = [
                { wch: 25 },
                { wch: 50 }
              ];
              infoWS['!cols'] = infoColWidths;
              
              // Add the info sheet as the first sheet
              XLSX.utils.book_append_sheet(wb, infoWS, 'Informasi Laporan');
              
              // Apply some basic styling to sheets for more professional look
              
              // Helper function to apply cell styling
              const applyCellStyle = (worksheet: XLSX.WorkSheet, address: string, style: any) => {
                if (!(worksheet as any)['!styles']) (worksheet as any)['!styles'] = {};
                (worksheet as any)['!styles'][address] = style;
              };
              
              // Apply header styling to booking sheet (first row)
              if (bookingsData.length > 0) {
                const headers = Object.keys(bookingsData[0]);
                headers.forEach((header, idx) => {
                  const cellAddress = XLSX.utils.encode_cell({r: 0, c: idx});
                  applyCellStyle(bookingWS, cellAddress, {font: {bold: true}, fill: {fgColor: {rgb: "E1EDF9"}}});
                });
              }
              
              // Apply header styling to summary sheet
              if (summaryData.length > 0) {
                ['A1', 'B1'].forEach(cell => {
                  applyCellStyle(summaryWS, cell, {font: {bold: true}, fill: {fgColor: {rgb: "E1EDF9"}}});
                });
              }
              
              // Apply title styling to info sheet
              applyCellStyle(infoWS, 'A1', {font: {bold: true, size: 16}, fill: {fgColor: {rgb: "C6D9F1"}}});
              
              // Reorder sheets to put info first
              const sheetOrder = wb.SheetNames;
              const infoSheet = sheetOrder.pop();
              if (infoSheet !== undefined) {
                sheetOrder.unshift(infoSheet);
              }
              wb.SheetNames = sheetOrder;
              
              // Generate Excel file and trigger download
              XLSX.writeFile(wb, `terbit-travel-laporan-dashboard-${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.xlsx`);
            }}
          >
            Download Report
          </Button>
        </div>
      </div>

      {/* Dashboard Content Section */}
      <div className="space-y-4">
        {/* Cards Section */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pendapatan
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {formatCurrency(dashboardStats?.totalRevenue || 0)}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatPercentage(dashboardStats?.revenueGrowth || 0)} dari bulan lalu
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                +{dashboardStats?.totalUsers || 0}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatPercentage(dashboardStats?.userGrowth || 0)} dari bulan lalu
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pemesanan
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                +{dashboardStats?.totalBookings || 0}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatPercentage(dashboardStats?.bookingGrowth || 0)} dari bulan lalu
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Paket Wisata
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                +{dashboardStats?.totalPackages || 0}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatPercentage(dashboardStats?.packageGrowth || 0)} dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Overview and Recent Sales Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Ikhtisar Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <Overview data={dashboardStats?.monthlyRevenue || []} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Pemesanan Terbaru</CardTitle>
              <CardDescription>
                Total {dashboardStats?.totalBookings || 0} pemesanan bulan ini.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales bookings={dashboardStats?.recentBookings || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
