# Dashboard Admin Integration

## Overview

Dashboard admin sekarang telah terintegrasi dengan sistem backend untuk menampilkan data real-time dari aplikasi TerbitTravel.

## Features yang Diintegrasikan

### 1. Statistics Cards

- **Total Revenue**: Menampilkan total pendapatan dari semua booking
- **Total Users**: Jumlah total pengguna yang terdaftar
- **Total Bookings**: Jumlah total booking yang dilakukan
- **Tour Packages**: Jumlah paket wisata yang tersedia

### 2. Growth Metrics

- **User Growth**: Persentase pertumbuhan user bulan ini vs bulan lalu
- **Booking Growth**: Persentase pertumbuhan booking bulan ini vs bulan lalu
- **Revenue Growth**: Persentase pertumbuhan revenue bulan ini vs bulan lalu

### 3. Charts & Visualizations

- **Overview Chart**: Bar chart menampilkan revenue bulanan sepanjang tahun
- **Recent Bookings**: Daftar 5 booking terbaru dengan detail user dan paket

## Files yang Dimodifikasi

### 1. `/src/hooks/use-dashboard.ts` (NEW)

Hook baru untuk mengambil data dashboard dari berbagai endpoint:

- `/api/user` - Data pengguna
- `/api/booking` - Data booking
- `/api/package` - Data paket wisata

### 2. `/src/components/partials/adminPartials/dashboard/Index.tsx`

- Diupdate untuk menggunakan data real dari `useDashboard` hook
- Menampilkan loading state dan error handling
- Format currency dalam Rupiah (IDR)

### 3. `/src/components/partials/adminPartials/dashboard/overview.tsx`

- Diupdate untuk menerima props data dari parent component
- Chart menampilkan revenue bulanan dengan format currency yang benar
- Responsive tooltip dengan format IDR

### 4. `/src/components/partials/adminPartials/dashboard/recent-sales.tsx`

- Diubah menjadi `recent-bookings` functionality
- Menampilkan data booking real dengan foto user
- Format currency IDR untuk menampilkan harga booking

## API Integration

### Authentication

Dashboard menggunakan admin token yang disimpan di localStorage:

```javascript
const token = localStorage.getItem("adminToken");
```

### Data Sources

1. **Users**: `GET /api/user` - Mengambil semua data pengguna
2. **Bookings**: `GET /api/booking` - Mengambil semua data booking
3. **Packages**: `GET /api/package` - Mengambil semua data paket wisata

### Error Handling

- Menggunakan try-catch untuk handle API errors
- Fallback data jika endpoint tidak tersedia
- User-friendly error messages

## Usage

```tsx
import { useDashboard } from "@/hooks/use-dashboard";

const DashboardPage = () => {
  const { stats, loading, error, refetch } = useDashboard();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  return (
    <div>
      <StatsCards stats={stats} />
      <Charts data={stats.monthlyRevenue} />
      <RecentBookings bookings={stats.recentBookings} />
    </div>
  );
};
```

## Data Flow

1. **Component Mount**: Dashboard component calls `useDashboard()` hook
2. **Data Fetching**: Hook fetches data from multiple API endpoints in parallel
3. **Data Processing**: Raw data is processed to calculate statistics and growth metrics
4. **State Update**: Processed data is stored in component state
5. **UI Render**: Components render with real data

## Performance Considerations

- Data fetching menggunakan `Promise.all()` untuk paralel requests
- Error handling per endpoint dengan fallback empty arrays
- Loading states untuk better UX
- Manual refetch capability

## Future Enhancements

1. **Real-time Updates**: Implement WebSocket for live data updates
2. **Caching**: Add caching layer untuk mengurangi API calls
3. **Filters**: Tambah date range picker untuk filter data
4. **Export**: Functionality untuk export data dashboard ke PDF/Excel

## Environment Variables

Pastikan `VITE_API_URL` sudah di-set di `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```
