// seeders/travelSeeder.js
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";

// Import models
import Hotel from "../src/models/hotel.js";
import Armada from "../src/models/armada.js";
import Consume from "../src/models/consume.js";
import Destination from "../src/models/destination.js";
import DestinationCategory from "../src/models/destinationCategory.js";
import Package from "../src/models/package.js";
import PackageCategory from "../src/models/packageCategory.js";

dotenv.config();

// Data Indonesia untuk faker
const kotaIndonesia = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", 
  "Palembang", "Tangerang", "Depok", "Bekasi", "Bogor", "Batam",
  "Pekanbaru", "Bandar Lampung", "Malang", "Yogyakarta", "Solo",
  "Denpasar", "Balikpapan", "Samarinda", "Pontianak", "Manado"
];

const destinasiWisata = [
  "Pantai Kuta", "Pantai Sanur", "Pantai Seminyak", "Pantai Jimbaran",
  "Gunung Bromo", "Gunung Merapi", "Gunung Rinjani", "Gunung Batur",
  "Candi Borobudur", "Candi Prambanan", "Candi Mendut", "Candi Sewu",
  "Danau Toba", "Danau Bratan", "Danau Maninjau", "Danau Kelimutu",
  "Pulau Komodo", "Pulau Lombok", "Pulau Belitung", "Pulau Derawan",
  "Raja Ampat", "Bunaken", "Wakatobi", "Banda Neira"
];

const makananIndonesia = [
  "Nasi Gudeg", "Nasi Padang", "Nasi Rawon", "Nasi Liwet", "Nasi Tumpeng",
  "Ayam Betutu", "Ayam Taliwang", "Ayam Pop", "Ayam Penyet", "Ayam Geprek",
  "Rendang Daging", "Dendeng Balado", "Gulai Kambing", "Soto Betawi",
  "Gado-gado", "Pecel Lele", "Bakso Malang", "Mie Ayam", "Nasi Pecel",
  "Sate Ayam", "Sate Kambing", "Sate Padang", "Kerak Telor", "Pempek"
];

const fasilitasHotel = [
  "WiFi Gratis", "Kolam Renang", "Spa & Wellness", "Restoran", "Gym & Fitness",
  "Room Service", "Laundry", "Parkir Gratis", "AC", "TV Kabel", "Mini Bar",
  "Balkon", "Pemandangan Laut", "Pemandangan Gunung", "Kamar Non-Smoking",
  "Business Center", "Meeting Room", "Airport Shuttle", "Rental Mobil"
];

const fasilitasArmada = [
  "AC", "Audio System", "Reclining Seat", "Safety Belt", "CCTV",
  "Captain Seat", "Leg Rest", "Reading Light", "Charging Port", "WiFi",
  "Karaoke", "TV", "Kulkas Mini", "Toilet", "GPS Tracker"
];

const merkArmada = [
  "Toyota", "Isuzu", "Mitsubishi", "Hino", "Mercedes-Benz", 
  "Daihatsu", "Suzuki", "Hyundai", "Scania", "Volvo"
];

const jenisArmada = [
  "Bus Pariwisata", "Hiace", "Avanza", "Innova", "Elf", "Mini Bus",
  "Medium Bus", "Big Bus", "Double Decker", "Luxury Coach"
];

const runTravelSeeder = async () => {
  try {
    // Koneksi ke database
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/terbit_travel");
    console.log("✅ Connected to MongoDB");

    console.log("🌱 Starting travel data seeding...");

    // Clear existing data
    await Promise.all([
      Hotel.deleteMany({}),
      Armada.deleteMany({}),
      Consume.deleteMany({}),
      Destination.deleteMany({}),
      DestinationCategory.deleteMany({}),
      Package.deleteMany({}),
      PackageCategory.deleteMany({})
    ]);
    console.log("✅ Existing data cleared");

    // 1. SEED DESTINATION CATEGORIES
    console.log("🏷️ Seeding destination categories...");
    const destinationCategories = await DestinationCategory.insertMany([
      { title: "Pantai & Laut" },
      { title: "Gunung & Pegunungan" },
      { title: "Candi & Sejarah" },
      { title: "Danau & Air Terjun" },
      { title: "Pulau & Kepulauan" },
      { title: "Taman Nasional" },
      { title: "Kota & Urban" },
      { title: "Desa Wisata" }
    ]);
    console.log(`✅ ${destinationCategories.length} destination categories seeded`);

    // 2. SEED DESTINATIONS
    console.log("🏝️ Seeding destinations...");
    const destinations = [];
    for (let i = 0; i < 20; i++) {
      const namaDestinasi = faker.helpers.arrayElement(destinasiWisata);
      const kota = faker.helpers.arrayElement(kotaIndonesia);
      const kategori = faker.helpers.arrayElement(destinationCategories);
      
      destinations.push({
        nama: `${namaDestinasi} ${kota}`,
        lokasi: `${faker.location.streetAddress()}, ${kota}, ${faker.helpers.arrayElement(['Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Bali', 'Sumatra Utara', 'Sulawesi Selatan', 'Kalimantan Timur', 'Papua', 'NTT', 'NTB'])}`,
        deskripsi: `${namaDestinasi} ${kota} merupakan destinasi wisata yang menawarkan keindahan ${kategori.title.toLowerCase()} yang memukau. Tempat ini sangat cocok untuk liburan keluarga maupun petualangan solo. Dengan pemandangan yang indah dan fasilitas yang lengkap, destinasi ini menjadi pilihan favorit wisatawan domestik dan mancanegara.`,
        foto: [
          `/uploads/destinations/${namaDestinasi.toLowerCase().replace(/ /g, '-')}-1.jpg`,
          `/uploads/destinations/${namaDestinasi.toLowerCase().replace(/ /g, '-')}-2.jpg`,
          `/uploads/destinations/${namaDestinasi.toLowerCase().replace(/ /g, '-')}-3.jpg`
        ],
        category: kategori._id
      });
    }
    const insertedDestinations = await Destination.insertMany(destinations);
    console.log(`✅ ${insertedDestinations.length} destinations seeded`);

    // 3. SEED HOTELS
    console.log("🏨 Seeding hotels...");
    const hotels = [];
    const namaHotel = [
      "Grand", "Royal", "Imperial", "Majestic", "Premium", "Luxury", 
      "Paradise", "Garden", "Ocean", "Mountain", "Villa", "Resort",
      "Boutique", "Heritage", "Modern", "Classic"
    ];
    
    for (let i = 0; i < 15; i++) {
      const nama1 = faker.helpers.arrayElement(namaHotel);
      const nama2 = faker.helpers.arrayElement(namaHotel);
      const kota = faker.helpers.arrayElement(kotaIndonesia);
      const bintang = faker.number.int({ min: 2, max: 5 });
      const hargaBase = bintang * 200000;
      const harga = faker.number.int({ min: hargaBase, max: hargaBase + 500000 });
      
      // Fasilitas sesuai bintang hotel
      let jumlahFasilitas = bintang + faker.number.int({ min: 2, max: 4 });
      const fasilitasTerpilih = faker.helpers.arrayElements(fasilitasHotel, jumlahFasilitas);
      
      hotels.push({
        nama: `${nama1} ${nama2} Hotel ${kota}`,
        alamat: `${faker.location.streetAddress()}, ${kota}`,
        gambar: [
          `/uploads/hotels/${nama1.toLowerCase()}-${kota.toLowerCase()}-1.jpg`,
          `/uploads/hotels/${nama1.toLowerCase()}-${kota.toLowerCase()}-2.jpg`,
          `/uploads/hotels/${nama1.toLowerCase()}-${kota.toLowerCase()}-3.jpg`
        ],
        bintang: bintang,
        harga: harga,
        fasilitas: fasilitasTerpilih
      });
    }
    const insertedHotels = await Hotel.insertMany(hotels);
    console.log(`✅ ${insertedHotels.length} hotels seeded`);

    // 4. SEED ARMADAS
    console.log("🚌 Seeding armadas...");
    const armadas = [];
    
    for (let i = 0; i < 12; i++) {
      const jenis = faker.helpers.arrayElement(jenisArmada);
      const merek = faker.helpers.arrayElement(merkArmada);
      
      // Kapasitas berdasarkan jenis
      let kapasitasAngka, hargaBase;
      if (jenis.includes('Bus') || jenis.includes('Coach')) {
        kapasitasAngka = faker.number.int({ min: 35, max: 50 });
        hargaBase = 1200000;
      } else if (jenis.includes('Hiace') || jenis.includes('Elf')) {
        kapasitasAngka = faker.number.int({ min: 12, max: 19 });
        hargaBase = 800000;
      } else {
        kapasitasAngka = faker.number.int({ min: 6, max: 8 });
        hargaBase = 500000;
      }
      
      const fasilitasTerpilih = faker.helpers.arrayElements(fasilitasArmada, faker.number.int({ min: 3, max: 6 }));
      const harga = faker.number.int({ min: hargaBase - 200000, max: hargaBase + 300000 });
      
      armadas.push({
        nama: `${jenis} ${merek}`,
        kapasitas: [`${kapasitasAngka} Penumpang`, ...fasilitasTerpilih.slice(0, 2)],
        gambar: [
          `/uploads/armadas/${jenis.toLowerCase().replace(/ /g, '-')}-1.jpg`,
          `/uploads/armadas/${jenis.toLowerCase().replace(/ /g, '-')}-2.jpg`
        ],
        harga: harga,
        merek: merek
      });
    }
    const insertedArmadas = await Armada.insertMany(armadas);
    console.log(`✅ ${insertedArmadas.length} armadas seeded`);

    // 5. SEED CONSUMES
    console.log("🍽️ Seeding consume packages...");
    const consumes = [];
    const jenisPaket = ["Standar", "Premium", "Deluxe", "VIP", "Vegetarian", "Seafood", "Tradisional", "Modern"];
    
    for (let i = 0; i < 10; i++) {
      const jenis = faker.helpers.arrayElement(jenisPaket);
      const makananUtama = faker.helpers.arrayElement(makananIndonesia);
      const lauk = faker.helpers.arrayElements(makananIndonesia, faker.number.int({ min: 4, max: 7 }));
      
      // Harga berdasarkan jenis paket
      let hargaBase;
      switch(jenis) {
        case "VIP": hargaBase = 150000; break;
        case "Premium": case "Deluxe": hargaBase = 120000; break;
        case "Seafood": hargaBase = 180000; break;
        case "Tradisional": hargaBase = 85000; break;
        default: hargaBase = 75000;
      }
      
      const harga = faker.number.int({ min: hargaBase - 15000, max: hargaBase + 25000 });
      
      consumes.push({
        nama: `Paket Makan ${jenis}`,
        harga: harga,
        lauk: [`Nasi Putih`, makananUtama, ...lauk, `Air Mineral`, `Kerupuk`]
      });
    }
    const insertedConsumes = await Consume.insertMany(consumes);
    console.log(`✅ ${insertedConsumes.length} consume packages seeded`);

    // 6. SEED PACKAGE CATEGORIES
    console.log("📦 Seeding package categories...");
    const packageCategories = await PackageCategory.insertMany([
      { title: "Wisata Keluarga" },
      { title: "Honeymoon & Romantis" },
      { title: "Adventure & Petualangan" },
      { title: "Religi & Spiritual" },
      { title: "Edukasi & Budaya" },
      { title: "Corporate Trip" },
      { title: "Backpacker" },
      { title: "Luxury Travel" }
    ]);
    console.log(`✅ ${packageCategories.length} package categories seeded`);

    // 7. SEED PACKAGES
    console.log("📦 Seeding travel packages...");
    const packages = [];
    const durasiOptions = ["2D1N", "3D2N", "4D3N", "5D4N", "6D5N"];
    
    for (let i = 0; i < 8; i++) {
      const destinasi = faker.helpers.arrayElement(insertedDestinations);
      const hotel = faker.helpers.arrayElement(insertedHotels);
      const armada = faker.helpers.arrayElement(insertedArmadas);
      const consume = faker.helpers.arrayElement(insertedConsumes);
      const kategori = faker.helpers.arrayElement(packageCategories);
      const durasi = faker.helpers.arrayElement(durasiOptions);
      
      const hari = parseInt(durasi.charAt(0));
      const hargaBase = hari * 600000;
      const harga = faker.number.int({ min: hargaBase, max: hargaBase + 500000 });
      
      // Generate jadwal
      const jadwal = [];
      for (let j = 0; j < faker.number.int({ min: 2, max: 4 }); j++) {
        const tanggalMulai = faker.date.future({ years: 0.5 });
        const tanggalSelesai = new Date(tanggalMulai);
        tanggalSelesai.setDate(tanggalSelesai.getDate() + (hari - 1));
        
        jadwal.push({
          tanggalAwal: tanggalMulai,
          tanggalAkhir: tanggalSelesai,
          status: faker.helpers.arrayElement(["tersedia", "tersedia", "tersedia", "tidak tersedia"])
        });
      }
      
      const includeItems = [
        `Hotel ${hotel.bintang} bintang`,
        `Transportasi ${armada.nama}`,
        `Makan ${faker.number.int({ min: 2, max: 3 })}x sehari`,
        "Tiket masuk objek wisata",
        "Guide berpengalaman",
        "Asuransi perjalanan"
      ];
      
      const excludeItems = [
        "Tiket pesawat/kereta",
        "Belanja pribadi",
        "Laundry",
        "Tips guide & driver",
        "Pengeluaran di luar itinerary"
      ];
      
      packages.push({
        nama: `Paket Wisata ${destinasi.nama} ${durasi}`,
        deskripsi: `Nikmati pengalaman tak terlupakan di ${destinasi.nama} selama ${durasi.replace('D', ' hari ').replace('N', ' malam')}. Paket ini mencakup kunjungan ke berbagai tempat menarik dengan fasilitas lengkap dan pelayanan terbaik. Cocok untuk ${kategori.title.toLowerCase()} yang ingin menikmati keindahan Indonesia.`,
        include: includeItems,
        exclude: excludeItems,
        harga: harga,
        status: faker.helpers.arrayElement(["available", "available", "available", "sold out"]),
        durasi: durasi.replace('D', ' hari ').replace('N', ' malam'),
        jadwal: jadwal,
        destination: destinasi._id,
        hotel: hotel._id,
        armada: armada._id,
        consume: consume._id,
        kategori: kategori._id
      });
    }
    const insertedPackages = await Package.insertMany(packages);
    console.log(`✅ ${insertedPackages.length} travel packages seeded`);

    console.log("\n🎉 Travel seeding completed successfully!");
    console.log("\n📊 SEEDING SUMMARY:");
    console.log(`🏷️ Destination Categories: ${destinationCategories.length}`);
    console.log(`🏝️ Destinations: ${insertedDestinations.length}`);
    console.log(`🏨 Hotels: ${insertedHotels.length}`);
    console.log(`🚌 Armadas: ${insertedArmadas.length}`);
    console.log(`🍽️ Consume Packages: ${insertedConsumes.length}`);
    console.log(`📦 Package Categories: ${packageCategories.length}`);
    console.log(`📦 Travel Packages: ${insertedPackages.length}`);

  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Database connection closed");
    process.exit(0);
  }
};

// Jalankan seeder
runTravelSeeder();