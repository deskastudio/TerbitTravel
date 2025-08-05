import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Users,
  CreditCard,
  Calendar,
  FileText,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Download,
  Star,
  XCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  Globe,
  Smartphone,
  Plane,
  Shield,
  RefreshCw,
  BookOpen,
  Share2,
  TrendingUp,
  Award,
  Heart,
  Zap
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

interface FAQCategoryProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  faqs: FAQItem[];
  searchTerm: string;
}

const FAQCategory: React.FC<FAQCategoryProps> = ({ title, icon, description, faqs, searchTerm }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredFAQs = useMemo(() => {
    if (!searchTerm) return faqs;
    
    const searchLower = searchTerm.toLowerCase();
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchLower) ||
      faq.answer.toLowerCase().includes(searchLower) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }, [faqs, searchTerm]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  if (filteredFAQs.length === 0 && searchTerm) return null;

  return (
    <Card className="mb-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-amber-500">
      <CardHeader className="pb-3 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg text-white shadow-md">
            {icon}
          </div>
          <div>
            <h3>{title}</h3>
            <p className="text-sm font-normal text-gray-600 mt-1">{description}</p>
          </div>
          <Badge variant="outline" className="ml-auto">
            {filteredFAQs.length} FAQ{filteredFAQs.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {filteredFAQs.map((faq) => (
            <Card 
              key={faq.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                expandedItems.has(faq.id) ? 'border-amber-300 bg-amber-50' : 'border-gray-200 hover:border-amber-200'
              }`}
              onClick={() => toggleExpanded(faq.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    faq.priority === 'high' ? 'bg-red-100 text-red-600' :
                    faq.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {faq.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-gray-800 pr-4">{faq.question}</h4>
                      <div className="flex items-center gap-2">
                        {faq.priority === 'high' && <Badge variant="destructive" className="text-xs">Popular</Badge>}
                        {expandedItems.has(faq.id) ? 
                          <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        }
                      </div>
                    </div>
                    
                    {expandedItems.has(faq.id) && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {faq.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDownloading, setIsDownloading] = useState(false);

  const faqData: FAQItem[] = [
    // Akun dan Registrasi
    {
      id: 'reg-1',
      question: 'Bagaimana cara membuat akun di Travedia?',
      answer: 'Klik "Daftar" di pojok kanan atas website, isi form registrasi dengan data yang akurat, atau gunakan Google Sign-In untuk registrasi cepat. Verifikasi email yang dikirim untuk mengaktifkan akun Anda.',
      category: 'account',
      tags: ['registrasi', 'akun', 'google', 'email'],
      icon: <Users className="w-4 h-4" />,
      priority: 'high'
    },
    {
      id: 'reg-2',
      question: 'Apakah registrasi di Travedia berbayar?',
      answer: 'Tidak, registrasi dan pembuatan akun di Travedia sepenuhnya gratis. Anda hanya perlu membayar saat melakukan booking paket wisata.',
      category: 'account',
      tags: ['gratis', 'biaya', 'registrasi'],
      icon: <CheckCircle className="w-4 h-4" />,
      priority: 'high'
    },
    {
      id: 'reg-3',
      question: 'Saya lupa password, bagaimana cara reset?',
      answer: 'Klik "Lupa Password" di halaman login, masukkan email yang terdaftar, dan ikuti instruksi reset yang dikirim ke email Anda. Link reset berlaku 24 jam.',
      category: 'account',
      tags: ['password', 'reset', 'email', 'login'],
      icon: <RefreshCw className="w-4 h-4" />,
      priority: 'medium'
    },
    {
      id: 'reg-4',
      question: 'Bisakah saya mengubah data profil setelah registrasi?',
      answer: 'Ya, masuk ke "Profil Saya" untuk mengubah nama, email, nomor telepon, alamat, dan informasi lainnya. Perubahan data penting mungkin memerlukan verifikasi ulang.',
      category: 'account',
      tags: ['profil', 'edit', 'data', 'verifikasi'],
      icon: <Settings className="w-4 h-4" />,
      priority: 'medium'
    },

    // Pencarian dan Booking
    {
      id: 'book-1',
      question: 'Bagaimana cara mencari paket wisata?',
      answer: 'Gunakan search bar di homepage dengan memasukkan destinasi atau kata kunci. Anda juga bisa browse berdasarkan kategori, harga, durasi, dan rating di halaman "Paket Wisata". Filter tersedia untuk mempermudah pencarian.',
      category: 'booking',
      tags: ['pencarian', 'filter', 'destinasi', 'paket'],
      icon: <Search className="w-4 h-4" />,
      priority: 'high'
    },
    {
      id: 'book-2',
      question: 'Apakah harga yang ditampilkan sudah final?',
      answer: 'Harga yang ditampilkan adalah harga dasar per person. Harga final akan muncul saat checkout termasuk taxes, fees, insurance, dan add-ons yang dipilih. Tidak ada hidden cost.',
      category: 'booking',
      tags: ['harga', 'final', 'taxes', 'fees'],
      icon: <CreditCard className="w-4 h-4" />,
      priority: 'high'
    },
    {
      id: 'book-3',
      question: 'Bisakah saya booking untuk orang lain?',
      answer: 'Ya, Anda bisa booking untuk keluarga atau teman. Pastikan data peserta lengkap dan akurat saat mengisi form booking. Data lead booker dan peserta bisa berbeda.',
      category: 'booking',
      tags: ['booking', 'orang lain', 'keluarga', 'teman'],
      icon: <Users className="w-4 h-4" />,
      priority: 'medium'
    },
    {
      id: 'book-4',
      question: 'Berapa lama proses konfirmasi booking?',
      answer: 'Konfirmasi booking biasanya 1-24 jam setelah pembayaran. Untuk peak season atau paket premium, bisa sampai 48 jam. Anda akan mendapat notifikasi via email dan SMS.',
      category: 'booking',
      tags: ['konfirmasi', 'waktu', 'notifikasi', 'peak season'],
      icon: <Clock className="w-4 h-4" />,
      priority: 'medium'
    },
    {
      id: 'book-5',
      question: 'Apakah saya bisa request custom itinerary?',
      answer: 'Ya, hubungi customer service untuk konsultasi custom trip. Ada minimum charge untuk custom planning. Tim kami akan membantu merancang itinerary sesuai budget dan preferensi Anda.',
      category: 'booking',
      tags: ['custom', 'itinerary', 'konsultasi', 'planning'],
      icon: <MapPin className="w-4 h-4" />,
      priority: 'low'
    },

    // Pembayaran
    {
      id: 'pay-1',
      question: 'Metode pembayaran apa saja yang tersedia?',
      answer: 'Kami menerima kartu kredit/debit (Visa, Mastercard, JCB), bank transfer, e-wallet (OVO, GoPay, DANA), dan virtual account melalui Midtrans. Cicilan 0% tersedia untuk paket tertentu.',
      category: 'payment',
      tags: ['kartu kredit', 'transfer', 'e-wallet', 'cicilan'],
      icon: <CreditCard className="w-4 h-4" />,
      priority: 'high'
    },
    {
      id: 'pay-2',
      question: 'Apakah data pembayaran saya aman?',
      answer: 'Ya, semua transaksi dienkripsi SSL dan diproses melalui Midtrans yang PCI DSS compliant. Kami tidak menyimpan data kartu kredit di server kami untuk keamanan maksimal.',
      category: 'payment',
      tags: ['keamanan', 'SSL', 'PCI DSS', 'midtrans'],
      icon: <Shield className="w-4 h-4" />,
      priority: 'high'
    },
    {
      id: 'pay-3',
      question: 'Bisakah saya bayar dengan installment?',
      answer: 'Ya, untuk paket di atas Rp 5 juta tersedia cicilan 0% dengan kartu kredit tertentu (BCA, Mandiri, BNI, BRI). Tenor 3-24 bulan tergantung bank dan nominal.',
      category: 'payment',
      tags: ['cicilan', 'installment', 'kartu kredit', 'tenor'],
      icon: <Calendar className="w-4 h-4" />,
      priority: 'medium'
    },
    {
      id: 'pay-4',
      question: 'Kapan saya harus melunasi pembayaran?',
      answer: 'Full payment harus dilakukan maksimal 3 hari setelah booking untuk mengunci harga dan ketersediaan. Untuk paket premium, pembayaran bisa diperpanjang hingga 7 hari.',
      category: 'payment',
      tags: ['pelunasan', 'deadline', 'harga', 'ketersediaan'],
      icon: <Clock className="w-4 h-4" />,
      priority: 'medium'
    },

    // E-Voucher dan Travel Documents
    {
      id: 'doc-1',
      question: 'Kapan saya akan menerima e-voucher?',
      answer: 'E-voucher dikirim ke email maksimal 2 jam setelah pembayaran berhasil diverifikasi. Jika tidak diterima, cek folder spam atau hubungi customer service.',
      category: 'documents',
      tags: ['e-voucher', 'email', 'waktu', 'spam'],
      icon: <FileText className="w-4 h-4" />,
      priority: 'high'
    },
    {
      id: 'doc-2',
      question: 'Apa saja yang ada di dalam e-voucher?',
      answer: 'E-voucher berisi detail paket, itinerary lengkap, kontak emergency, voucher number, QR code, instruksi khusus, contact person, dan emergency hotline 24/7.',
      category: 'documents',
      tags: ['isi', 'detail', 'itinerary', 'QR code', 'emergency'],
      icon: <FileText className="w-4 h-4" />,
      priority: 'medium'
    },
    {
      id: 'doc-3',
      question: 'Bagaimana jika e-voucher tidak diterima?',
      answer: 'Cek folder spam/junk mail terlebih dahulu. Jika masih belum ada, hubungi customer service dengan menyertakan booking ID untuk resend e-voucher ke email Anda.',
      category: 'documents',
      tags: ['tidak diterima', 'spam', 'resend', 'booking ID'],
      icon: <AlertTriangle className="w-4 h-4" />,
      priority: 'medium'
    },
    {
      id: 'doc-4',
      question: 'Apakah saya perlu print e-voucher?',
      answer: 'Tidak wajib, tapi disarankan sebagai backup. QR code di smartphone sudah cukup dan diterima oleh semua partner kami. Pastikan battery smartphone tidak habis saat traveling.',
      category: 'documents',
      tags: ['print', 'backup', 'QR code', 'smartphone'],
      icon: <Smartphone className="w-4 h-4" />,
      priority: 'low'
    },

    // Pembatalan dan Perubahan
    {
      id: 'cancel-1',
      question: 'Bagaimana cara membatalkan booking?',
      answer: 'Login ke akun, masuk ke "Riwayat Booking", pilih booking yang akan dibatalkan, klik "Batalkan" dan ikuti prosedur. Upload dokumen pendukung jika diperlukan.',
      category: 'cancellation',
      tags: ['pembatalan', 'riwayat', 'prosedur', 'dokumen'],
      icon: <XCircle className="w-4 h-4" />,
      priority: 'high'
    },
    {
      id: 'cancel-2',
      question: 'Berapa lama proses refund?',
      answer: 'Refund diproses 7-14 hari kerja setelah pembatalan disetujui, tergantung bank/payment method. Untuk kartu kredit bisa 1-2 billing cycle. Kami akan kirim update status refund.',
      category: 'cancellation',
      tags: ['refund', 'proses', 'bank', 'billing cycle'],
      icon: <Clock className="w-4 h-4" />,
      priority: 'high'
    },
    {
      id: 'cancel-3',
      question: 'Bisakah saya mengubah tanggal perjalanan?',
      answer: 'Ya, subject to availability dan mungkin ada fee perubahan. Hubungi customer service minimal 14 hari sebelum keberangkatan untuk assistance dan pengecekan ketersediaan.',
      category: 'cancellation',
      tags: ['ubah tanggal', 'fee', 'availability', 'keberangkatan'],
      icon: <Calendar className="w-4 h-4" />,
      priority: 'medium'
    },
    {
      id: 'cancel-4',
      question: 'Bagaimana jika paket dibatalkan oleh provider?',
      answer: 'Anda akan mendapat full refund 100% atau opsi reschedule dengan kompensasi sesuai kebijakan. Kami akan mencarikan alternatif paket serupa dengan harga yang sama.',
      category: 'cancellation',
      tags: ['dibatalkan provider', 'full refund', 'reschedule', 'kompensasi'],
      icon: <RefreshCw className="w-4 h-4" />,
      priority: 'medium'
    },

    // Selama Perjalanan
    {
      id: 'travel-1',
      question: 'Apa yang harus saya lakukan jika ada masalah selama trip?',
      answer: 'Hubungi nomor emergency yang tertera di e-voucher atau customer service 24/7 di +62 812-3456-7890. Tim kami siap membantu menyelesaikan masalah di lapangan.',
      category: 'travel',
      tags: ['masalah', 'emergency', 'customer service', '24/7'],
      icon: <Phone className="w-4 h-4" />,
      priority: 'high'
    },
    {
      id: 'travel-2',
      question: 'Bagaimana jika cuaca buruk mempengaruhi itinerary?',
      answer: 'Tour guide akan adjust itinerary untuk keselamatan peserta. Tidak ada refund untuk weather-related changes, tapi kami akan carikan aktivitas alternatif yang menarik.',
      category: 'travel',
      tags: ['cuaca', 'itinerary', 'keselamatan', 'alternatif'],
      icon: <AlertTriangle className="w-4 h-4" />,
      priority: 'medium'
    },
    {
      id: 'travel-3',
      question: 'Apakah travel insurance diperlukan?',
      answer: 'Sangat disarankan, terutama untuk international trips atau adventure activities. Kami bekerjasama dengan penyedia asuransi terpercaya dengan coverage komprehensif.',
      category: 'travel',
      tags: ['asuransi', 'international', 'adventure', 'coverage'],
      icon: <Shield className="w-4 h-4" />,
      priority: 'low'
    },

    // Teknis Website
    {
      id: 'tech-1',
      question: 'Website tidak bisa diakses, bagaimana?',
      answer: 'Coba refresh browser, clear cache dan cookies, atau gunakan browser berbeda. Pastikan koneksi internet stabil. Jika masih bermasalah, hubungi support IT kami.',
      category: 'technical',
      tags: ['website', 'refresh', 'cache', 'browser', 'koneksi'],
      icon: <Globe className="w-4 h-4" />,
      priority: 'medium'
    },
    {
      id: 'tech-2',
      question: 'Bagaimana cara menggunakan fitur wishlist?',
      answer: 'Klik icon love (♥) pada paket yang diinginkan. Wishlist bisa diakses di "Profil Saya" → "Wishlist". Anda akan mendapat notifikasi jika ada promo untuk paket favorit.',
      category: 'technical',
      tags: ['wishlist', 'love', 'favorit', 'notifikasi', 'promo'],
      icon: <Heart className="w-4 h-4" />,
      priority: 'low'
    },
    {
      id: 'tech-3',
      question: 'Bisakah saya share paket ke social media?',
      answer: 'Ya, klik icon share pada halaman detail paket untuk share ke Facebook, Instagram, WhatsApp, Twitter, atau copy link. Ajak teman traveling bareng untuk diskon grup!',
      category: 'technical',
      tags: ['share', 'social media', 'facebook', 'instagram', 'whatsapp'],
      icon: <Share2 className="w-4 h-4" />,
      priority: 'low'
    },

    // Customer Service
    {
      id: 'cs-1',
      question: 'Bagaimana cara menghubungi customer service?',
      answer: 'Email: support@travedia.co.id, WhatsApp: +62 812-3456-7890, Live chat di website (jam kerja), atau form kontak. Tim kami responsif dan profesional.',
      category: 'support',
      tags: ['email', 'whatsapp', 'live chat', 'kontak'],
      icon: <MessageCircle className="w-4 h-4" />,
      priority: 'high'
    },
    {
      id: 'cs-2',
      question: 'Jam operasional customer service?',
      answer: 'Live chat: 08:00-22:00 WIB setiap hari. Email & WhatsApp: 24/7 dengan response time maksimal 4 jam. Emergency hotline tersedia 24/7 untuk customer yang sedang traveling.',
      category: 'support',
      tags: ['jam operasional', 'live chat', '24/7', 'response time'],
      icon: <Clock className="w-4 h-4" />,
      priority: 'medium'
    },
    {
      id: 'cs-3',
      question: 'Bahasa apa saja yang didukung?',
      answer: 'Bahasa Indonesia dan English untuk customer service dan website interface. Tim kami juga bisa assist dengan bahasa daerah untuk destinasi tertentu.',
      category: 'support',
      tags: ['bahasa', 'indonesia', 'english', 'daerah'],
      icon: <Globe className="w-4 h-4" />,
      priority: 'low'
    }
  ];

  const categories = [
    { id: 'all', name: 'Semua FAQ', icon: <HelpCircle className="w-4 h-4" />, count: faqData.length },
    { id: 'account', name: 'Akun & Registrasi', icon: <Users className="w-4 h-4" />, count: faqData.filter(f => f.category === 'account').length },
    { id: 'booking', name: 'Pencarian & Booking', icon: <Search className="w-4 h-4" />, count: faqData.filter(f => f.category === 'booking').length },
    { id: 'payment', name: 'Pembayaran', icon: <CreditCard className="w-4 h-4" />, count: faqData.filter(f => f.category === 'payment').length },
    { id: 'documents', name: 'E-Voucher & Dokumen', icon: <FileText className="w-4 h-4" />, count: faqData.filter(f => f.category === 'documents').length },
    { id: 'cancellation', name: 'Pembatalan & Refund', icon: <XCircle className="w-4 h-4" />, count: faqData.filter(f => f.category === 'cancellation').length },
    { id: 'travel', name: 'Selama Perjalanan', icon: <Plane className="w-4 h-4" />, count: faqData.filter(f => f.category === 'travel').length },
    { id: 'technical', name: 'Teknis Website', icon: <Settings className="w-4 h-4" />, count: faqData.filter(f => f.category === 'technical').length },
    { id: 'support', name: 'Customer Service', icon: <MessageCircle className="w-4 h-4" />, count: faqData.filter(f => f.category === 'support').length },
  ];

  const filteredFAQs = useMemo(() => {
    let filtered = faqData;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return filtered;
  }, [selectedCategory, searchTerm]);

  const groupedFAQs = useMemo(() => {
    const groups: { [key: string]: FAQItem[] } = {};
    
    filteredFAQs.forEach(faq => {
      if (!groups[faq.category]) {
        groups[faq.category] = [];
      }
      groups[faq.category].push(faq);
    });
    
    return groups;
  }, [filteredFAQs]);

  const downloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>FAQ - Travedia Terbit Semesta</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        h1 { color: #d97706; border-bottom: 3px solid #d97706; padding-bottom: 10px; }
        h2 { color: #b45309; margin-top: 30px; page-break-before: auto; }
        h3 { color: #92400e; }
        .section { margin-bottom: 30px; }
        .highlight { background-color: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin: 10px 0; }
        .faq-item { margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .question { font-weight: bold; color: #1f2937; margin-bottom: 8px; }
        .answer { color: #4b5563; margin-bottom: 8px; }
        .tags { font-size: 0.8em; color: #6b7280; }
        .category-header { background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .stats { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .contact-info { background-color: #fef3c7; padding: 20px; border-radius: 8px; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; }
        .priority-high { border-left: 4px solid #dc2626; }
        .priority-medium { border-left: 4px solid #d97706; }
        .priority-low { border-left: 4px solid #059669; }
    </style>
</head>
<body>
    <h1>FREQUENTLY ASKED QUESTIONS (FAQ)</h1>
    <h2>Travedia Terbit Semesta</h2>
    
    <div class="highlight">
        <strong>Total FAQ:</strong> ${faqData.length} pertanyaan<br>
        <strong>Kategori:</strong> ${categories.length - 1} kategori<br>
        <strong>Update Terakhir:</strong> ${new Date().toLocaleDateString('id-ID')}<br>
        <strong>Customer Service:</strong> support@travedia.co.id | +62 812-3456-7890
    </div>

    <div class="stats">
        <h3>Statistik FAQ</h3>
        <ul>
            ${categories.filter(c => c.id !== 'all').map(cat => 
              `<li><strong>${cat.name}:</strong> ${cat.count} FAQ</li>`
            ).join('')}
        </ul>
    </div>

    ${categories.filter(c => c.id !== 'all').map(category => {
      const categoryFAQs = faqData.filter(faq => faq.category === category.id);
      if (categoryFAQs.length === 0) return '';
      
      return `
    <div class="section">
        <div class="category-header">
            <h2>${category.name}</h2>
            <p>${categoryFAQs.length} pertanyaan dalam kategori ini</p>
        </div>
        
        ${categoryFAQs.map(faq => `
        <div class="faq-item priority-${faq.priority}">
            <div class="question">Q: ${faq.question}</div>
            <div class="answer">A: ${faq.answer}</div>
            <div class="tags">Tags: ${faq.tags.join(', ')}</div>
        </div>
        `).join('')}
    </div>`;
    }).join('')}

    <div class="contact-info">
        <h2>BUTUH BANTUAN LEBIH LANJUT?</h2>
        <p><strong>Customer Service 24/7:</strong></p>
        <ul>
            <li><strong>Email:</strong> support@travedia.co.id (Response: 2-4 jam)</li>
            <li><strong>WhatsApp:</strong> +62 812-3456-7890 (24/7 Available)</li>
            <li><strong>Live Chat:</strong> Website Support (08:00 - 22:00 WIB)</li>
            <li><strong>Emergency Hotline:</strong> +62 812-3456-7890 (Untuk customer yang sedang traveling)</li>
        </ul>
        
        <p><strong>Kantor Pusat:</strong><br>
        Jl. Raya Travedia No. 123, Jakarta 12345<br>
        Jam Operasional: Senin - Jumat 09:00 - 18:00 WIB</p>
    </div>

    <div class="footer">
        <p>FAQ ini dirancang untuk menjawab pertanyaan umum customer Travedia Terbit Semesta.</p>
        <p>Jika pertanyaan Anda tidak terjawab, jangan ragu untuk menghubungi customer service kami.</p>
        <p><strong>© 2024 Travedia Terbit Semesta. Dedicated to Your Travel Experience.</strong></p>
    </div>
</body>
</html>`;

      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'FAQ-Travedia-Terbit-Semesta.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setTimeout(() => {
        alert('✅ FAQ berhasil didownload! File HTML dapat dibuka di browser atau dikonversi ke PDF.');
      }, 500);
      
    } catch (error) {
      alert('❌ Terjadi kesalahan saat download. Silakan coba lagi.');
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const popularFAQs = faqData.filter(faq => faq.priority === 'high').slice(0, 6);
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Hero Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-5 rounded-3xl"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl text-white shadow-lg">
                <HelpCircle className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Temukan jawaban untuk pertanyaan umum seputar booking, pembayaran, dan layanan Travedia. 
              Tim customer service kami siap membantu 24/7 jika Anda butuh bantuan lebih lanjut.
            </p>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <Badge variant="outline" className="text-sm px-3 py-1 border-amber-300">
                <HelpCircle className="w-4 h-4 mr-1" />
                {faqData.length} FAQ Total
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1 border-amber-300">
                <TrendingUp className="w-4 h-4 mr-1" />
                {categories.length - 1} Kategori
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadPDF} 
                className="gap-2 border-amber-300 hover:bg-amber-50"
                disabled={isDownloading}
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download FAQ'}
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari dalam FAQ..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
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

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`gap-2 ${selectedCategory === category.id ? 
                  'bg-amber-500 hover:bg-amber-600' : 
                  'border-amber-300 hover:bg-amber-50'}`}
              >
                {category.icon}
                {category.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Search Results Info */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="text-center">
              <Badge variant="secondary" className="px-3 py-1">
                {filteredFAQs.length} hasil ditemukan
                {searchTerm && ` untuk "${searchTerm}"`}
                {selectedCategory !== 'all' && ` dalam ${categories.find(c => c.id === selectedCategory)?.name}`}
              </Badge>
            </div>
          )}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all-faqs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all-faqs" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Semua FAQ
            </TabsTrigger>
            <TabsTrigger value="popular" className="gap-2">
              <Star className="w-4 h-4" />
              FAQ Populer
            </TabsTrigger>
            <TabsTrigger value="quick-help" className="gap-2">
              <Zap className="w-4 h-4" />
              Bantuan Cepat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-faqs">
            <ScrollArea className="h-auto">
              {Object.keys(groupedFAQs).length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Search className="w-12 h-12 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-600">Tidak ada FAQ yang ditemukan</h3>
                    <p className="text-gray-500">Coba gunakan kata kunci yang berbeda atau pilih kategori lain</p>
                    <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} variant="outline">
                      Reset Filter
                    </Button>
                  </div>
                </Card>
              ) : (
                Object.entries(groupedFAQs).map(([categoryId, faqs]) => {
                  const category = categories.find(c => c.id === categoryId);
                  if (!category) return null;
                  
                  return (
                    <FAQCategory
                      key={categoryId}
                      title={category.name}
                      icon={category.icon}
                      description={`${faqs.length} pertanyaan dalam kategori ini`}
                      faqs={faqs}
                      searchTerm={searchTerm}
                    />
                  );
                })
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="popular">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6 text-center flex items-center justify-center gap-2">
                <Star className="w-6 h-6 text-amber-500" />
                FAQ Paling Populer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularFAQs.map((faq) => (
                  <Card key={faq.id} className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg text-amber-600 flex-shrink-0">
                        {faq.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.id === faq.category)?.name}
                          </Badge>
                          <Badge variant="destructive" className="text-xs">
                            Popular
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="quick-help">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Cari Paket Wisata</h4>
                  <p className="text-gray-600 text-sm mb-4">Gunakan search bar untuk menemukan destinasi impian Anda</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Mulai Pencarian
                  </Button>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Live Chat Support</h4>
                  <p className="text-gray-600 text-sm mb-4">Chat langsung dengan customer service (08:00-22:00 WIB)</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Mulai Chat
                  </Button>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">WhatsApp 24/7</h4>
                  <p className="text-gray-600 text-sm mb-4">Hubungi kami kapan saja melalui WhatsApp</p>
                  <Button variant="outline" size="sm" className="w-full">
                    +62 812-3456-7890
                  </Button>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Cek Status Booking</h4>
                  <p className="text-gray-600 text-sm mb-4">Login untuk melihat status dan detail booking Anda</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Login Akun
                  </Button>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Emergency Hotline</h4>
                  <p className="text-gray-600 text-sm mb-4">Untuk customer yang sedang traveling dan butuh bantuan darurat</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Emergency Call
                  </Button>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="p-3 bg-indigo-100 rounded-full w-fit mx-auto mb-4">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Email Support</h4>
                  <p className="text-gray-600 text-sm mb-4">Kirim pertanyaan detail via email (response 2-4 jam)</p>
                  <Button variant="outline" size="sm" className="w-full">
                    support@travedia.co.id
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Section */}
        <Card className="mt-12 bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xl">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Masih Ada Pertanyaan?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">Live Chat</h4>
                <p className="text-amber-100">Chat langsung di website</p>
                <p className="text-amber-200 text-sm">08:00 - 22:00 WIB</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                  <Phone className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">WhatsApp 24/7</h4>
                <p className="text-amber-100">+62 812-3456-7890</p>
                <p className="text-amber-200 text-sm">Response cepat & akurat</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-3">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">Email Support</h4>
                <p className="text-amber-100">support@travedia.co.id</p>
                <p className="text-amber-200 text-sm">Response: 2-4 jam</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl mt-8 border">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Award className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-600">Dedicated to Your Travel Experience</span>
          </div>
          <p className="mb-2">
            FAQ ini dirancang untuk menjawab pertanyaan umum customer Travedia Terbit Semesta.
            Jika pertanyaan Anda tidak terjawab, jangan ragu untuk menghubungi customer service kami.
          </p>
          <p className="mb-4">
            © 2024 Travedia Terbit Semesta. Committed to Excellence in Travel Services.
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <span className="text-amber-600 cursor-pointer hover:underline">Terms of Service</span>
            <span className="text-amber-600 cursor-pointer hover:underline">Privacy Policy</span>
            <span className="text-amber-600 cursor-pointer hover:underline">Contact Us</span>
            <span className="text-amber-600 cursor-pointer hover:underline">Help Center</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;