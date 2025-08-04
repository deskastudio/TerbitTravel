import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/utils/image-helper";

interface Booking {
  _id: string;
  user?: {
    nama: string;
    email: string;
    foto?: string;
  };
  namaUser?: string;
  emailUser?: string;
  totalHarga: number;
  paketWisata?: {
    nama: string;
  };
  createdAt: string;
}

interface RecentSalesProps {
  bookings?: Booking[];
}

// Functional Component untuk satu item booking
const BookingItem: React.FC<{
  booking: Booking;
}> = ({ booking }) => {
  const userName = booking.user?.nama || booking.namaUser || "Unknown User";
  const userEmail = booking.user?.email || booking.emailUser || "";
  const userAvatar = booking.user?.foto;
  const packageName = booking.paketWisata?.nama || "Tour Package";

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get user initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center">
      <Avatar className="h-9 w-9">
        {userAvatar ? (
          <AvatarImage src={getImageUrl(userAvatar)} alt={userName} />
        ) : null}
        <AvatarFallback className="bg-blue-100 text-blue-600">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{userName}</p>
        <p className="text-sm text-muted-foreground">
          {userEmail || packageName}
        </p>
      </div>
      <div className="ml-auto font-medium text-green-600">
        +{formatCurrency(booking.totalHarga)}
      </div>
    </div>
  );
};

// Functional Component utama untuk RecentSales
const RecentSales: React.FC<RecentSalesProps> = ({ bookings = [] }) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">
          Belum ada booking terbaru
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {bookings.map((booking) => (
        <BookingItem key={booking._id} booking={booking} />
      ))}
    </div>
  );
};

export default RecentSales;
