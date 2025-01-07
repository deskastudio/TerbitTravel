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

// Data dengan nilai yang jelas
const data = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2400 },
  { name: "Mar", total: 3000 },
  { name: "Apr", total: 2000 },
  { name: "May", total: 2780 },
  { name: "Jun", total: 1890 },
  { name: "Jul", total: 2390 },
  { name: "Aug", total: 3490 },
  { name: "Sep", total: 4200 },
  { name: "Oct", total: 2800 },
  { name: "Nov", total: 3000 },
  { name: "Dec", total: 3500 },
];

const Overview: React.FC = () => {
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
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip formatter={(value) => `$${value}`} />
        <Bar dataKey="total" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;
