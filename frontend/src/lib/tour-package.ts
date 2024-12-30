import { TourPackage } from "@/types/tour-package";

export const tourPackages: TourPackage[] = [
  {
    id: "1",
    name: "Liburan ke Bali",
    destination: "Bali, Indonesia",
    duration: "7 hari",
    price: 20135000,
    description: "Nikmati keindahan Bali dengan paket tur selama 7 hari.",
    availability: "Tersedia",
    category: "Populer",
    image: "/src/assets/destinations/bali.jpg",
    continent: "Asia",
    type: ["Wisata Kota", "Budaya"],
    itinerary: [
      "Hari 1: Kedatangan dan check-in hotel",
      "Hari 2: Pantai Kuta dan Pura Tanah Lot",
      "Hari 3: Ubud dan Tirta Empul",
      "Hari 4: Gunung Batur dan Pura Besakih",
      "Hari 5: Pantai Jimbaran dan Pura Uluwatu",
      "Hari 6: Hari bebas untuk belanja dan eksplorasi",
      "Hari 7: Kepulangan"
    ],
    included: [
      "Akomodasi di hotel bintang 4",
      "Sarapan setiap hari",
      "Tur dengan pemandu",
      "Transportasi antar kota",
      "Tiket masuk ke atraksi utama"
    ],
    notIncluded: [
      "Penerbangan internasional",
      "Pengeluaran pribadi",
      "Asuransi perjalanan",
      "Makanan yang tidak disebutkan",
      "Kegiatan opsional"
    ]
  },
  {
    id: "2",
    name: "Petualangan Jakarta",
    destination: "Jakarta, Indonesia",
    duration: "10 hari",
    price: 38734500,
    description: "Rasakan budaya Indonesia dengan petualangan 10 hari di Jakarta.",
    availability: "Terbatas",
    category: "Promo",
    image: "/src/assets/destinations/jakarta.jpg",
    continent: "Asia",
    type: ["Wisata Kota", "Teknologi"],
    itinerary: [
      "Hari 1: Kedatangan di Jakarta",
      "Hari 2: Taman Mini Indonesia Indah",
      "Hari 3: Monas dan Kota Tua Jakarta",
      "Hari 4: Museum Nasional dan Istana Merdeka",
      "Hari 5: Petualangan kuliner di Pasar Santa",
      "Hari 6-7: Eksplorasi Bogor dan Bandung",
      "Hari 8: Jakarta Kota Lama",
      "Hari 9: Hari bebas",
      "Hari 10: Kepulangan"
    ],
    included: [
      "Akomodasi",
      "Tiket transportasi antar kota",
      "Beberapa makan",
      "Tur pemandu",
      "Tiket masuk atraksi"
    ],
    notIncluded: [
      "Penerbangan internasional",
      "Pengeluaran pribadi",
      "Asuransi perjalanan"
    ]
  },
  {
    id: "3",
    name: "Jelajah Yogyakarta",
    destination: "Yogyakarta, Indonesia",
    duration: "5 hari",
    price: 15484500,
    description: "Jelajahi Yogyakarta dengan tur penuh petualangan selama 5 hari.",
    availability: "Tersedia",
    category: "Flash Sale",
    image: "/src/assets/destinations/yogyakarta.jpg",
    continent: "Asia",
    type: ["Wisata Kota", "Budaya"],
    itinerary: [
      "Hari 1: Kedatangan dan orientasi kota",
      "Hari 2: Candi Borobudur dan Prambanan",
      "Hari 3: Keraton Yogyakarta dan Taman Sari",
      "Hari 4: Pantai Parangtritis dan Goa Jomblang",
      "Hari 5: Kepulangan"
    ],
    included: [
      "Tur kota",
      "Tiket masuk ke beberapa atraksi",
      "Transportasi selama tur"
    ],
    notIncluded: [
      "Makanan",
      "Pengeluaran pribadi"
    ]
  },
  {
    id: "4",
    name: "Petualangan Ke Raja Ampat",
    destination: "Raja Ampat, Indonesia",
    duration: "6 hari",
    price: 18584500,
    description: "Eksplorasi keindahan alam bawah laut Raja Ampat dengan paket petualangan selama 6 hari.",
    availability: "Habis",
    category: "Populer",
    image: "/src/assets/destinations/rajaampat.jpg",
    continent: "Asia",
    type: ["Alam", "Petualangan"],
    itinerary: [
      "Hari 1: Kedatangan dan check-in hotel",
      "Hari 2: Snorkeling di Pulau Wayag",
      "Hari 3: Menyelam di Pulau Kri",
      "Hari 4: Mengunjungi Desa Arborek dan Pulau Gam",
      "Hari 5: Waktu bebas untuk relaksasi",
      "Hari 6: Kepulangan"
    ],
    included: [
      "Tur snorkeling",
      "Akomodasi",
      "Beberapa makan",
      "Transportasi lokal"
    ],
    notIncluded: [
      "Pengeluaran pribadi",
      "Asuransi perjalanan"
    ]
  },
  {
    id: "5",
    name: "Liburan ke Lombok",
    destination: "Lombok, Indonesia",
    duration: "8 hari",
    price: 24784500,
    description: "Nikmati keindahan pantai dan budaya Lombok dalam paket tur 8 hari.",
    availability: "Tersedia",
    category: "Promo",
    image: "/src/assets/destinations/lombok.jpg",
    continent: "Asia",
    type: ["Pantai", "Relaksasi"],
    itinerary: [
      "Hari 1: Kedatangan di Lombok",
      "Hari 2-3: Relaksasi di Pantai Senggigi",
      "Hari 4: Tur Budaya di Desa Sade",
      "Hari 5: Gili Trawangan",
      "Hari 6: Eksplorasi Air Terjun Tiu Kelep",
      "Hari 7: Hari bebas",
      "Hari 8: Kepulangan"
    ],
    included: [
      "Akomodasi di resort pantai",
      "Beberapa makan",
      "Tur budaya"
    ],
    notIncluded: [
      "Pengeluaran pribadi",
      "Penerbangan internasional"
    ]
  },
  {
    id: "6",
    name: "Eksplorasi Taman Nasional Komodo",
    destination: "Flores, Indonesia",
    duration: "7 hari",
    price: 35634500,
    description: "Jelajahi Taman Nasional Komodo dan saksikan komodo liar dalam tur petualangan selama 7 hari.",
    availability: "Tersedia",
    category: "Populer",
    image: "/src/assets/destinations/komodo.jpg",
    continent: "Asia",
    type: ["Alam", "Petualangan"],
    itinerary: [
      "Hari 1: Kedatangan di Labuan Bajo",
      "Hari 2-3: Wisata Komodo dan Pulau Padar",
      "Hari 4: Pulau Rinca dan Pantai Pink",
      "Hari 5: Snorkeling di Pulau Kanawa",
      "Hari 6: Waktu bebas",
      "Hari 7: Kepulangan"
    ],
    included: [
      "Tur wisata alam",
      "Akomodasi",
      "Beberapa makan"
    ],
    notIncluded: [
      "Pengeluaran pribadi",
      "Asuransi perjalanan"
    ]
  },
  {
    id: "7",
    name: "Safari Alam Borneo",
    destination: "Borneo, Indonesia",
    duration: "9 hari",
    price: 54234500,
    description: "Nikmati safari dan saksikan satwa liar di Borneo dengan tur safari selama 9 hari.",
    availability: "Terbatas",
    category: "Populer",
    image: "/src/assets/destinations/borneo.jpg",
    continent: "Asia",
    type: ["Alam", "Safari"],
    itinerary: [
      "Hari 1: Kedatangan dan orientasi",
      "Hari 2-6: Safari di Taman Nasional Tanjung Puting",
      "Hari 7: Mengunjungi Desa Dayak",
      "Hari 8: Wisata Ngurah Rai",
      "Hari 9: Kepulangan"
    ],
    included: [
      "Safari",
      "Akomodasi",
      "Makanan",
      "Tiket masuk taman nasional"
    ],
    notIncluded: [
      "Pengeluaran pribadi",
      "Visa"
    ]
  },
  {
    id: "8",
    name: "Pesona Danau Toba",
    destination: "Sumatera Utara, Indonesia",
    duration: "6 hari",
    price: 22345000,
    description: "Jelajahi keindahan Danau Toba dan budaya Batak yang kaya.",
    availability: "Tersedia",
    category: "Populer",
    image: "/src/assets/destinations/tobaid.jpg",
    continent: "Asia",
    type: ["Alam", "Budaya"],
    itinerary: [
      "Hari 1: Kedatangan di Medan",
      "Hari 2: Perjalanan ke Parapat",
      "Hari 3: Eksplorasi Pulau Samosir",
      "Hari 4: Desa Tradisional Tomok",
      "Hari 5: Air Terjun Sipiso-piso",
      "Hari 6: Kepulangan"
    ],
    included: [
      "Akomodasi hotel",
      "Transportasi darat",
      "Pemandu wisata",
      "Tiket masuk objek wisata"
    ],
    notIncluded: [
      "Tiket pesawat",
      "Pengeluaran pribadi"
    ]
  },
  {
    id: "9",
    name: "Keajaiban Bromo",
    destination: "Jawa Timur, Indonesia",
    duration: "4 hari",
    price: 12500000,
    description: "Saksikan matahari terbit yang menakjubkan di Gunung Bromo.",
    availability: "Terbatas",
    category: "Promo",
    image: "/src/assets/destinations/bromo.jpg",
    continent: "Asia",
    type: ["Alam", "Petualangan"],
    itinerary: [
      "Hari 1: Kedatangan di Surabaya",
      "Hari 2: Sunrise Bromo dan Kawah Bromo",
      "Hari 3: Air Terjun Madakaripura",
      "Hari 4: Kepulangan"
    ],
    included: [
      "Hotel bintang 3",
      "Jeep 4x4",
      "Pemandu lokal",
      "Sarapan"
    ],
    notIncluded: [
      "Tiket pesawat",
      "Makan siang dan malam"
    ]
  },
  {
    id: "10",
    name: "Ekspedisi Wakatobi",
    destination: "Sulawesi Tenggara, Indonesia",
    duration: "7 hari",
    price: 28750000,
    description: "Jelajahi surga bawah laut di Taman Nasional Wakatobi.",
    availability: "Tersedia",
    category: "Populer",
    image: "/src/assets/destinations/wakatobi.jpg",
    continent: "Asia",
    type: ["Pantai", "Menyelam"],
    itinerary: [
      "Hari 1: Kedatangan di Wakatobi",
      "Hari 2-3: Diving di Pulau Wangi-wangi",
      "Hari 4: Snorkeling di Pulau Hoga",
      "Hari 5: Eksplorasi Pulau Kaledupa",
      "Hari 6: Wisata Mangrove",
      "Hari 7: Kepulangan"
    ],
    included: [
      "Resort diving",
      "Peralatan diving",
      "Makan 3 kali sehari",
      "Transportasi antar pulau"
    ],
    notIncluded: [
      "Tiket pesawat",
      "Sertifikasi diving"
    ]
  },
  {
    id: "11",
    name: "Wisata Budaya Toraja",
    destination: "Sulawesi Selatan, Indonesia",
    duration: "5 hari",
    price: 15980000,
    description: "Eksplorasi budaya unik Toraja dan ritual tradisionalnya.",
    availability: "Tersedia",
    category: "Budaya",
    image: "/src/assets/destinations/toraja.jpg",
    continent: "Asia",
    type: ["Budaya", "Sejarah"],
    itinerary: [
      "Hari 1: Kedatangan di Makassar",
      "Hari 2: Perjalanan ke Toraja",
      "Hari 3: Kete Kesu dan Londa",
      "Hari 4: Desa Tradisional dan Upacara Adat",
      "Hari 5: Kembali ke Makassar"
    ],
    included: [
      "Hotel bintang 3",
      "Transportasi AC",
      "Pemandu lokal",
      "Tiket masuk objek wisata"
    ],
    notIncluded: [
      "Tiket pesawat",
      "Pengeluaran pribadi",
      "Tips pemandu"
    ]
  },
  {
    id: "12",
    name: "Petualangan Belitung",
    destination: "Belitung, Indonesia",
    duration: "5 hari",
    price: 13750000,
    description: "Jelajahi keindahan pantai Belitung yang eksotis.",
    availability: "Tersedia",
    category: "Promo",
    image: "/src/assets/destinations/belitung.jpg",
    continent: "Asia",
    type: ["Pantai", "Relaksasi"],
    itinerary: [
      "Hari 1: Kedatangan di Belitung",
      "Hari 2: Pulau Lengkuas dan Batu Berlayar",
      "Hari 3: Pantai Tanjung Kelayang",
      "Hari 4: Pantai Tanjung Tinggi",
      "Hari 5: Kepulangan"
    ],
    included: [
      "Hotel bintang 3",
      "Transportasi",
      "Boat trip",
      "Makan 3 kali sehari"
    ],
    notIncluded: [
      "Tiket pesawat",
      "Pengeluaran pribadi"
    ]
  },
  {
    id: "13",
    name: "Wisata Sejarah Maluku",
    destination: "Maluku, Indonesia",
    duration: "6 hari",
    price: 19850000,
    description: "Telusuri sejarah rempah dan benteng peninggalan kolonial di Maluku.",
    availability: "Terbatas",
    category: "Sejarah",
    image: "/src/assets/destinations/maluku.jpg",
    continent: "Asia",
    type: ["Sejarah", "Budaya"],
    itinerary: [
      "Hari 1: Kedatangan di Ambon",
      "Hari 2: Benteng Victoria dan Museum Siwalima",
      "Hari 3: Pulau Saparua",
      "Hari 4: Benteng Duurstede",
      "Hari 5: Pantai Natsepa",
      "Hari 6: Kepulangan"
    ],
    included: [
      "Hotel",
      "Transportasi darat",
      "Ferry antar pulau",
      "Pemandu wisata"
    ],
    notIncluded: [
      "Tiket pesawat",
      "Pengeluaran pribadi",
      "Asuransi perjalanan"
    ]
  },
  {
    id: "14",
    name: "Eksplorasi Derawan",
    destination: "Kalimantan Timur, Indonesia",
    duration: "7 hari",
    price: 24500000,
    description: "Nikmati keindahan bawah laut di Kepulauan Derawan.",
    availability: "Tersedia",
    category: "Petualangan",
    image: "/src/assets/destinations/derawan.jpg",
    continent: "Asia",
    type: ["Pantai", "Menyelam"],
    itinerary: [
      "Hari 1: Kedatangan di Berau",
      "Hari 2: Danau Ubur-ubur Kakaban",
      "Hari 3: Diving di Maratua",
      "Hari 4: Snorkeling dengan Manta",
      "Hari 5: Pulau Sangalaki",
      "Hari 6: Pantai Derawan",
      "Hari 7: Kepulangan"
    ],
    included: [
      "Penginapan",
      "Peralatan snorkeling",
      "Boat trip",
      "Makan 3 kali sehari"
    ],
    notIncluded: [
      "Tiket pesawat",
      "Peralatan diving",
      "Asuransi perjalanan"
    ]
  },
  {
    id: "15",
    name: "Pesona Dieng",
    destination: "Jawa Tengah, Indonesia",
    duration: "4 hari",
    price: 8500000,
    description: "Jelajahi keindahan alam dan warisan budaya di Dataran Tinggi Dieng.",
    availability: "Tersedia",
    category: "Budaya",
    image: "/src/assets/destinations/dieng.jpg",
    continent: "Asia",
    type: ["Alam", "Budaya"],
    itinerary: [
      "Hari 1: Kedatangan di Wonosobo",
      "Hari 2: Sunrise Sikunir dan Candi Dieng",
      "Hari 3: Telaga Warna dan Kawah Sikidang",
      "Hari 4: Kepulangan"
    ],
    included: [
      "Hotel",
      "Transportasi",
      "Pemandu lokal",
      "Tiket masuk objek wisata"
    ],
    notIncluded: [
      "Tiket transportasi ke Wonosobo",
      "Pengeluaran pribadi",
      "Makan di luar program"
    ]
  }
];