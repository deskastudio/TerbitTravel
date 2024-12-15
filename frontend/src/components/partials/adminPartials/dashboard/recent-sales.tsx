import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

// Data penjualan yang akan di-map
const recentSalesData = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", avatar: "/avatars/01.png", fallback: "OM" },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", avatar: "/avatars/02.png", fallback: "JL" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", avatar: "/avatars/03.png", fallback: "IN" },
  { name: "William Kim", email: "will@email.com", amount: "+$99.00", avatar: "/avatars/04.png", fallback: "WK" },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", avatar: "/avatars/05.png", fallback: "SD" },
];

// Functional Component untuk satu item penjualan
const SaleItem: React.FC<{
  name: string;
  email: string;
  amount: string;
  avatar: string;
  fallback: string;
}> = ({ name, email, amount, avatar, fallback }) => (
  <div className="flex items-center">
    <Avatar className="h-9 w-9">
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
    <div className="ml-4 space-y-1">
      <p className="text-sm font-medium leading-none">{name}</p>
      <p className="text-sm text-muted-foreground">{email}</p>
    </div>
    <div className="ml-auto font-medium">{amount}</div>
  </div>
);

// Functional Component utama untuk RecentSales
const RecentSales: React.FC = () => {
  return (
    <div className="space-y-8">
      {recentSalesData.map((sale, index) => (
        <SaleItem
          key={index}
          name={sale.name}
          email={sale.email}
          amount={sale.amount}
          avatar={sale.avatar}
          fallback={sale.fallback}
        />
      ))}
    </div>
  );
};

export default RecentSales;