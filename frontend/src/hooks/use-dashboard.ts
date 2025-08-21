import { useState, useEffect } from "react";
import { UserService } from "@/services/user.service";
import { TourPackageService } from "@/services/tour-package.service";
import { BookingAdminService } from "@/services/booking-admin.service";
import axios from "@/lib/axios";

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  totalPackages: number;
  recentBookings: any[];
  monthlyRevenue: any[];
  userGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
  packageGrowth: number;
}

interface UseDashboardResult {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboard = (): UseDashboardResult => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching dashboard data...");

      // Fetch data menggunakan service yang ada dan booking admin service
      const [usersData, packagesData, bookingsResponse] = await Promise.all([
        UserService.getAllUsers().catch(() => []),
        TourPackageService.getAllPackages().catch(() => []),
        BookingAdminService.getAllBookings({
          page: 1,
          limit: 50,
        }).catch(() => ({ data: [] })),
      ]);

      console.log("📊 Raw Data:", {
        usersData,
        packagesData,
        bookingsResponse,
      });

      const users = Array.isArray(usersData) ? usersData : [];
      const packages = Array.isArray(packagesData) ? packagesData : [];
      // BookingAdminService returns response with { success, data, message }
      const bookings = Array.isArray(bookingsResponse?.data)
        ? bookingsResponse.data
        : [];

      console.log("✅ Processed Data:", {
        users: users.length,
        packages: packages.length,
        bookings: bookings.length,
      });

      // Jika tidak ada data real, gunakan data simulasi untuk demo
      const hasRealData =
        users.length > 0 || bookings.length > 0 || packages.length > 0;
      console.log("🎯 Has real data:", hasRealData);

      let finalUsers: any[] = users;
      let finalBookings: any[] = bookings;
      let finalPackages: any[] = packages;

      // Selalu gunakan data real jika ada, fallback ke simulasi hanya jika benar-benar kosong
      if (users.length === 0) {
        console.log("📝 No real users, adding simulation users...");
        finalUsers = Array.from({ length: 15 }, (_, i) => ({
          _id: `user${i}`,
          nama: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          alamat: `Alamat ${i + 1}`,
          noTelp: `08123456789${i}`,
          createdAt: new Date(2025, 7, i + 1), // Agustus 2025
        }));
      }

      if (packages.length === 0) {
        console.log("📦 No real packages, adding simulation packages...");
        finalPackages = Array.from({ length: 8 }, (_, i) => ({
          _id: `package${i}`,
          nama: `Paket Wisata ${i + 1}`,
          deskripsi: `Deskripsi paket ${i + 1}`,
          createdAt: new Date(2025, 7, i + 1), // Agustus 2025
        }));
      }

      if (bookings.length === 0) {
        console.log("🎫 No real bookings, adding simulation bookings...");
        finalBookings = Array.from({ length: 25 }, (_, i) => ({
          _id: `booking${i}`,
          totalHarga: 2000000 + i * 100000, // 2jt - 4.4jt
          user: { nama: `User ${i + 1}`, email: `user${i + 1}@example.com` },
          paketWisata: { nama: `Paket ${i + 1}` },
          createdAt: new Date(2025, 7, i + 1), // Agustus 2025
        }));
      } else {
        console.log("✅ Using real booking data from database");
      }

      console.log("🔢 Final counts:", {
        finalUsers: finalUsers.length,
        finalBookings: finalBookings.length,
        finalPackages: finalPackages.length,
      });

      // Get recent bookings (last 5) - gunakan finalBookings dan format data
      const recentBookings = finalBookings
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map((booking: any) => ({
          _id: booking._id || booking.bookingId,
          user: booking.customerInfo
            ? {
                nama: booking.customerInfo.nama,
                email: booking.customerInfo.email,
                foto: booking.customerInfo.foto,
              }
            : booking.user,
          namaUser: booking.customerInfo?.nama || booking.user?.nama,
          emailUser: booking.customerInfo?.email || booking.user?.email,
          totalHarga: booking.totalHarga || booking.grandTotal || 0,
          paketWisata: booking.packageInfo
            ? {
                nama: booking.packageInfo.nama,
              }
            : booking.paketWisata,
          createdAt: booking.createdAt || booking.tanggalBooking,
        }));

      // Hitung total revenue - gunakan finalBookings dengan field yang tepat
      const totalRevenue = finalBookings.reduce((sum: number, booking: any) => {
        const amount = booking.totalHarga || booking.grandTotal || 0;
        return sum + amount;
      }, 0);

      // Hitung growth rate (simulasi berdasarkan data yang ada)
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const currentMonthUsers = finalUsers.filter((user: any) => {
        const userDate = new Date(user.createdAt);
        return (
          userDate.getMonth() === currentMonth &&
          userDate.getFullYear() === currentYear
        );
      }).length;

      const lastMonthUsers = finalUsers.filter((user: any) => {
        const userDate = new Date(user.createdAt);
        return (
          userDate.getMonth() === lastMonth &&
          userDate.getFullYear() === lastMonthYear
        );
      }).length;

      const userGrowth =
        lastMonthUsers > 0
          ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
          : 0;

      const currentMonthBookings = finalBookings.filter((booking: any) => {
        const bookingDate = new Date(
          booking.createdAt || booking.tanggalBooking
        );
        return (
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        );
      }).length;

      const lastMonthBookings = finalBookings.filter((booking: any) => {
        const bookingDate = new Date(
          booking.createdAt || booking.tanggalBooking
        );
        return (
          bookingDate.getMonth() === lastMonth &&
          bookingDate.getFullYear() === lastMonthYear
        );
      }).length;

      const bookingGrowth =
        lastMonthBookings > 0
          ? ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) *
            100
          : 0;

      // Revenue growth
      const currentMonthRevenue = finalBookings
        .filter((booking: any) => {
          const bookingDate = new Date(
            booking.createdAt || booking.tanggalBooking
          );
          return (
            bookingDate.getMonth() === currentMonth &&
            bookingDate.getFullYear() === currentYear
          );
        })
        .reduce(
          (sum: number, booking: any) =>
            sum + (booking.totalHarga || booking.grandTotal || 0),
          0
        );

      const lastMonthRevenue = finalBookings
        .filter((booking: any) => {
          const bookingDate = new Date(
            booking.createdAt || booking.tanggalBooking
          );
          return (
            bookingDate.getMonth() === lastMonth &&
            bookingDate.getFullYear() === lastMonthYear
          );
        })
        .reduce(
          (sum: number, booking: any) =>
            sum + (booking.totalHarga || booking.grandTotal || 0),
          0
        );

      const revenueGrowth =
        lastMonthRevenue > 0
          ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : 0;

      // Generate monthly revenue data for chart
      const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
        const monthRevenue = finalBookings
          .filter((booking: any) => {
            const bookingDate = new Date(
              booking.createdAt || booking.tanggalBooking
            );
            return (
              bookingDate.getMonth() === i &&
              bookingDate.getFullYear() === currentYear
            );
          })
          .reduce(
            (sum: number, booking: any) =>
              sum + (booking.totalHarga || booking.grandTotal || 0),
            0
          );

        return {
          name: new Date(currentYear, i, 1).toLocaleString("id-ID", {
            month: "short",
          }),
          total: monthRevenue,
        };
      });

      const dashboardStats: DashboardStats = {
        totalUsers: finalUsers.length,
        totalBookings: finalBookings.length,
        totalRevenue,
        totalPackages: finalPackages.length,
        recentBookings,
        monthlyRevenue,
        userGrowth,
        bookingGrowth,
        revenueGrowth,
        packageGrowth: 0, // Bisa dihitung jika ada data package creation date
      };

      console.log("📈 Final Dashboard Stats:", dashboardStats);
      setStats(dashboardStats);
    } catch (err: any) {
      console.error("Error fetching dashboard stats:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal memuat data dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🚀 Dashboard hook mounted, fetching data...");
    fetchDashboardStats();
  }, []);

  const refetch = () => {
    console.log("🔄 Manual refetch triggered");
    fetchDashboardStats();
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
};
