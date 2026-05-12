"use client";

import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface AreaChartProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  xFormatter?: (value: any) => string;
  yFormatter?: (value: any) => string;
  color?: string;
  height?: number;
}

export function AreaChart({
  data,
  xKey,
  yKey,
  xFormatter,
  yFormatter,
  color = "var(--color-accent)",
  height = 280,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${yKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
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
          formatter={yFormatter ? (v: any) => [yFormatter(v), ""] : undefined}
          labelFormatter={xFormatter}
        />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${yKey})`}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
