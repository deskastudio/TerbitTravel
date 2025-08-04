# TerbitTravel

Aplikasi TerbitTravel - Platform perjalanan online.

## Cara Menjalankan Aplikasi Lengkap

### Metode 1: Menggunakan Script Full Application (Direkomendasikan)

**Untuk Windows PowerShell:**

```bash
# Jalankan script PowerShell
.\run-app.ps1
```

**Untuk Windows Command Prompt:**

```bash
# Jalankan batch file
run-app.bat
```

Script ini akan:
1. Memperbarui konfigurasi CORS
2. Menjalankan server backend di http://localhost:5000
3. Membuat tunnel dengan localtunnel.me untuk akses eksternal
4. Menjalankan aplikasi frontend di http://localhost:5173
5. Secara otomatis memperbarui URL di file .env backend dan frontend

### Metode 2: Menjalankan Secara Manual

Jalankan masing-masing komponen dalam terminal terpisah:

```bash
# Terminal 1: Menjalankan backend server
cd backend
npm run dev

# Terminal 2: Membuat tunnel
cd backend
npm run tunnel

# Terminal 3: Menjalankan frontend
cd frontend
npm run dev
```

## Struktur Folder

- `/backend` - Server Express.js dan API endpoints
- `/frontend` - Aplikasi frontend
- `/ngrok-v3-stable-windows-amd64` - Ngrok binaries (alternatif tunneling)

## Fitur Backend

- Autentikasi admin dan user
- API untuk paket perjalanan, destinasi, dll.
- Integrasi dengan payment gateway
- File uploads dan manajemen gambar

## URL Aplikasi

- Frontend local: http://localhost:5173
- Backend local: http://localhost:5000 
- Backend API (external): https://terbit-travel.loca.lt (atau URL lain dari tunnel)
- Swagger API docs: https://terbit-travel.loca.lt/swagger

## Akun Admin

Untuk membuat akun admin:

```bash
cd backend
npm run create-admin
```
