"use client";

import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface BarChartProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  xFormatter?: (value: any) => string;
  yFormatter?: (value: any) => string;
  color?: string;
  height?: number;
  layout?: "horizontal" | "vertical";
}

export function BarChart({
  data,
  xKey,
  yKey,
  xFormatter,
  yFormatter,
  color = "var(--color-accent)",
  height = 280,
  layout = "horizontal",
}: BarChartProps) {
  if (layout === "vertical") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} layout="vertical" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={yFormatter}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey={xKey}
            type="category"
            tickFormatter={xFormatter}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          />
          <Bar dataKey={yKey} fill={color} radius={[0, 4, 4, 0]} maxBarSize={28} />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tickFormatter={xFormatter}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          axisLine={{ stroke: "var(--color-border)" }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={yFormatter}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip
          contentStyle={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        />
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} maxBarSize={40} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
