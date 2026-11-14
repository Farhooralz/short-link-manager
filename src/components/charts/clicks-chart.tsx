"use client";

import { useFormatter, useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyClicks } from "@/lib/db/clicks";

const tickStyle = { fill: "var(--muted-foreground)", fontSize: 12 };

export function ClicksChart({ data }: { data: DailyClicks[] }) {
  const t = useTranslations("LinkDetail");
  const format = useFormatter();

  const chartData = data.map((point) => ({
    label: format.dateTime(new Date(`${point.date}T00:00:00Z`), {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
    clicks: point.clicks,
  }));

  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
        >
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={tickStyle}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={tickStyle}
            tickFormatter={(value: number) => format.number(value)}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
            labelStyle={{ color: "var(--popover-foreground)" }}
            itemStyle={{ color: "var(--popover-foreground)" }}
            formatter={(value) => format.number(Number(value))}
          />
          <Bar
            dataKey="clicks"
            name={t("series")}
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}