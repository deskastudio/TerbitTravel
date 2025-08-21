"use client";

import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface OverviewProps {
  data?: Array<{
    name: string;
    total: number;
  }>;
}

// Default data fallback
const defaultData = [
  { name: "Jan", total: 0 },
  { name: "Feb", total: 0 },
  { name: "Mar", total: 0 },
  { name: "Apr", total: 0 },
  { name: "May", total: 0 },
  { name: "Jun", total: 0 },
  { name: "Jul", total: 0 },
  { name: "Aug", total: 0 },
  { name: "Sep", total: 0 },
  { name: "Oct", total: 0 },
  { name: "Nov", total: 0 },
  { name: "Dec", total: 0 },
];

const Overview: React.FC<OverviewProps> = ({ data = defaultData }) => {
  // Format currency for Indonesia
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            if (value >= 1000000) {
              return `${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `${(value / 1000).toFixed(1)}K`;
            }
            return value.toString();
          }}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), "Revenue"]}
          labelStyle={{ color: "#000" }}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <Bar dataKey="total" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;
