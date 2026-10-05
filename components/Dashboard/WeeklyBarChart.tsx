"use client";

import React, { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyPoint } from "@/types/dashboard";

interface WeeklyBarChartProps {
  data: WeeklyPoint[];
  label: string;
  color: string;
}

const WeeklyBarChart = ({ data, label, color }: WeeklyBarChartProps) => {
  if (data.every((point) => point.value === 0)) {
    return (
      <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
        لا توجد بيانات خلال آخر 4 أسابيع
      </div>
    );
  }

  return (
    <div dir="ltr">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: -30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar
            dataKey="value"
            name={label}
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default memo(WeeklyBarChart);
