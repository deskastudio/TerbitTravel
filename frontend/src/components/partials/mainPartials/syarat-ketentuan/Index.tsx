import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarDays, 
  Shield, 
  CreditCard, 
  AlertTriangle, 
  Scale, 
  FileText, 
  Users, 
  Globe,
  CheckCircle,
  Clock,
  Download,
  Search,
  BookOpen,
  MapPin,
  Plane,
  Star,
  XCircle,
  RefreshCw,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react';

interface TermsSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  sectionId: string;
  searchTerm?: string;
}

const TermsSection: React.FC<TermsSectionProps> = ({ icon, title, children, sectionId, searchTerm }) => {
  // Check if this section should be visible based on search
  const isVisible = useMemo(() => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = title.toLowerCase().includes(searchLower);
    
    // Also check if children content matches
    const childrenText = React.Children.toArray(children).join(' ').toLowerCase();
    const contentMatch = childrenText.includes(searchLower);
    
    return titleMatch || contentMatch;
  }, [title, children, searchTerm]);

  if (!isVisible) return null;

  return (
    <Card className="mb-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500" id={sectionId}>
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white shadow-md">
            {icon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {children}
      </CardContent>
    </Card>
  );
};

const TermsAndConditionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate PDF content and download
  const downloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      // Create PDF content as HTML string
      const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Syarat dan Ketentuan - Travedia Terbit Semesta</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 30px; }
        h3 { color: #1e3a8a; }
        .section { margin-bottom: 30px; }
        .highlight { background-color: #f0f9ff; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0; }
        .refund-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .refund-table th, .refund-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .refund-table th { background-color: #f8fafc; }
        .contact-info { background-color: #f8fafc; padding: 20px; border-radius: 8px; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; }
    </style>
</head>
<body>
    <h1>SYARAT DAN KETENTUAN</h1>
    <h2>Travedia Terbit Semesta</h2>
    
    <div class="highlight">
        <strong>Berlaku Efektif:</strong> 1 Januari 2024<br>
        <strong>Update Terakhir:</strong> 1 Januari 2024<br>
        <strong>Versi:</strong> 1.0
    </div>

    <div class="section">
        <h2>1. DEFINISI DAN LINGKUP</h2>
        <p><strong>Platform:</strong> Website Travedia Terbit Semesta - platform booking travel online terpercaya</p>
        <p><strong>Pengguna:</strong> Customer yang menggunakan layanan booking dan konsultasi travel</p>
        <p><strong>Layanan:</strong> Booking paket wisata, konsultasi travel, customer support 24/7</p>
        <p><strong>Konten:</strong> Informasi destinasi, paket wisata, artikel, galeri foto & video</p>
    </div>

    <div class="section">
        <h2>2. PERSYARATAN PENGGUNAAN</h2>
        <ul>
            <li><strong>Usia Minimum:</strong> 18 tahun atau dengan persetujuan orang tua/wali yang sah</li>
            <li><strong>Akun Valid:</strong> Informasi registrasi harus akurat, lengkap, dan selalu up-to-date</li>
            <li><strong>Penggunaan Wajar:</strong> Tidak melakukan aktivitas yang merugikan platform atau pengguna lain</li>
            <li><strong>Compliance:</strong> Mematuhi hukum Indonesia dan regulasi travel yang berlaku</li>
        </ul>
    </div>

    <div class="section">
        <h2>3. PROSES BOOKING DAN PEMBAYARAN</h2>
        <h3>Konfirmasi Booking</h3>
        <p>Semua booking tunduk pada ketersediaan dan konfirmasi dari travel partners kami. Proses konfirmasi maksimal 24 jam.</p>
        
        <h3>Metode Pembayaran</h3>
        <ul>
            <li>Kartu Kredit/Debit: Visa, Mastercard, JCB</li>
            <li>Bank Transfer: Virtual Account</li>
            <li>E-Wallet: OVO, GoPay, DANA</li>
            <li>Cicilan 0%: Kartu kredit tertentu</li>
        </ul>
        
        <div class="highlight">
            <strong>Penting:</strong>
            <ul>
                <li>Harga dapat berubah sebelum konfirmasi pembayaran</li>
                <li>E-voucher dikirim otomatis setelah pembayaran berhasil</li>
                <li>Semua harga dalam Rupiah (IDR) termasuk pajak</li>
                <li>Pembayaran harus dilunasi dalam 3x24 jam</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <h2>4. KEBIJAKAN PEMBATALAN DAN REFUND</h2>
        
        <h3>Pembatalan oleh Customer</h3>
        <table class="refund-table">
            <tr>
                <th>Periode Pembatalan</th>
                <th>Refund</th>
                <th>Admin Fee</th>
            </tr>
            <tr>
                <td>30+ hari sebelum</td>
                <td>90%</td>
                <td>10%</td>
            </tr>
            <tr>
                <td>15-29 hari sebelum</td>
                <td>70%</td>
                <td>30%</td>
            </tr>
            <tr>
                <td>7-14 hari sebelum</td>
                <td>50%</td>
                <td>50%</td>
            </tr>
            <tr>
                <td>Kurang dari 7 hari</td>
                <td>0%</td>
                <td>100%</td>
            </tr>
        </table>

        <h3>Pembatalan oleh Provider</h3>
        <p>Full refund 100% atau opsi reschedule dengan kompensasi</p>

        <h3>Force Majeure</h3>
        <p>Refund negotiable untuk bencana alam, pandemi, dll</p>
    </div>

    <div class="section">
        <h2>5. TANGGUNG JAWAB DAN BATASAN</h2>
        <ul>
            <li><strong>Platform Intermediary:</strong> Travedia sebagai perantara, bukan penyedia langsung</li>
            <li><strong>Third-party Liability:</strong> Hotel, airline, tour operator bertanggung jawab atas layanan mereka</li>
            <li><strong>Travel Insurance:</strong> Sangat disarankan, terutama untuk international trips</li>
            <li><strong>Personal Belongings:</strong> Kehilangan barang pribadi bukan tanggung jawab platform</li>
            <li><strong>Health & Safety:</strong> Customer bertanggung jawab atas kondisi kesehatan dan keselamatan</li>
        </ul>
    </div>

    <div class="contact-info">
        <h2>KONTAK CUSTOMER SERVICE</h2>
        <p><strong>Email:</strong> support@travedia.co.id (Response: 2-4 jam)</p>
        <p><strong>WhatsApp:</strong> +62 812-3456-7890 (24/7 Available)</p>
        <p><strong>Live Chat:</strong> Website Support (08:00 - 22:00 WIB)</p>
    </div>

    <div class="footer">
        <p>Dengan menggunakan layanan Travedia Terbit Semesta, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.</p>
        <p><strong>© 2024 Travedia Terbit Semesta. Hak cipta dilindungi undang-undang.</strong></p>
    </div>
</body>
</html>`;

      // Create and download the file
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Syarat-Ketentuan-Travedia-Terbit-Semesta.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      setTimeout(() => {
        alert('✅ File berhasil didownload! File HTML dapat dibuka di browser atau dikonversi ke PDF.');
      }, 500);
      
    } catch (error) {
      alert('❌ Terjadi kesalahan saat download. Silakan coba lagi.');
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Filter search results
  const searchResults = useMemo(() => {
    if (!searchTerm) return null;
    
    const results: { id: string; title: string; content: string }[] = [];
    const searchLower = searchTerm.toLowerCase();
    
    // Search in different sections
    const sections = [
      { id: 'definitions', title: 'Definisi dan Lingkup', content: 'platform pengguna layanan konten website booking travel konsultasi' },
      { id: 'requirements', title: 'Persyaratan Penggunaan', content: 'usia minimum akun valid penggunaan wajar compliance hukum' },
      { id: 'booking', title: 'Proses Booking dan Pembayaran', content: 'konfirmasi booking pembayaran kartu kredit transfer bank e-wallet cicilan' },
      { id: 'cancellation', title: 'Kebijakan Pembatalan dan Refund', content: 'pembatalan refund 30 hari 15 hari 7 hari force majeure' },
    ];
    
    sections.forEach(section => {
      if (section.title.toLowerCase().includes(searchLower) || 
          section.content.toLowerCase().includes(searchLower)) {
        results.push(section);
      }
    });
    
    return results;
  }, [searchTerm]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl py-8">
        {/* Hero Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-5 rounded-3xl"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg">
                <Scale className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Syarat dan Ketentuan
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Dengan menggunakan platform Travedia Terbit Semesta, Anda menyetujui syarat dan ketentuan yang dirancang 
              untuk melindungi hak dan memberikan pengalaman travel terbaik
            </p>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Clock className="w-4 h-4 mr-1" />
                Berlaku efektif: 1 Januari 2024
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                <RefreshCw className="w-4 h-4 mr-1" />
                Update: 1 Januari 2024
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadPDF} 
                className="gap-2"
                disabled={isDownloading}
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari dalam syarat dan ketentuan..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Search Results Indicator */}
          {searchTerm && (
            <div className="text-center mt-4">
              <Badge variant="secondary" className="px-3 py-1">
                {searchResults?.length || 0} hasil ditemukan untuk "{searchTerm}"
              </Badge>
            </div>
          )}
        </div>

        {/* Quick Navigation for Search Results */}
        {searchTerm && searchResults && searchResults.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-blue-800">Hasil Pencarian:</h3>
              <div className="flex flex-wrap gap-2">
                {searchResults.map(result => (
                  <Button
                    key={result.id}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const element = document.getElementById(result.id);
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    {result.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content with Tabs */}
        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="terms" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Syarat Lengkap
            </TabsTrigger>
            <TabsTrigger value="summary" className="gap-2">
              <Star className="w-4 h-4" />
              Ringkasan Penting
            </TabsTrigger>
            <TabsTrigger value="faq-terms" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              FAQ Syarat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terms">
            <ScrollArea className="h-auto">
              {/* Definisi dan Lingkup */}
              <TermsSection 
                icon={<FileText className="w-5 h-5" />}
                title="Definisi dan Lingkup"
                sectionId="definitions"
                searchTerm={searchTerm}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Platform</h4>
                    </div>
                    <p className="text-blue-700 text-sm">Website Travedia Terbit Semesta - platform booking travel online terpercaya</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <h4 className="font-semibold text-green-800">Pengguna</h4>
                    </div>
                    <p className="text-green-700 text-sm">Customer yang menggunakan layanan booking dan konsultasi travel</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="w-4 h-4 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">Layanan</h4>
                    </div>
                    <p className="text-purple-700 text-sm">Booking paket wisata, konsultasi travel, customer support 24/7</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-orange-600" />
                      <h4 className="font-semibold text-orange-800">Konten</h4>
                    </div>
                    <p className="text-orange-700 text-sm">Informasi destinasi, paket wisata, artikel, galeri foto & video</p>
                  </div>
                </div>
              </TermsSection>

              {/* Persyaratan Penggunaan */}
              <TermsSection 
                icon={<Users className="w-5 h-5" />}
                title="Persyaratan Penggunaan"
                sectionId="requirements"
                searchTerm={searchTerm}
              >
                <div className="space-y-4">
                  {[
                    { icon: <CheckCircle className="w-5 h-5 text-green-500" />, title: "Usia Minimum", desc: "18 tahun atau dengan persetujuan orang tua/wali yang sah" },
                    { icon: <CheckCircle className="w-5 h-5 text-green-500" />, title: "Akun Valid", desc: "Informasi registrasi harus akurat, lengkap, dan selalu up-to-date" },
                    { icon: <CheckCircle className="w-5 h-5 text-green-500" />, title: "Penggunaan Wajar", desc: "Tidak melakukan aktivitas yang merugikan platform atau pengguna lain" },
                    { icon: <CheckCircle className="w-5 h-5 text-green-500" />, title: "Compliance", desc: "Mematuhi hukum Indonesia dan regulasi travel yang berlaku" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                      {item.icon}
                      <div>
                        <h4 className="font-medium text-green-800 mb-1">{item.title}</h4>
                        <p className="text-green-700 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TermsSection>

              {/* Proses Booking dan Pembayaran */}
              <TermsSection 
                icon={<CreditCard className="w-5 h-5" />}
                title="Proses Booking dan Pembayaran"
                sectionId="booking"
                searchTerm={searchTerm}
              >
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="font-semibold mb-3 text-blue-800 flex items-center gap-2">
                      <Plane className="w-5 h-5" />
                      Konfirmasi Booking
                    </h4>
                    <p className="text-blue-700">Semua booking tunduk pada ketersediaan dan konfirmasi dari travel partners kami. Proses konfirmasi maksimal 24 jam.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4 text-gray-800">Metode Pembayaran yang Tersedia</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { icon: <CreditCard className="w-6 h-6" />, title: "Kartu Kredit", desc: "Visa, Mastercard, JCB", color: "blue" },
                        { icon: <CreditCard className="w-6 h-6" />, title: "Bank Transfer", desc: "Virtual Account", color: "green" },
                        { icon: <Phone className="w-6 h-6" />, title: "E-Wallet", desc: "OVO, GoPay, DANA", color: "purple" },
                        { icon: <RefreshCw className="w-6 h-6" />, title: "Cicilan 0%", desc: "Kartu kredit tertentu", color: "orange" },
                      ].map((method, index) => (
                        <div key={index} className="p-4 border-2 border-gray-200 bg-gray-50 rounded-lg hover:shadow-lg transition-all cursor-pointer hover:border-blue-300">
                          <div className="text-gray-600 mb-2">{method.icon}</div>
                          <h5 className="font-medium text-gray-800 text-sm">{method.title}</h5>
                          <p className="text-gray-600 text-xs mt-1">{method.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-yellow-800 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Penting untuk Diingat
                    </h4>
                    <ul className="text-yellow-700 space-y-1 text-sm">
                      <li>• Harga dapat berubah sebelum konfirmasi pembayaran</li>
                      <li>• E-voucher dikirim otomatis setelah pembayaran berhasil</li>
                      <li>• Semua harga dalam Rupiah (IDR) termasuk pajak</li>
                      <li>• Pembayaran harus dilunasi dalam 3x24 jam</li>
                    </ul>
                  </div>
                </div>
              </TermsSection>

              {/* Kebijakan Pembatalan - Interactive */}
              <TermsSection 
                icon={<CalendarDays className="w-5 h-5" />}
                title="Kebijakan Pembatalan dan Refund"
                sectionId="cancellation"
                searchTerm={searchTerm}
              >
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
                    <h4 className="font-semibold mb-4 text-red-800 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Pembatalan oleh Customer
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { period: "30+ hari", refund: "90%", fee: "10%", color: "green" },
                        { period: "15-29 hari", refund: "70%", fee: "30%", color: "yellow" },
                        { period: "7-14 hari", refund: "50%", fee: "50%", color: "orange" },
                        { period: "<7 hari", refund: "0%", fee: "100%", color: "red" },
                      ].map((policy, index) => (
                        <div key={index} className={`p-4 bg-white rounded-lg border-l-4 border-l-gray-400 shadow-md hover:shadow-lg transition-shadow`}>
                          <div className="font-bold text-gray-700 text-lg">{policy.period}</div>
                          <div className="text-gray-600 text-sm">Refund {policy.refund}</div>
                          <div className="text-gray-500 text-xs mt-1">Admin fee {policy.fee}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium mb-2 text-green-800 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Pembatalan oleh Provider
                      </h4>
                      <p className="text-green-700 text-sm">Full refund 100% atau opsi reschedule dengan kompensasi</p>
                    </div>
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium mb-2 text-purple-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Force Majeure
                      </h4>
                      <p className="text-purple-700 text-sm">Refund negotiable untuk bencana alam, pandemi, dll</p>
                    </div>
                  </div>
                </div>
              </TermsSection>

              {/* Contact Section with modern design */}
              <Card className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Butuh Bantuan?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                        <Mail className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold mb-2">Email Support</h4>
                      <p className="text-blue-100">support@travedia.co.id</p>
                      <p className="text-blue-200 text-sm">Response: 2-4 jam</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold mb-2">WhatsApp</h4>
                      <p className="text-blue-100">+62 812-3456-7890</p>
                      <p className="text-blue-200 text-sm">24/7 Available</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                        <Phone className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold mb-2">Live Chat</h4>
                      <p className="text-blue-100">Website Support</p>
                      <p className="text-blue-200 text-sm">08:00 - 22:00 WIB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="summary">
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Ringkasan Poin Penting</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: <Users className="w-6 h-6 text-blue-600" />, title: "Siapa yang Bisa Daftar", points: ["Usia minimal 18 tahun", "Data valid dan akurat", "Mematuhi terms of service"] },
                  { icon: <CreditCard className="w-6 h-6 text-green-600" />, title: "Cara Pembayaran", points: ["Kartu kredit/debit", "Transfer bank", "E-wallet populer", "Cicilan 0% tersedia"] },
                  { icon: <CalendarDays className="w-6 h-6 text-orange-600" />, title: "Kebijakan Refund", points: ["30+ hari: 90% refund", "15-29 hari: 70% refund", "7-14 hari: 50% refund", "<7 hari: No refund"] },
                  { icon: <Shield className="w-6 h-6 text-purple-600" />, title: "Perlindungan", points: ["Data terenkripsi", "Payment gateway aman", "Dispute resolution", "Customer support 24/7"] },
                ].map((section, index) => (
                  <div key={index} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      {section.icon}
                      <h4 className="font-semibold">{section.title}</h4>
                    </div>
                    <ul className="space-y-2">
                      {section.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="faq-terms">
            <div className="space-y-4">
              {[
                { 
                  q: "Apakah saya bisa mengubah booking setelah konfirmasi?", 
                  a: "Ya, perubahan dapat dilakukan dengan subject to availability dan kemungkinan biaya tambahan. Hubungi customer service kami untuk assistance.",
                  icon: <RefreshCw className="w-5 h-5 text-blue-500" />
                },
                { 
                  q: "Bagaimana jika terjadi force majeure?", 
                  a: "Untuk situasi di luar kendali seperti bencana alam, pandemi, atau kondisi darurat lainnya, kebijakan refund akan dinegosiasikan case by case dengan mempertimbangkan kondisi dan kerugian yang terjadi.",
                  icon: <AlertTriangle className="w-5 h-5 text-orange-500" />
                },
                { 
                  q: "Apakah data pembayaran saya aman?", 
                  a: "Ya, semua transaksi diproses melalui Midtrans yang tersertifikasi PCI DSS dan menggunakan enkripsi SSL. Data kartu kredit tidak disimpan di server kami.",
                  icon: <Shield className="w-5 h-5 text-green-500" />
                },
                { 
                  q: "Berapa lama proses refund?", 
                  a: "Proses refund membutuhkan waktu 14-21 hari kerja setelah approval pembatalan, tergantung pada metode pembayaran dan bank yang digunakan.",
                  icon: <Clock className="w-5 h-5 text-purple-500" />
                },
                { 
                  q: "Apakah ada biaya tambahan yang tidak tertera di harga?", 
                  a: "Semua biaya sudah termasuk dalam harga yang ditampilkan, kecuali untuk add-on services yang dipilih secara opsional saat booking.",
                  icon: <CreditCard className="w-5 h-5 text-blue-500" />
                },
                { 
                  q: "Bagaimana jika saya tidak puas dengan layanan?", 
                  a: "Kami memiliki sistem dispute resolution. Hubungi customer service dalam 7 hari setelah trip untuk komplain dan akan ditangani sesuai prosedur yang berlaku.",
                  icon: <MessageCircle className="w-5 h-5 text-red-500" />
                }
              ].map((faq, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                      {faq.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 text-gray-800">{faq.q}</h4>
                      <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl mt-8 border">
          <p className="mb-2">
            Dengan menggunakan layanan Travedia Terbit Semesta, Anda menyatakan telah membaca, 
            memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.
          </p>
          <p>
            © 2024 Travedia Terbit Semesta. Hak cipta dilindungi undang-undang.
          </p>
          <div className="mt-4 flex justify-center gap-4 text-xs">
            <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>
            <span className="text-blue-600 cursor-pointer hover:underline">Terms of Service</span>
            <span className="text-blue-600 cursor-pointer hover:underline">Contact Us</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;