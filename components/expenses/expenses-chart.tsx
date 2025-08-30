"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Label, PieLabelRenderProps } from "recharts";

interface ExpensesChartProps {
  data: Array<{ category: string; amount: number }>;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA336A",
  "#3399AA",
  "#33AA99",
  "#AA8833",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
];

const chartConfig = {
  amount: {
    label: "Monto",
  },
};

export function ExpensesChart({ data }: ExpensesChartProps) {
  const chartData = useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
      })),
    [data]
  );

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoría</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground" role="alert" aria-live="polite">
            No hay datos para mostrar
          </p>
        </CardContent>
      </Card>
    );
  }

  // Label personalizado compatible con recharts
  const renderLabel = (props: PieLabelRenderProps) => {
    const { index, percent, x, y } = props;
    if (index === undefined) return null;
    const category = chartData[index]?.category || "";
    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${category} ${(percent! * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card aria-label="Gráfico de gastos por categoría">
      <CardHeader>
        <CardTitle>Gastos por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
                aria-label="Segmentos de gastos"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  value="Gastos"
                  position="center"
                  style={{ fontWeight: "bold", fontSize: 16, fill: "#333" }}
                />
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Monto"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 space-y-2" role="list" aria-label="Leyenda de gastos por categoría">
          {chartData.map((item) => (
            <div
              key={item.category}
              className="flex items-center justify-between text-sm"
              role="listitem"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                  aria-hidden="true"
                />
                <span>{item.category}</span>
              </div>
              <span className="font-medium">${item.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
