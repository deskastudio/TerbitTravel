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
  Cookie, 
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
  FileText,
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
    <h2>Travedia Terbit Semesta</h2>
    
    <div class="highlight">
        <strong>Berlaku Efektif:</strong> 1 Januari 2024<br>
        <strong>Update Terakhir:</strong> 1 Januari 2024<br>
        <strong>Versi:</strong> 1.0<br>
        <strong>Compliance:</strong> UU ITE No. 19/2016, GDPR Ready
    </div>

    <div class="section">
        <h2>1. INFORMASI YANG DIKUMPULKAN</h2>
        
        <h3>A. Data Pribadi</h3>
        <ul>
            <li>Nama lengkap sesuai identitas</li>
            <li>Alamat email aktif</li>
            <li>Nomor telepon/WhatsApp</li>
            <li>Alamat tempat tinggal</li>
            <li>Tanggal lahir</li>
        </ul>

        <h3>B. Data Identitas</h3>
        <ul>
            <li>Nomor KTP/NIK untuk verifikasi booking domestik</li>
            <li>Nomor Paspor untuk perjalanan internasional</li>
            <li>Foto identitas (jika diperlukan)</li>
        </ul>

        <h3>C. Data Pembayaran</h3>
        <ul>
            <li>Informasi kartu kredit/debit (terenkripsi)</li>
            <li>Riwayat transaksi dan booking</li>
            <li>Metode pembayaran yang dipilih</li>
            <li>Invoice dan receipt digital</li>
        </ul>

        <h3>D. Data Teknis</h3>
        <ul>
            <li>IP Address dan lokasi geografis</li>
            <li>Browser type dan versi</li>
            <li>Device information (mobile/desktop)</li>
            <li>Cookies dan tracking data</li>
            <li>Log aktivitas website</li>
        </ul>

        <h3>E. Data Aktivitas</h3>
        <ul>
            <li>Halaman yang dikunjungi dan durasi</li>
            <li>Paket wisata yang dilihat dan dicari</li>
            <li>History pencarian dan filter</li>
            <li>Interaksi dengan konten dan fitur</li>
        </ul>

        <h3>F. Data Preferensi</h3>
        <ul>
            <li>Wishlist paket favorit</li>
            <li>Review dan rating yang diberikan</li>
            <li>Preferensi destinasi dan kategori</li>
            <li>Newsletter subscription preferences</li>
        </ul>
    </div>

    <div class="section">
        <h2>2. CARA PENGUMPULAN DATA</h2>
        
        <table class="data-table">
            <tr>
                <th>Metode Pengumpulan</th>
                <th>Jenis Data</th>
                <th>Tujuan</th>
            </tr>
            <tr>
                <td>Registrasi Akun</td>
                <td>Data Pribadi, Email, Password</td>
                <td>Membuat akun pengguna</td>
            </tr>
            <tr>
                <td>Google OAuth</td>
                <td>Google Profile Data</td>
                <td>Quick registration</td>
            </tr>
            <tr>
                <td>Proses Booking</td>
                <td>Data Identitas, Pembayaran</td>
                <td>Konfirmasi dan processing</td>
            </tr>
            <tr>
                <td>Website Analytics</td>
                <td>Data Teknis, Cookies</td>
                <td>Improve user experience</td>
            </tr>
            <tr>
                <td>Customer Service</td>
                <td>Communication logs</td>
                <td>Support dan troubleshooting</td>
            </tr>
            <tr>
                <td>Survey & Feedback</td>
                <td>Opinion dan satisfaction data</td>
                <td>Service improvement</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>3. TUJUAN PENGGUNAAN DATA</h2>
        
        <h3>A. Layanan Utama</h3>
        <ul>
            <li>Proses booking dan konfirmasi perjalanan</li>
            <li>Manajemen akun dan profil pengguna</li>
            <li>Customer support dan troubleshooting</li>
            <li>Payment processing dan invoice</li>
        </ul>

        <h3>B. Komunikasi</h3>
        <ul>
            <li>Email konfirmasi booking dan e-voucher</li>
            <li>Update status perjalanan</li>
            <li>Newsletter dan travel tips</li>
            <li>Notifikasi penting dan emergency</li>
        </ul>

        <h3>C. Peningkatan Layanan</h3>
        <ul>
            <li>Analytics dan performance monitoring</li>
            <li>Personalisasi rekomendasi paket</li>
            <li>A/B testing fitur baru</li>
            <li>Customer behavior analysis</li>
        </ul>

        <h3>D. Keamanan</h3>
        <ul>
            <li>Fraud detection dan prevention</li>
            <li>Account security monitoring</li>
            <li>Risk assessment</li>
            <li>Compliance dengan regulasi</li>
        </ul>

        <h3>E. Marketing (dengan consent)</h3>
        <ul>
            <li>Promosi paket wisata terbaru</li>
            <li>Penawaran khusus dan diskon</li>
            <li>Remarketing campaigns</li>
            <li>Social media advertising</li>
        </ul>
    </div>

    <div class="section">
        <h2>4. PEMBAGIAN DATA DENGAN PIHAK KETIGA</h2>
        
        <div class="warning">
            <strong>Prinsip Penting:</strong> Kami TIDAK PERNAH menjual data pribadi Anda kepada pihak ketiga untuk tujuan komersial.
        </div>

        <h3>Pihak yang Dapat Mengakses Data:</h3>
        <ul>
            <li><strong>Midtrans (Payment Gateway):</strong> Data pembayaran untuk processing transaksi</li>
            <li><strong>Travel Partners:</strong> Hotel, tour operator, transport provider - hanya data yang diperlukan untuk layanan</li>
            <li><strong>Service Providers:</strong> Email service, SMS gateway, cloud storage dengan kontrak NDA</li>
            <li><strong>Otoritas Hukum:</strong> Jika diwajibkan oleh hukum, pengadilan, atau regulasi pemerintah</li>
        </ul>
    </div>

    <div class="section">
        <h2>5. PERLINDUNGAN DATA</h2>
        
        <h3>Teknologi Keamanan:</h3>
        <ul>
            <li><strong>Enkripsi SSL/TLS:</strong> Semua transmisi data menggunakan protokol enkripsi standar industri</li>
            <li><strong>Password Hashing:</strong> Password disimpan menggunakan algoritma bcrypt dengan salt</li>
            <li><strong>Access Control:</strong> Role-based permissions dan principle of least privilege</li>
            <li><strong>Security Audit:</strong> Regular vulnerability assessment dan penetration testing</li>
            <li><strong>Backup Encryption:</strong> Semua backup data dienkripsi dan disimpan secara terpisah</li>
        </ul>

        <h3>Prosedur Keamanan:</h3>
        <ul>
            <li>Multi-factor authentication untuk admin access</li>
            <li>Regular security training untuk tim internal</li>
            <li>Incident response plan untuk security breaches</li>
            <li>Data anonymization untuk analytics purposes</li>
        </ul>
    </div>

    <div class="section">
        <h2>6. HAK PENGGUNA</h2>
        
        <div class="rights-list">
            <h3>Hak yang Anda Miliki:</h3>
            <ul>
                <li><strong>Hak Akses:</strong> Melihat dan mengunduh semua data pribadi yang tersimpan</li>
                <li><strong>Hak Koreksi:</strong> Mengubah atau memperbarui data yang tidak akurat</li>
                <li><strong>Hak Penghapusan:</strong> Request penghapusan akun dan semua data terkait</li>
                <li><strong>Hak Portabilitas:</strong> Export data dalam format CSV atau JSON</li>
                <li><strong>Hak Penarikan Consent:</strong> Berhenti menerima marketing communications</li>
                <li><strong>Hak Pembatasan:</strong> Membatasi penggunaan data untuk tujuan tertentu</li>
                <li><strong>Hak Objection:</strong> Menolak processing data untuk direct marketing</li>
            </ul>
        </div>

        <h3>Cara Menggunakan Hak Anda:</h3>
        <ul>
            <li>Login ke akun dan akses "Privacy Settings"</li>
            <li>Hubungi privacy@travedia.co.id dengan subject "Data Rights Request"</li>
            <li>Kami akan merespon dalam 30 hari sesuai regulasi</li>
        </ul>
    </div>

    <div class="section">
        <h2>7. KEBIJAKAN COOKIE</h2>
        
        <h3>Jenis Cookies yang Digunakan:</h3>
        <ul>
            <li><strong>Essential Cookies:</strong> Session management, keamanan, fungsi dasar website</li>
            <li><strong>Analytics Cookies:</strong> Google Analytics untuk analisis traffic dan behavior</li>
            <li><strong>Marketing Cookies:</strong> Tracking untuk personalized ads (dengan consent)</li>
            <li><strong>Third-party Cookies:</strong> Social media integration, payment processing</li>
        </ul>

        <h3>Pengelolaan Cookies:</h3>
        <ul>
            <li>Anda dapat mengatur preferensi cookies di browser settings</li>
            <li>Menonaktifkan cookies mungkin mempengaruhi fungsionalitas website</li>
            <li>Cookie consent dapat diubah melalui Cookie Preferences di footer</li>
        </ul>
    </div>

    <div class="section">
        <h2>8. RETENSI DATA</h2>
        
        <table class="data-table">
            <tr>
                <th>Jenis Data</th>
                <th>Periode Retensi</th>
                <th>Alasan</th>
            </tr>
            <tr>
                <td>Data Akun Aktif</td>
                <td>Selama akun aktif</td>
                <td>Layanan berkelanjutan</td>
            </tr>
            <tr>
                <td>Data Booking</td>
                <td>7 tahun</td>
                <td>Audit dan legal compliance</td>
            </tr>
            <tr>
                <td>Data Marketing</td>
                <td>Hingga unsubscribe</td>
                <td>Consent-based marketing</td>
            </tr>
            <tr>
                <td>Technical Logs</td>
                <td>1 tahun</td>
                <td>Security dan troubleshooting</td>
            </tr>
            <tr>
                <td>Financial Records</td>
                <td>10 tahun</td>
                <td>Tax dan accounting requirements</td>
            </tr>
        </table>
    </div>

    <div class="contact-info">
        <h2>KONTAK DATA PROTECTION OFFICER</h2>
        <p><strong>Email:</strong> privacy@travedia.co.id</p>
        <p><strong>Phone:</strong> +62 812-3456-7890</p>
        <p><strong>Address:</strong> Jl. Raya Travedia No. 123, Jakarta 12345</p>
        <p><strong>Response Time:</strong> Maksimal 72 jam untuk inquiry privacy</p>
    </div>

    <div class="footer">
        <p>Kebijakan Privasi ini adalah bagian integral dari Terms & Conditions Travedia Terbit Semesta.</p>
        <p>Kami berkomitmen untuk melindungi privasi dan data pribadi Anda sesuai dengan standar internasional.</p>
        <p><strong>© 2024 Travedia Terbit Semesta. Privacy Protected by Design.</strong></p>
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
      { id: 'data-collection', title: 'Informasi yang Dikumpulkan', content: 'data pribadi identitas pembayaran teknis aktivitas preferensi nama email telepon alamat' },
      { id: 'data-usage', title: 'Cara Pengumpulan Data', content: 'registrasi booking google oauth analytics customer service survey' },
      { id: 'data-purpose', title: 'Tujuan Penggunaan Data', content: 'layanan komunikasi peningkatan keamanan marketing konfirmasi newsletter' },
      { id: 'data-sharing', title: 'Pembagian Data', content: 'pihak ketiga midtrans travel partners service providers otoritas hukum' },
      { id: 'data-protection', title: 'Perlindungan Data', content: 'enkripsi ssl password hashing access control security audit backup' },
      { id: 'user-rights', title: 'Hak Pengguna', content: 'akses koreksi penghapusan portabilitas consent pembatasan objection' },
      { id: 'cookies', title: 'Kebijakan Cookie', content: 'essential analytics marketing third-party cookies browser settings consent' },
      { id: 'retention', title: 'Retensi Data', content: 'periode penyimpanan akun booking marketing technical logs financial' },
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
              Kami berkomitmen melindungi privasi dan keamanan data pribadi Anda. 
              Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
            </p>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <Badge variant="outline" className="text-sm px-3 py-1 border-emerald-300">
                <Clock className="w-4 h-4 mr-1" />
                Berlaku efektif: 1 Januari 2024
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1 border-emerald-300">
                <ShieldCheck className="w-4 h-4 mr-1" />
                GDPR Ready
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadPDF} 
                className="gap-2 border-emerald-300 hover:bg-emerald-50"
                disabled={isDownloading}
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Data Pribadi</h4>
                    </div>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Nama lengkap</li>
                      <li>• Email aktif</li>
                      <li>• Nomor telepon</li>
                      <li>• Alamat</li>
                      <li>• Tanggal lahir</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">Data Identitas</h4>
                    </div>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• KTP/NIK</li>
                      <li>• Nomor Paspor</li>
                      <li>• Foto identitas</li>
                      <li>• Verifikasi booking</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Data Pembayaran</h4>
                    </div>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Info kartu (encrypted)</li>
                      <li>• Riwayat transaksi</li>
                      <li>• Metode pembayaran</li>
                      <li>• Invoice digital</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold text-orange-800">Data Teknis</h4>
                    </div>
                    <ul className="text-orange-700 text-sm space-y-1">
                      <li>• IP Address</li>
                      <li>• Browser type</li>
                      <li>• Device info</li>
                      <li>• Cookies</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-5 h-5 text-pink-600" />
                      <h4 className="font-semibold text-pink-800">Data Aktivitas</h4>
                    </div>
                    <ul className="text-pink-700 text-sm space-y-1">
                      <li>• Halaman dikunjungi</li>
                      <li>• Paket dilihat</li>
                      <li>• History pencarian</li>
                      <li>• Interaksi konten</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-semibold text-indigo-800">Data Preferensi</h4>
                    </div>
                    <ul className="text-indigo-700 text-sm space-y-1">
                      <li>• Wishlist favorit</li>
                      <li>• Review & rating</li>
                      <li>• Preferensi destinasi</li>
                      <li>• Newsletter settings</li>
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
                    { icon: <UserCheck className="w-5 h-5 text-blue-500" />, method: "Registrasi Akun", data: "Data Pribadi, Email, Password", purpose: "Membuat akun pengguna", color: "blue" },
                    { icon: <Globe className="w-5 h-5 text-green-500" />, method: "Google OAuth", data: "Google Profile Data", purpose: "Quick registration", color: "green" },
                    { icon: <CreditCard className="w-5 h-5 text-purple-500" />, method: "Proses Booking", data: "Data Identitas, Pembayaran", purpose: "Konfirmasi dan processing", color: "purple" },
                    { icon: <BarChart3 className="w-5 h-5 text-orange-500" />, method: "Website Analytics", data: "Data Teknis, Cookies", purpose: "Improve user experience", color: "orange" },
                    { icon: <MessageCircle className="w-5 h-5 text-pink-500" />, method: "Customer Service", data: "Communication logs", purpose: "Support dan troubleshooting", color: "pink" },
                    { icon: <Star className="w-5 h-5 text-indigo-500" />, method: "Survey & Feedback", data: "Opinion dan satisfaction data", purpose: "Service improvement", color: "indigo" },
                  ].map((item, index) => (
                    <div key={index} className={`flex items-start gap-4 p-4 bg-${item.color}-50 rounded-lg border border-${item.color}-200 hover:shadow-md transition-all`}>
                      <div className={`p-2 bg-${item.color}-100 rounded-lg flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-${item.color}-800 mb-1`}>{item.method}</h4>
                        <p className={`text-${item.color}-700 text-sm mb-1`}><strong>Data:</strong> {item.data}</p>
                        <p className={`text-${item.color}-600 text-sm`}><strong>Tujuan:</strong> {item.purpose}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </PrivacySection>

              {/* Tujuan Penggunaan Data */}
              <PrivacySection 
                icon={<Zap className="w-5 h-5" />}
                title="Tujuan Penggunaan Data"
                sectionId="data-purpose"
                searchTerm={searchTerm}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <h4 className="font-semibold mb-3 text-blue-800 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Layanan Utama
                      </h4>
                      <ul className="text-blue-700 text-sm space-y-2">
                        <li>• Proses booking dan konfirmasi perjalanan</li>
                        <li>• Manajemen akun dan profil pengguna</li>
                        <li>• Customer support dan troubleshooting</li>
                        <li>• Payment processing dan invoice</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                      <h4 className="font-semibold mb-3 text-green-800 flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Komunikasi
                      </h4>
                      <ul className="text-green-700 text-sm space-y-2">
                        <li>• Email konfirmasi booking dan e-voucher</li>
                        <li>• Update status perjalanan</li>
                        <li>• Newsletter dan travel tips</li>
                        <li>• Notifikasi penting dan emergency</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <h4 className="font-semibold mb-3 text-purple-800 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Peningkatan Layanan
                      </h4>
                      <ul className="text-purple-700 text-sm space-y-2">
                        <li>• Analytics dan performance monitoring</li>
                        <li>• Personalisasi rekomendasi paket</li>
                        <li>• A/B testing fitur baru</li>
                        <li>• Customer behavior analysis</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                      <h4 className="font-semibold mb-3 text-orange-800 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Keamanan
                      </h4>
                      <ul className="text-orange-700 text-sm space-y-2">
                        <li>• Fraud detection dan prevention</li>
                        <li>• Account security monitoring</li>
                        <li>• Risk assessment</li>
                        <li>• Compliance dengan regulasi</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg border border-pink-200">
                      <h4 className="font-semibold mb-3 text-pink-800 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Marketing (dengan consent)
                      </h4>
                      <ul className="text-pink-700 text-sm space-y-2">
                        <li>• Promosi paket wisata terbaru</li>
                        <li>• Penawaran khusus dan diskon</li>
                        <li>• Remarketing campaigns</li>
                        <li>• Social media advertising</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-yellow-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Consent Required
                      </h4>
                      <p className="text-yellow-700 text-sm">Aktivitas marketing memerlukan persetujuan eksplisit dan dapat ditarik kapan saja melalui pengaturan akun.</p>
                    </div>
                  </div>
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
                      Prinsip Penting
                    </h4>
                    <p className="text-red-700 font-medium">
                      Kami TIDAK PERNAH menjual data pribadi Anda kepada pihak ketiga untuk tujuan komersial.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: <CreditCard className="w-6 h-6" />, title: "Midtrans", desc: "Payment Gateway", data: "Data pembayaran untuk processing transaksi", color: "blue" },
                      { icon: <MapPin className="w-6 h-6" />, title: "Travel Partners", desc: "Hotel, Tour Operator", data: "Data yang diperlukan untuk layanan saja", color: "green" },
                      { icon: <Settings className="w-6 h-6" />, title: "Service Providers", desc: "Email, SMS, Cloud", data: "Dengan kontrak NDA yang ketat", color: "purple" },
                      { icon: <Scale className="w-6 h-6" />, title: "Otoritas Hukum", desc: "Jika Diwajibkan", data: "Sesuai dengan hukum dan regulasi", color: "orange" },
                    ].map((partner, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className={`text-gray-600 mb-3`}>{partner.icon}</div>
                        <h4 className="font-semibold text-gray-800 mb-1">{partner.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{partner.desc}</p>
                        <p className="text-gray-500 text-xs">{partner.data}</p>
                      </div>
                    ))}
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
                        { tech: "Enkripsi SSL/TLS", desc: "Semua transmisi data menggunakan protokol enkripsi standar industri" },
                        { tech: "Password Hashing", desc: "Password disimpan menggunakan algoritma bcrypt dengan salt" },
                        { tech: "Access Control", desc: "Role-based permissions dan principle of least privilege" },
                        { tech: "Security Audit", desc: "Regular vulnerability assessment dan penetration testing" },
                        { tech: "Backup Encryption", desc: "Semua backup data dienkripsi dan disimpan secara terpisah" },
                        { tech: "Multi-Factor Auth", desc: "MFA untuk admin access dan akun sensitive" },
                      ].map((item, index) => (
                        <div key={index} className="p-3 bg-white rounded-lg border border-emerald-200">
                          <h5 className="font-medium text-emerald-800 text-sm mb-1">{item.tech}</h5>
                          <p className="text-emerald-700 text-xs">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-blue-800 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      Prosedur Keamanan
                    </h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Regular security training untuk tim internal</li>
                      <li>• Incident response plan untuk security breaches</li>
                      <li>• Data anonymization untuk analytics purposes</li>
                      <li>• Compliance monitoring dan audit berkala</li>
                    </ul>
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
                        { right: "Hak Akses", desc: "Melihat dan mengunduh semua data pribadi yang tersimpan", icon: <Eye className="w-4 h-4" /> },
                        { right: "Hak Koreksi", desc: "Mengubah atau memperbarui data yang tidak akurat", icon: <Settings className="w-4 h-4" /> },
                        { right: "Hak Penghapusan", desc: "Request penghapusan akun dan semua data terkait", icon: <XCircle className="w-4 h-4" /> },
                        { right: "Hak Portabilitas", desc: "Export data dalam format CSV atau JSON", icon: <Download className="w-4 h-4" /> },
                        { right: "Hak Penarikan Consent", desc: "Berhenti menerima marketing communications", icon: <RefreshCw className="w-4 h-4" /> },
                        { right: "Hak Pembatasan", desc: "Membatasi penggunaan data untuk tujuan tertentu", icon: <Lock className="w-4 h-4" /> },
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

                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-green-800 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Cara Menggunakan Hak Anda
                    </h4>
                    <ul className="text-green-700 text-sm space-y-2">
                      <li>• Login ke akun dan akses "Privacy Settings"</li>
                      <li>• Hubungi privacy@travedia.co.id dengan subject "Data Rights Request"</li>
                      <li>• Kami akan merespon dalam 30 hari sesuai regulasi</li>
                      <li>• Verifikasi identitas diperlukan untuk permintaan sensitive</li>
                    </ul>
                  </div>
                </div>
              </PrivacySection>

              {/* Kebijakan Cookie */}
              <PrivacySection 
                icon={<Cookie className="w-5 h-5" />}
                title="Kebijakan Cookie"
                sectionId="cookies"
                searchTerm={searchTerm}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { type: "Essential Cookies", desc: "Session management, keamanan, fungsi dasar website", icon: <Settings className="w-5 h-5" />, color: "blue", required: true },
                      { type: "Analytics Cookies", desc: "Google Analytics untuk analisis traffic dan behavior", icon: <BarChart3 className="w-5 h-5" />, color: "green", required: false },
                      { type: "Marketing Cookies", desc: "Tracking untuk personalized ads (dengan consent)", icon: <Star className="w-5 h-5" />, color: "purple", required: false },
                      { type: "Third-party Cookies", desc: "Social media integration, payment processing", icon: <Globe className="w-5 h-5" />, color: "orange", required: false },
                    ].map((cookie, index) => (
                      <div key={index} className={`p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all`}>
                        <div className={`text-gray-600 mb-3`}>{cookie.icon}</div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-2">{cookie.type}</h4>
                        <p className="text-gray-600 text-xs mb-2">{cookie.desc}</p>
                        <Badge variant={cookie.required ? "default" : "outline"} className="text-xs">
                          {cookie.required ? "Required" : "Optional"}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-yellow-800 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Pengelolaan Cookies
                    </h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Anda dapat mengatur preferensi cookies di browser settings</li>
                      <li>• Menonaktifkan cookies mungkin mempengaruhi fungsionalitas website</li>
                      <li>• Cookie consent dapat diubah melalui Cookie Preferences di footer</li>
                    </ul>
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
                          <th className="border border-gray-200 p-3 text-left font-semibold text-gray-800">Jenis Data</th>
                          <th className="border border-gray-200 p-3 text-left font-semibold text-gray-800">Periode Retensi</th>
                          <th className="border border-gray-200 p-3 text-left font-semibold text-gray-800">Alasan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { data: "Data Akun Aktif", period: "Selama akun aktif", reason: "Layanan berkelanjutan", color: "blue" },
                          { data: "Data Booking", period: "7 tahun", reason: "Audit dan legal compliance", color: "green" },
                          { data: "Data Marketing", period: "Hingga unsubscribe", reason: "Consent-based marketing", color: "purple" },
                          { data: "Technical Logs", period: "1 tahun", reason: "Security dan troubleshooting", color: "orange" },
                          { data: "Financial Records", period: "10 tahun", reason: "Tax dan accounting requirements", color: "red" },
                        ].map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-200 p-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full bg-gray-400`}></div>
                                <span className="font-medium text-gray-800">{item.data}</span>
                              </div>
                            </td>
                            <td className="border border-gray-200 p-3 text-gray-700">{item.period}</td>
                            <td className="border border-gray-200 p-3 text-gray-600 text-sm">{item.reason}</td>
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
                      Data akan dihapus secara otomatis setelah periode retensi berakhir, kecuali ada kewajiban hukum untuk menyimpan lebih lama.
                    </p>
                  </div>
                </div>
              </PrivacySection>

              {/* Contact Section */}
              <Card className="mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Data Protection Officer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                        <Mail className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold mb-2">Email Privacy</h4>
                      <p className="text-emerald-100">privacy@travedia.co.id</p>
                      <p className="text-emerald-200 text-sm">Response: Max 72 jam</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                        <Phone className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold mb-2">Phone Support</h4>
                      <p className="text-emerald-100">+62 812-3456-7890</p>
                      <p className="text-emerald-200 text-sm">Jam kerja only</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold mb-2">Office Address</h4>
                      <p className="text-emerald-100">Jakarta, Indonesia</p>
                      <p className="text-emerald-200 text-sm">Business hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="summary">
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Ringkasan Kebijakan Privasi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    icon: <Database className="w-6 h-6 text-emerald-600" />, 
                    title: "Data yang Dikumpulkan", 
                    points: ["Data pribadi dan identitas", "Informasi pembayaran terenkripsi", "Data teknis dan aktivitas", "Preferensi dan wishlist"] 
                  },
                  { 
                    icon: <Shield className="w-6 h-6 text-blue-600" />, 
                    title: "Perlindungan Data", 
                    points: ["Enkripsi SSL/TLS", "Password hashing bcrypt", "Access control ketat", "Security audit berkala"] 
                  },
                  { 
                    icon: <UserCheck className="w-6 h-6 text-purple-600" />, 
                    title: "Hak Anda", 
                    points: ["Akses dan download data", "Koreksi informasi", "Hapus akun dan data", "Tarik consent marketing"] 
                  },
                  { 
                    icon: <Share2 className="w-6 h-6 text-orange-600" />, 
                    title: "Pembagian Data", 
                    points: ["Tidak dijual ke pihak lain", "Hanya untuk service providers", "Travel partners terpercaya", "Compliance dengan hukum"] 
                  },
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

          <TabsContent value="faq-privacy">
            <div className="space-y-4">
              {[
                { 
                  q: "Bagaimana cara mengunduh semua data pribadi saya?", 
                  a: "Masuk ke akun Anda, pilih 'Privacy Settings', lalu klik 'Download My Data'. Kami akan mengirim file lengkap dalam format CSV/JSON ke email Anda dalam 24 jam.",
                  icon: <Download className="w-5 h-5 text-blue-500" />
                },
                { 
                  q: "Apakah data pembayaran saya aman?", 
                  a: "Ya, semua data pembayaran dienkripsi menggunakan standar PCI DSS melalui Midtrans. Kami tidak menyimpan nomor kartu kredit lengkap di server kami.",
                  icon: <CreditCard className="w-5 h-5 text-green-500" />
                },
                { 
                  q: "Bisakah saya menghapus akun dan semua data saya?", 
                  a: "Tentu saja. Anda dapat menghapus akun melalui 'Account Settings' atau menghubungi privacy@travedia.co.id. Semua data akan dihapus dalam 30 hari, kecuali yang diwajibkan hukum untuk disimpan.",
                  icon: <XCircle className="w-5 h-5 text-red-500" />
                },
                { 
                  q: "Bagaimana cara berhenti menerima email marketing?", 
                  a: "Klik 'Unsubscribe' di email marketing kami, atau ubah preferensi di 'Notification Settings' di akun Anda. Perubahan akan berlaku dalam 24 jam.",
                  icon: <Mail className="w-5 h-5 text-purple-500" />
                },
                { 
                  q: "Apakah data saya dibagikan untuk iklan?", 
                  a: "Kami TIDAK menjual data pribadi untuk iklan. Data hanya dibagikan dengan travel partners untuk layanan yang Anda pesan, dan dengan consent untuk analytics anonymous.",
                  icon: <Share2 className="w-5 h-5 text-orange-500" />
                },
                { 
                  q: "Berapa lama data saya disimpan?", 
                  a: "Data akun aktif disimpan selama akun aktif. Data booking disimpan 7 tahun untuk compliance. Data marketing dihapus saat unsubscribe. Detail lengkap di tabel retensi data.",
                  icon: <Clock className="w-5 h-5 text-blue-500" />
                },
                { 
                  q: "Bagaimana jika terjadi kebocoran data?", 
                  a: "Kami memiliki incident response plan. Jika terjadi breach, kami akan memberitahu dalam 72 jam dan mengambil langkah mitigasi sesuai protokol keamanan.",
                  icon: <AlertTriangle className="w-5 h-5 text-red-500" />
                },
                { 
                  q: "Apakah website menggunakan cookies?", 
                  a: "Ya, kami menggunakan cookies untuk fungsionalitas essential, analytics, dan marketing (dengan consent). Anda dapat mengatur preferensi cookies di browser atau melalui Cookie Settings kami.",
                  icon: <Cookie className="w-5 h-5 text-yellow-500" />
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
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl mt-8 border">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-emerald-600">Privacy Protected by Design</span>
          </div>
          <p className="mb-2">
            Kebijakan Privasi ini adalah bagian integral dari Terms & Conditions Travedia Terbit Semesta.
            Kami berkomitmen untuk melindungi privasi dan data pribadi Anda sesuai dengan standar internasional.
          </p>
          <p className="mb-4">
            © 2024 Travedia Terbit Semesta. Privacy Protected by Design.
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <span className="text-emerald-600 cursor-pointer hover:underline">Terms of Service</span>
            <span className="text-emerald-600 cursor-pointer hover:underline">Cookie Settings</span>
            <span className="text-emerald-600 cursor-pointer hover:underline">Contact DPO</span>
            <span className="text-emerald-600 cursor-pointer hover:underline">Data Rights</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;