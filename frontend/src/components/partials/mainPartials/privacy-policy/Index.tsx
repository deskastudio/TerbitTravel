import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Database, 
  Lock, 
  Eye, 
  Share2, 
  UserCheck, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  Search,
  BookOpen,
  Star,
  MessageCircle,
  Phone,
  Mail,
  XCircle,
  RefreshCw,
  Globe,
  CreditCard,
  Smartphone,
  Settings,
  Users,
  MapPin,
  Calendar,
  Heart,
  BarChart3,
  Zap,
  ShieldCheck,
  Scale
} from 'lucide-react';

interface PrivacySectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  sectionId: string;
  searchTerm?: string;
}

const PrivacySection: React.FC<PrivacySectionProps> = ({ icon, title, children, sectionId, searchTerm }) => {
  const isVisible = useMemo(() => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = title.toLowerCase().includes(searchLower);
    const childrenText = React.Children.toArray(children).join(' ').toLowerCase();
    const contentMatch = childrenText.includes(searchLower);
    
    return titleMatch || contentMatch;
  }, [title, children, searchTerm]);

  if (!isVisible) return null;

  return (
    <Card className="mb-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-emerald-500" id={sectionId}>
      <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg text-white shadow-md">
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

const PrivacyPolicyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Kebijakan Privasi - Travedia Terbit Semesta</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        h1 { color: #059669; border-bottom: 3px solid #059669; padding-bottom: 10px; }
        h2 { color: #047857; margin-top: 30px; }
        h3 { color: #065f46; }
        .section { margin-bottom: 30px; }
        .highlight { background-color: #ecfdf5; padding: 15px; border-left: 4px solid #059669; margin: 10px 0; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .data-table th, .data-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .data-table th { background-color: #f0fdf4; }
        .warning { background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 10px 0; }
        .info-box { background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 15px 0; }
        .contact-info { background-color: #f0fdf4; padding: 20px; border-radius: 8px; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; }
        ul { margin: 10px 0; padding-left: 20px; }
        .rights-list { background-color: #f8fafc; padding: 15px; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>KEBIJAKAN PRIVASI</h1>
    <h2>Travedia Terbit Semesta - Platform Reservasi Wisata</h2>
    
    <div class="highlight">
        <strong>Berlaku Efektif:</strong> 1 Januari 2024<br>
        <strong>Update Terakhir:</strong> 6 Agustus 2025<br>
        <strong>Versi:</strong> 2.0<br>
        <strong>Compliance:</strong> UU ITE No. 19/2016, Perpres 82/2012
    </div>

    <div class="section">
        <h2>1. INFORMASI YANG DIKUMPULKAN</h2>
        
        <h3>A. Data Pendaftaran Akun</h3>
        <ul>
            <li>Nama lengkap sesuai identitas</li>
            <li>Alamat email untuk login dan komunikasi</li>
            <li>Password terenkripsi</li>
            <li>Nomor telepon/WhatsApp untuk konfirmasi</li>
            <li>Data profil Google (jika mendaftar via Google OAuth)</li>
        </ul>

        <h3>B. Data Pemesanan Paket Wisata</h3>
        <ul>
            <li>Detail peserta perjalanan (nama, umur, kontak darurat)</li>
            <li>Pilihan tanggal dan paket wisata</li>
            <li>Permintaan khusus dan catatan tambahan</li>
            <li>Data pembayaran melalui Midtrans (terenkripsi)</li>
            <li>Riwayat booking dan status perjalanan</li>
        </ul>

        <h3>C. Data Interaksi Platform</h3>
        <ul>
            <li>Destinasi yang dicari dan dilihat</li>
            <li>Paket wisata yang di-bookmark (love)</li>
            <li>Artikel yang dibaca dan disimpan</li>
            <li>History pencarian dan filter preferensi</li>
            <li>Rating dan review yang diberikan</li>
        </ul>

        <h3>D. Data Teknis Dasar</h3>
        <ul>
            <li>Alamat IP dan informasi browser</li>
            <li>Timestamp aktivitas login dan booking</li>
            <li>Device type (mobile/desktop)</li>
            <li>Log error untuk troubleshooting</li>
        </ul>
    </div>

    <div class="section">
        <h2>2. CARA PENGUMPULAN DATA</h2>
        
        <table class="data-table">
            <tr>
                <th>Sumber Data</th>
                <th>Jenis Informasi</th>
                <th>Tujuan Pengumpulan</th>
            </tr>
            <tr>
                <td>Form Registrasi</td>
                <td>Data pribadi, email, password</td>
                <td>Membuat akun pengguna platform</td>
            </tr>
            <tr>
                <td>Google OAuth</td>
                <td>Profil Google (nama, email, foto)</td>
                <td>Registrasi dan login cepat</td>
            </tr>
            <tr>
                <td>Form Booking</td>
                <td>Data peserta, tanggal, pembayaran</td>
                <td>Proses reservasi paket wisata</td>
            </tr>
            <tr>
                <td>Aktivitas Platform</td>
                <td>Pencarian, bookmark, artikel</td>
                <td>Personalisasi dan rekomendasi</td>
            </tr>
            <tr>
                <td>Midtrans Gateway</td>
                <td>Data transaksi pembayaran</td>
                <td>Pemrosesan pembayaran aman</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>3. PENGGUNAAN DATA</h2>
        
        <h3>A. Layanan Utama Platform</h3>
        <ul>
            <li>Pemrosesan booking dan konfirmasi paket wisata</li>
            <li>Pengiriman e-voucher dan detail perjalanan</li>
            <li>Customer support dan bantuan teknis</li>
            <li>Manajemen akun dan profil pengguna</li>
            <li>Notifikasi status pemesanan dan pembayaran</li>
        </ul>

        <h3>B. Peningkatan Pengalaman Pengguna</h3>
        <ul>
            <li>Personalisasi rekomendasi destinasi dan paket</li>
            <li>Menyimpan preferensi pencarian dan filter</li>
            <li>Menampilkan wishlist dan artikel tersimpan</li>
            <li>Analytics untuk pengembangan fitur platform</li>
        </ul>

        <h3>C. Komunikasi dan Marketing</h3>
        <ul>
            <li>Newsletter berisi paket wisata terbaru</li>
            <li>Promosi dan penawaran khusus (dengan consent)</li>
            <li>Update informasi travel dan destinasi</li>
            <li>Survey kepuasan untuk peningkatan layanan</li>
        </ul>

        <h3>D. Keamanan dan Legal</h3>
        <ul>
            <li>Deteksi dan pencegahan aktivitas mencurigakan</li>
            <li>Compliance dengan regulasi perjalanan</li>
            <li>Audit trail untuk tracking pemesanan</li>
            <li>Perlindungan terhadap fraud transaksi</li>
        </ul>
    </div>

    <div class="section">
        <h2>4. PEMBAGIAN DATA DENGAN PIHAK KETIGA</h2>
        
        <div class="warning">
            <strong>Prinsip Utama:</strong> Travedia TIDAK MENJUAL data pribadi Anda untuk tujuan komersial apapun.
        </div>

        <h3>Partner yang Dapat Mengakses Data:</h3>
        <ul>
            <li><strong>Midtrans Payment Gateway:</strong> Data pembayaran untuk processing transaksi booking</li>
            <li><strong>Travel Partners (Hotel, Tour Operator):</strong> Data peserta untuk konfirmasi layanan yang dipesan</li>
            <li><strong>Google OAuth Service:</strong> Untuk verifikasi login dan profil dasar</li>
            <li><strong>Email Service Provider:</strong> Untuk pengiriman e-voucher dan komunikasi</li>
            <li><strong>Otoritas Pemerintah:</strong> Jika diwajibkan oleh hukum atau regulasi travel</li>
        </ul>

        <div class="info-box">
            <strong>Kontrol Ketat:</strong> Semua partner wajib menandatangani Data Processing Agreement (DPA) dan hanya dapat mengakses data minimal yang diperlukan untuk layanan.
        </div>
    </div>

    <div class="section">
        <h2>5. PERLINDUNGAN DATA</h2>
        
        <h3>Teknologi Keamanan:</h3>
        <ul>
            <li><strong>Enkripsi HTTPS/SSL:</strong> Semua komunikasi data menggunakan protokol aman</li>
            <li><strong>Password Hashing:</strong> Password pengguna di-hash dengan algoritma bcrypt</li>
            <li><strong>Secure Database:</strong> Database dilindungi firewall dan access control</li>
            <li><strong>Midtrans Security:</strong> Pembayaran menggunakan standar PCI DSS Level 1</li>
            <li><strong>Regular Backup:</strong> Backup data terenkripsi dan tersimpan aman</li>
        </ul>

        <h3>Prosedur Keamanan Internal:</h3>
        <ul>
            <li>Admin access dengan two-factor authentication</li>
            <li>Regular security audit dan vulnerability check</li>
            <li>Employee training tentang data protection</li>
            <li>Incident response plan untuk security breach</li>
        </ul>
    </div>

    <div class="section">
        <h2>6. HAK PENGGUNA</h2>
        
        <div class="rights-list">
            <h3>Hak yang Anda Miliki:</h3>
            <ul>
                <li><strong>Hak Akses:</strong> Melihat dan download semua data pribadi Anda</li>
                <li><strong>Hak Koreksi:</strong> Memperbarui informasi yang tidak akurat di profil</li>
                <li><strong>Hak Penghapusan:</strong> Menghapus akun dan semua data terkait</li>
                <li><strong>Hak Portabilitas:</strong> Export data dalam format yang dapat dibaca</li>
                <li><strong>Hak Pembatasan:</strong> Membatasi pemrosesan untuk tujuan tertentu</li>
                <li><strong>Hak Penarikan Consent:</strong> Berhenti menerima marketing email</li>
            </ul>
        </div>

        <h3>Cara Menggunakan Hak Anda:</h3>
        <ul>
            <li>Login ke akun dan akses "Pengaturan Privasi"</li>
            <li>Email ke privacy@travedia.co.id dengan subject "Data Rights Request"</li>
            <li>Hubungi customer service di +62-XXX-XXXX-XXXX</li>
            <li>Kami akan respond maksimal dalam 7 hari kerja</li>
        </ul>
    </div>

    <div class="section">
        <h2>7. RETENSI DATA</h2>
        
        <table class="data-table">
            <tr>
                <th>Jenis Data</th>
                <th>Periode Penyimpanan</th>
                <th>Alasan Retensi</th>
            </tr>
            <tr>
                <td>Data Akun Pengguna</td>
                <td>Selama akun aktif</td>
                <td>Memberikan layanan berkelanjutan</td>
            </tr>
            <tr>
                <td>Data Booking & E-Voucher</td>
                <td>5 tahun</td>
                <td>Keperluan audit dan legalitas</td>
            </tr>
            <tr>
                <td>Data Marketing & Newsletter</td>
                <td>Hingga unsubscribe</td>
                <td>Komunikasi promosi dengan consent</td>
            </tr>
            <tr>
                <td>Log Teknis & Security</td>
                <td>1 tahun</td>
                <td>Monitoring keamanan sistem</td>
            </tr>
            <tr>
                <td>Data Transaksi Keuangan</td>
                <td>7 tahun</td>
                <td>Compliance perpajakan dan audit</td>
            </tr>
        </table>
    </div>

    <div class="contact-info">
        <h2>KONTAK DATA PROTECTION OFFICER</h2>
        <p><strong>Email:</strong> privacy@travedia.co.id</p>
        <p><strong>Phone:</strong> +62-XXX-XXXX-XXXX</p>
        <p><strong>Address:</strong> Jakarta, Indonesia</p>
        <p><strong>Response Time:</strong> Maksimal 7 hari kerja</p>
        <p><strong>Jam Operasional:</strong> Senin - Jumat, 09:00 - 17:00 WIB</p>
    </div>

    <div class="footer">
        <p>Kebijakan Privasi ini merupakan bagian dari Syarat dan Ketentuan Travedia Terbit Semesta.</p>
        <p>Dengan menggunakan platform kami, Anda menyetujui pengumpulan dan penggunaan data sesuai kebijakan ini.</p>
        <p><strong>© 2024 Travedia Terbit Semesta. Melindungi Privasi Anda.</strong></p>
    </div>
</body>
</html>`;
const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Kebijakan-Privasi-Travedia-Terbit-Semesta.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setTimeout(() => {
        alert('✅ Kebijakan Privasi berhasil didownload! File HTML dapat dibuka di browser atau dikonversi ke PDF.');
      }, 500);
      
    } catch (error) {
      alert('❌ Terjadi kesalahan saat download. Silakan coba lagi.');
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const searchResults = useMemo(() => {
    if (!searchTerm) return null;
    
    const results: { id: string; title: string; content: string }[] = [];
    const searchLower = searchTerm.toLowerCase();
    
    const sections = [
      { id: 'data-collection', title: 'Informasi yang Dikumpulkan', content: 'data pendaftaran akun booking interaksi teknis nama email password paket wisata' },
      { id: 'data-usage', title: 'Cara Pengumpulan Data', content: 'registrasi google oauth form booking midtrans aktivitas platform' },
      { id: 'data-purpose', title: 'Penggunaan Data', content: 'layanan platform booking voucher customer support personalisasi marketing komunikasi keamanan' },
      { id: 'data-sharing', title: 'Pembagian Data', content: 'midtrans travel partners google oauth email service otoritas pemerintah' },
      { id: 'data-protection', title: 'Perlindungan Data', content: 'enkripsi https ssl password hashing secure database pci dss backup' },
      { id: 'user-rights', title: 'Hak Pengguna', content: 'akses koreksi penghapusan portabilitas pembatasan consent' },
      { id: 'retention', title: 'Retensi Data', content: 'periode penyimpanan akun booking marketing log transaksi' },
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl py-8">
        {/* Hero Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-5 rounded-3xl"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg">
                <Shield className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Kebijakan Privasi
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Platform reservasi wisata Travedia Terbit Semesta berkomitmen melindungi privasi dan keamanan data pribadi Anda. 
              Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
            </p>
            
            <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
              <Badge variant="outline" className="text-sm px-3 py-1 border-emerald-300">
                <Clock className="w-4 h-4 mr-1" />
                Update: 6 Agustus 2025
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1 border-emerald-300">
                <ShieldCheck className="w-4 h-4 mr-1" />
                UU ITE Compliant
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadPDF} 
                className="gap-2 border-emerald-300 hover:bg-emerald-50"
                disabled={isDownloading}
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download HTML'}
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari dalam kebijakan privasi..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
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
          <Card className="mb-6 border-emerald-200 bg-emerald-50">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-emerald-800">Hasil Pencarian:</h3>
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
                    className="text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                  >
                    {result.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content with Tabs */}
        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="privacy" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Kebijakan Lengkap
            </TabsTrigger>
            <TabsTrigger value="summary" className="gap-2">
              <Star className="w-4 h-4" />
              Ringkasan Privasi
            </TabsTrigger>
            <TabsTrigger value="faq-privacy" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              FAQ Privasi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="privacy">
            <ScrollArea className="h-auto">
              {/* Informasi yang Dikumpulkan */}
              <PrivacySection 
                icon={<Database className="w-5 h-5" />}
                title="Informasi yang Dikumpulkan"
                sectionId="data-collection"
                searchTerm={searchTerm}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="w-6 h-6 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Data Pendaftaran Akun</h4>
                    </div>
                    <ul className="text-blue-700 space-y-2">
                      <li>• Nama lengkap sesuai identitas</li>
                      <li>• Alamat email untuk login</li>
                      <li>• Password terenkripsi</li>
                      <li>• Nomor telepon/WhatsApp</li>
                      <li>• Data Google (jika OAuth)</li>
                    </ul>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="w-6 h-6 text-green-600" />
                      <h4 className="font-semibold text-green-800">Data Pemesanan</h4>
                    </div>
                    <ul className="text-green-700 space-y-2">
                      <li>• Detail peserta perjalanan</li>
                      <li>• Tanggal dan paket pilihan</li>
                      <li>• Data pembayaran Midtrans</li>
                      <li>• Riwayat booking</li>
                      <li>• E-voucher dan invoice</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="w-6 h-6 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">Data Interaksi</h4>
                    </div>
                    <ul className="text-purple-700 space-y-2">
                      <li>• Destinasi yang dicari</li>
                      <li>• Paket yang di-bookmark</li>
                      <li>• Artikel yang disimpan</li>
                      <li>• History pencarian</li>
                      <li>• Rating dan review</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Smartphone className="w-6 h-6 text-orange-600" />
                      <h4 className="font-semibold text-orange-800">Data Teknis</h4>
                    </div>
                    <ul className="text-orange-700 space-y-2">
                      <li>• Alamat IP dan browser</li>
                      <li>• Timestamp aktivitas</li>
                      <li>• Device type</li>
                      <li>• Log error sistem</li>
                      <li>• Session data</li>
                    </ul>
                  </div>
                </div>
              </PrivacySection>

              {/* Cara Pengumpulan Data */}
              <PrivacySection 
                icon={<Settings className="w-5 h-5" />}
                title="Cara Pengumpulan Data"
                sectionId="data-usage"
                searchTerm={searchTerm}
              >
                <div className="space-y-4">
                  {[
                    { icon: <UserCheck className="w-5 h-5 text-blue-500" />, source: "Form Registrasi", data: "Data pribadi, email, password", purpose: "Membuat akun pengguna platform", color: "blue" },
                    { icon: <Globe className="w-5 h-5 text-green-500" />, source: "Google OAuth", data: "Profil Google (nama, email, foto)", purpose: "Registrasi dan login cepat", color: "green" },
                    { icon: <CreditCard className="w-5 h-5 text-purple-500" />, source: "Form Booking", data: "Data peserta, tanggal, pembayaran", purpose: "Proses reservasi paket wisata", color: "purple" },
                    { icon: <BarChart3 className="w-5 h-5 text-orange-500" />, source: "Aktivitas Platform", data: "Pencarian, bookmark, artikel", purpose: "Personalisasi dan rekomendasi", color: "orange" },
                    { icon: <Shield className="w-5 h-5 text-pink-500" />, source: "Midtrans Gateway", data: "Data transaksi pembayaran", purpose: "Pemrosesan pembayaran aman", color: "pink" },
                  ].map((item, index) => (
                    <div key={index} className={`flex items-start gap-4 p-4 bg-${item.color}-50 rounded-lg border border-${item.color}-200 hover:shadow-md transition-all`}>
                      <div className={`p-2 bg-${item.color}-100 rounded-lg flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-${item.color}-800 mb-1`}>{item.source}</h4>
                        <p className={`text-${item.color}-700 text-sm mb-1`}><strong>Data:</strong> {item.data}</p>
                        <p className={`text-${item.color}-600 text-sm`}><strong>Tujuan:</strong> {item.purpose}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </PrivacySection>

              {/* Penggunaan Data */}
              <PrivacySection 
                icon={<Zap className="w-5 h-5" />}
                title="Penggunaan Data"
                sectionId="data-purpose"
                searchTerm={searchTerm}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <h4 className="font-semibold mb-4 text-blue-800 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Layanan Utama Platform
                      </h4>
                      <ul className="text-blue-700 space-y-2">
                        <li>• Pemrosesan booking paket wisata</li>
                        <li>• Pengiriman e-voucher digital</li>
                        <li>• Customer support dan bantuan</li>
                        <li>• Manajemen akun pengguna</li>
                        <li>• Notifikasi status booking</li>
                      </ul>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                      <h4 className="font-semibold mb-4 text-green-800 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Personalisasi
                      </h4>
                      <ul className="text-green-700 space-y-2">
                        <li>• Rekomendasi destinasi sesuai minat</li>
                        <li>• Wishlist paket favorit</li>
                        <li>• History pencarian tersimpan</li>
                        <li>• Artikel yang disimpan</li>
                        <li>• Filter preferensi</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <h4 className="font-semibold mb-4 text-purple-800 flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Komunikasi
                      </h4>
                      <ul className="text-purple-700 space-y-2">
                        <li>• Newsletter paket terbaru</li>
                        <li>• Promosi dan diskon khusus</li>
                        <li>• Update travel information</li>
                        <li>• Konfirmasi booking</li>
                        <li>• Survey kepuasan</li>
                      </ul>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                      <h4 className="font-semibold mb-4 text-orange-800 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Keamanan & Legal
                      </h4>
                      <ul className="text-orange-700 space-y-2">
                        <li>• Deteksi fraud transaksi</li>
                        <li>• Compliance regulasi travel</li>
                        <li>• Audit trail booking</li>
                        <li>• Monitoring keamanan</li>
                        <li>• Legal documentation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl mt-6">
                  <h4 className="font-medium mb-3 text-yellow-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Consent Marketing
                  </h4>
                  <p className="text-yellow-700">
                    Aktivitas marketing dan promosi hanya dilakukan dengan persetujuan eksplisit Anda dan dapat ditarik kapan saja 
                    melalui pengaturan akun atau unsubscribe di email.
                  </p>
                </div>
              </PrivacySection>
              {/* Pembagian Data */}
              <PrivacySection 
                icon={<Share2 className="w-5 h-5" />}
                title="Pembagian Data dengan Pihak Ketiga"
                sectionId="data-sharing"
                searchTerm={searchTerm}
              >
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                    <h4 className="font-bold mb-3 text-red-800 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Prinsip Utama
                    </h4>
                    <p className="text-red-700 font-medium text-lg">
                      Travedia TIDAK MENJUAL data pribadi Anda untuk tujuan komersial apapun.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { 
                        icon: <CreditCard className="w-6 h-6 text-blue-600" />, 
                        title: "Midtrans", 
                        desc: "Payment Gateway", 
                        data: "Data pembayaran untuk processing transaksi booking",
                        access: "Hanya saat transaksi"
                      },
                      { 
                        icon: <MapPin className="w-6 h-6 text-green-600" />, 
                        title: "Travel Partners", 
                        desc: "Hotel, Tour Operator", 
                        data: "Data peserta untuk konfirmasi layanan yang dipesan",
                        access: "Minimal yang diperlukan"
                      },
                      { 
                        icon: <Globe className="w-6 h-6 text-purple-600" />, 
                        title: "Google OAuth", 
                        desc: "Authentication Service", 
                        data: "Verifikasi login dan profil dasar",
                        access: "Saat login dengan Google"
                      },
                      { 
                        icon: <Mail className="w-6 h-6 text-orange-600" />, 
                        title: "Email Service", 
                        desc: "Communication Provider", 
                        data: "Email untuk e-voucher dan komunikasi",
                        access: "Dengan kontrak NDA"
                      },
                    ].map((partner, index) => (
                      <div key={index} className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="mb-4">{partner.icon}</div>
                        <h4 className="font-semibold text-gray-800 mb-1">{partner.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{partner.desc}</p>
                        <p className="text-gray-500 text-xs mb-2">{partner.data}</p>
                        <Badge variant="outline" className="text-xs">
                          {partner.access}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-800 flex items-center gap-2">
                      <Scale className="w-5 h-5" />
                      Otoritas Pemerintah
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Data dapat dibagikan kepada otoritas pemerintah jika diwajibkan oleh hukum, regulasi travel, atau kepentingan keamanan nasional.
                    </p>
                  </div>
                </div>
              </PrivacySection>

              {/* Perlindungan Data */}
              <PrivacySection 
                icon={<Lock className="w-5 h-5" />}
                title="Perlindungan Data"
                sectionId="data-protection"
                searchTerm={searchTerm}
              >
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
                    <h4 className="font-semibold mb-4 text-emerald-800 flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Teknologi Keamanan
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { tech: "HTTPS/SSL Encryption", desc: "Semua komunikasi data menggunakan protokol aman SSL/TLS" },
                        { tech: "Password Hashing", desc: "Password pengguna di-hash dengan algoritma bcrypt yang aman" },
                        { tech: "Secure Database", desc: "Database dilindungi dengan firewall dan access control ketat" },
                        { tech: "Midtrans PCI DSS", desc: "Pembayaran menggunakan standar keamanan PCI DSS Level 1" },
                        { tech: "Encrypted Backup", desc: "Backup data terenkripsi dan disimpan di lokasi aman" },
                        { tech: "Two-Factor Auth", desc: "Admin access menggunakan autentikasi dua faktor" },
                      ].map((item, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg border border-emerald-200">
                          <h5 className="font-medium text-emerald-800 text-sm mb-2">{item.tech}</h5>
                          <p className="text-emerald-700 text-xs">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                    <h4 className="font-medium mb-4 text-blue-800 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      Prosedur Keamanan Internal
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="text-blue-700 text-sm space-y-2">
                        <li>• Regular security audit sistem</li>
                        <li>• Vulnerability assessment berkala</li>
                        <li>• Employee data protection training</li>
                      </ul>
                      <ul className="text-blue-700 text-sm space-y-2">
                        <li>• Incident response plan lengkap</li>
                        <li>• Access monitoring dan logging</li>
                        <li>• Compliance review rutin</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </PrivacySection>

              {/* Hak Pengguna */}
              <PrivacySection 
                icon={<UserCheck className="w-5 h-5" />}
                title="Hak Pengguna"
                sectionId="user-rights"
                searchTerm={searchTerm}
              >
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
                    <h4 className="font-semibold mb-4 text-indigo-800 flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      Hak yang Anda Miliki
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { right: "Hak Akses", desc: "Melihat dan download semua data pribadi yang tersimpan", icon: <Eye className="w-4 h-4" /> },
                        { right: "Hak Koreksi", desc: "Memperbarui informasi yang tidak akurat di profil", icon: <Settings className="w-4 h-4" /> },
                        { right: "Hak Penghapusan", desc: "Menghapus akun dan semua data terkait", icon: <XCircle className="w-4 h-4" /> },
                        { right: "Hak Portabilitas", desc: "Export data dalam format yang dapat dibaca", icon: <Download className="w-4 h-4" /> },
                        { right: "Hak Pembatasan", desc: "Membatasi pemrosesan untuk tujuan tertentu", icon: <Lock className="w-4 h-4" /> },
                        { right: "Penarikan Consent", desc: "Berhenti menerima marketing email", icon: <RefreshCw className="w-4 h-4" /> },
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-indigo-200">
                          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            {item.icon}
                          </div>
                          <div>
                            <h5 className="font-medium text-indigo-800 mb-1">{item.right}</h5>
                            <p className="text-indigo-700 text-sm">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                    <h4 className="font-medium mb-4 text-green-800 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Cara Menggunakan Hak Anda
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="text-green-700 text-sm space-y-2">
                        <li>• Login ke akun → "Pengaturan Privasi"</li>
                        <li>• Email: privacy@travedia.co.id</li>
                      </ul>
                      <ul className="text-green-700 text-sm space-y-2">
                        <li>• Customer Service: +62-XXX-XXX</li>
                        <li>• Response time: 7 hari kerja</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </PrivacySection>

              {/* Retensi Data */}
              <PrivacySection 
                icon={<Calendar className="w-5 h-5" />}
                title="Retensi Data"
                sectionId="retention"
                searchTerm={searchTerm}
              >
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 p-4 text-left font-semibold text-gray-800">Jenis Data</th>
                          <th className="border border-gray-200 p-4 text-left font-semibold text-gray-800">Periode</th>
                          <th className="border border-gray-200 p-4 text-left font-semibold text-gray-800">Alasan Retensi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { data: "Data Akun Pengguna", period: "Selama akun aktif", reason: "Layanan berkelanjutan platform", color: "blue" },
                          { data: "Data Booking & E-Voucher", period: "5 tahun", reason: "Audit dan keperluan legalitas", color: "green" },
                          { data: "Data Marketing", period: "Hingga unsubscribe", reason: "Komunikasi promosi dengan consent", color: "purple" },
                          { data: "Log Teknis & Security", period: "1 tahun", reason: "Monitoring keamanan sistem", color: "orange" },
                          { data: "Data Transaksi Keuangan", period: "7 tahun", reason: "Compliance perpajakan", color: "red" },
                        ].map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-200 p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                <span className="font-medium text-gray-800">{item.data}</span>
                              </div>
                            </td>
                            <td className="border border-gray-200 p-4 text-gray-700 font-medium">{item.period}</td>
                            <td className="border border-gray-200 p-4 text-gray-600 text-sm">{item.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-800 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Penghapusan Otomatis
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Data akan dihapus secara otomatis setelah periode retensi berakhir, kecuali ada kewajiban hukum 
                      untuk menyimpan lebih lama sesuai regulasi perpajakan dan audit.
                    </p>
                  </div>
                </div>
              </PrivacySection>

              {/* Contact Section */}
              <Card className="mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Data Protection Officer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                        <Mail className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold mb-2">Email Privacy</h4>
                      <p className="text-emerald-100">travediaterbitsemesta@gmail.com</p>
                      <p className="text-emerald-200 text-sm">Max 7 hari kerja</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                        <Phone className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold mb-2">Customer Service</h4>
                      <p className="text-emerald-100">+62 859-4724-2348</p>
                      <p className="text-emerald-200 text-sm">Senin-Jumat 09:00-17:00</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold mb-2">Office</h4>
                      <p className="text-emerald-100">Pagedangan, Tangerang, Indonesia</p>
                      <p className="text-emerald-200 text-sm">Jam kerja</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="summary">
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Ringkasan Kebijakan Privasi</h3>
              <p className="text-center text-gray-600 mb-8">Travedia Terbit Semesta - Platform Reservasi Wisata</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    icon: <Database className="w-6 h-6 text-emerald-600" />, 
                    title: "Data yang Dikumpulkan", 
                    points: ["Data akun dan registrasi", "Informasi booking paket wisata", "Aktivitas platform (search, bookmark)", "Data teknis dasar untuk keamanan"] 
                  },
                  { 
                    icon: <Shield className="w-6 h-6 text-blue-600" />, 
                    title: "Keamanan Data", 
                    points: ["Enkripsi HTTPS/SSL", "Password hashing bcrypt", "Midtrans PCI DSS Level 1", "Backup terenkripsi"] 
                  },
                  { 
                    icon: <UserCheck className="w-6 h-6 text-purple-600" />, 
                    title: "Hak Anda", 
                    points: ["Akses dan download data", "Edit profil dan koreksi", "Hapus akun komplet", "Unsubscribe marketing"] 
                  },
                  { 
                    icon: <Share2 className="w-6 h-6 text-orange-600" />, 
                    title: "Partner Data", 
                    points: ["Midtrans untuk pembayaran", "Travel partners untuk layanan", "Google OAuth untuk login", "TIDAK dijual untuk komersial"] 
                  },
                ].map((section, index) => (
                  <div key={index} className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      {section.icon}
                      <h4 className="font-semibold text-lg">{section.title}</h4>
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

              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl mt-8">
                <h4 className="font-semibold mb-3 text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Komitmen Kami
                </h4>
                <p className="text-emerald-700">
                  Travedia berkomitmen melindungi privasi Anda dengan standar keamanan tinggi, transparansi penuh dalam 
                  penggunaan data, dan memberikan kontrol penuh atas informasi pribadi Anda. Kami tidak menjual data 
                  untuk tujuan komersial dan selalu mengutamakan kepercayaan Anda.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="faq-privacy">
            <div className="space-y-4">
              {[
                { 
                  q: "Bagaimana cara mengunduh data pribadi saya?", 
                  a: "Login ke akun Anda, masuk ke 'Pengaturan Privasi', lalu klik 'Download Data Saya'. File akan dikirim ke email dalam 24 jam dalam format yang mudah dibaca.",
                  icon: <Download className="w-5 h-5 text-blue-500" />
                },
                { 
                  q: "Apakah data pembayaran melalui Midtrans aman?", 
                  a: "Sangat aman. Midtrans menggunakan standar keamanan PCI DSS Level 1, dan kami tidak menyimpan informasi kartu kredit di server Travedia. Semua transaksi terenkripsi end-to-end.",
                  icon: <CreditCard className="w-5 h-5 text-green-500" />
                },
                { 
                  q: "Bisakah saya menghapus akun dan semua data?", 
                  a: "Ya, Anda dapat menghapus akun melalui 'Pengaturan Akun' atau email ke privacy@travedia.co.id. Semua data akan dihapus dalam 30 hari, kecuali data booking yang disimpan 5 tahun untuk audit.",
                  icon: <XCircle className="w-5 h-5 text-red-500" />
                },
                { 
                  q: "Bagaimana berhenti menerima email promosi?", 
                  a: "Klik 'Unsubscribe' di email promosi, atau ubah pengaturan di 'Notifikasi' di akun Anda. Anda tetap akan menerima email penting seperti konfirmasi booking dan e-voucher.",
                  icon: <Mail className="w-5 h-5 text-purple-500" />
                },
                { 
                  q: "Apakah data saya dibagikan ke pihak lain?", 
                  a: "Kami TIDAK menjual data pribadi. Data hanya dibagikan dengan Midtrans untuk pembayaran, travel partners untuk layanan yang Anda pesan, dan Google untuk login OAuth. Semua dengan kontrak ketat.",
                  icon: <Share2 className="w-5 h-5 text-orange-500" />
                },
                { 
                  q: "Berapa lama data booking saya disimpan?", 
                  a: "Data booking dan e-voucher disimpan 5 tahun untuk keperluan audit dan legalitas. Data akun aktif disimpan selama akun masih digunakan. Data marketing dihapus saat unsubscribe.",
                  icon: <Clock className="w-5 h-5 text-blue-500" />
                },
                { 
                  q: "Apa yang terjadi jika ada kebocoran data?", 
                  a: "Kami memiliki incident response plan lengkap. Jika terjadi security breach, kami akan memberitahu dalam 72 jam dan mengambil langkah mitigasi sesuai protokol keamanan yang telah ditetapkan.",
                  icon: <AlertTriangle className="w-5 h-5 text-red-500" />
                },
                { 
                  q: "Bagaimana dengan data saat login via Google?", 
                  a: "Saat login via Google OAuth, kami hanya mengakses nama, email, dan foto profil Anda. Google tidak membagikan password Anda, dan Anda dapat mencabut akses kapan saja dari pengaturan Google.",
                  icon: <Globe className="w-5 h-5 text-yellow-500" />
                },
                { 
                  q: "Apakah saya bisa mengubah data booking setelah pembayaran?", 
                  a: "Perubahan data booking terbatas setelah pembayaran. Anda dapat mengubah detail kecil melalui customer service, tetapi perubahan besar mungkin dikenakan biaya sesuai kebijakan travel partner.",
                  icon: <Settings className="w-5 h-5 text-indigo-500" />
                },
                { 
                  q: "Bagaimana Travedia melindungi data anak-anak?", 
                  a: "Kami tidak secara khusus menargetkan anak di bawah 17 tahun. Jika orang tua booking untuk anak, data anak hanya digunakan untuk keperluan travel dan dilindungi dengan standar keamanan yang sama.",
                  icon: <Users className="w-5 h-5 text-green-500" />
                }
              ].map((faq, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
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

              {/* Additional FAQ Section */}
              <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                <h4 className="font-semibold mb-4 text-emerald-800 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Butuh Bantuan Lebih Lanjut?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="bg-emerald-100 p-3 rounded-lg w-fit mx-auto mb-2">
                      <Mail className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-emerald-700 text-sm font-medium">Email Privacy Officer</p>
                    <p className="text-emerald-600 text-xs">privacy@travedia.co.id</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-emerald-100 p-3 rounded-lg w-fit mx-auto mb-2">
                      <Phone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-emerald-700 text-sm font-medium">Customer Service</p>
                    <p className="text-emerald-600 text-xs">+62-XXX-XXXX-XXXX</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-emerald-100 p-3 rounded-lg w-fit mx-auto mb-2">
                      <Settings className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-emerald-700 text-sm font-medium">Pengaturan Akun</p>
                    <p className="text-emerald-600 text-xs">Login → Profil → Privacy</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Privacy Timeline */}
        <Card className="mb-8 border-emerald-200">
          <CardHeader className="bg-emerald-50">
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Clock className="w-5 h-5" />
              Timeline Kebijakan Privasi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { date: "1 Januari 2024", event: "Kebijakan Privasi v1.0 berlaku efektif", status: "completed" },
                { date: "6 Agustus 2025", event: "Update v2.0 - Penyesuaian dengan fitur platform terbaru", status: "completed" },
                { date: "Ongoing", event: "Review berkala setiap 6 bulan", status: "ongoing" },
                { date: "Future", event: "Update akan diberitahukan 30 hari sebelumnya", status: "future" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'ongoing' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.event}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  {item.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {item.status === 'ongoing' && <Clock className="w-4 h-4 text-blue-500" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl mt-8 border">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-emerald-600">Travedia Privacy Protected</span>
          </div>
          <p className="mb-2">
            Kebijakan Privasi ini merupakan bagian dari Syarat dan Ketentuan Travedia Terbit Semesta.
            Dengan menggunakan platform reservasi wisata kami, Anda menyetujui pengumpulan dan penggunaan data sesuai kebijakan ini.
          </p>
          <p className="mb-4">
            © 2024 Travedia Terbit Semesta. Melindungi Privasi Perjalanan Anda.
          </p>
          <div className="flex justify-center gap-4 text-xs flex-wrap">
            <span className="text-emerald-600 cursor-pointer hover:underline">Syarat & Ketentuan</span>
            <span className="text-emerald-600 cursor-pointer hover:underline">FAQ</span>
            <span className="text-emerald-600 cursor-pointer hover:underline">Kontak DPO</span>
            <span className="text-emerald-600 cursor-pointer hover:underline">Pengaturan Privasi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
