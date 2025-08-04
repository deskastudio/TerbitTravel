# TerbitTravel Backend

Backend server untuk aplikasi TerbitTravel.

## Cara Menjalankan

### Metode 1: Menggunakan Script Start (Direkomendasikan)

**Untuk Windows:**

```bash
# Gunakan batch file
start.bat

# ATAU gunakan PowerShell script
powershell -File start.ps1
```

Script ini akan:
1. Memperbarui konfigurasi CORS
2. Menjalankan server backend di http://localhost:5000
3. Membuat tunnel dengan localtunnel.me untuk akses eksternal
4. Secara otomatis memperbarui URL di file .env backend dan frontend

### Metode 2: Menggunakan NPM Scripts

```bash
# Memperbaiki konfigurasi CORS
npm run cors-fix

# Menjalankan server backend
npm run dev

# Di terminal terpisah: Membuat tunnel untuk akses eksternal
npm run tunnel
```

### Metode 3: Menggunakan Script All-in-One (Alternatif)

```bash
# Menjalankan semua komponen dalam satu perintah
npm run start-all
```

## Pengecekan CORS

Jika mengalami masalah CORS, gunakan:

```bash
npm run cors-check
```

## Fitur Admin

Membuat akun super admin:

```bash
npm run create-admin
```

## API Documentation

API documentation tersedia di `/swagger` ketika server berjalan.
