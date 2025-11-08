'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Legend } from 'recharts';
import { addDays, format } from 'date-fns';

export interface KPI {
  title: string;
  value: string;
}

interface ForecastVisualizationCardProps {
  chartData: any[];
}

const chartConfig = {
  predicted: {
    label: "Predicted",
    color: "hsl(var(--primary))",
  },
  actual: {
    label: "Actual",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export function mockForecastData() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i);
    const baseDemand = 2800 + Math.sin(i / 2) * 200;
    return {
      date: format(date, 'MMM d'),
      predicted: Math.round(baseDemand + (Math.random() - 0.5) * 100),
      actual: Math.round(baseDemand + (Math.random() - 0.5) * 150),
    };
  });
}

export function ForecastVisualizationCard({ chartData }: ForecastVisualizationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forecast Visualization</CardTitle>
        <CardDescription>
          Predicted vs. Actual electricity demand for the next 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis domain={['dataMin - 100', 'dataMax + 100']} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Legend />
              <Line type="monotone" dataKey="predicted" stroke="var(--color-predicted)" strokeWidth={2} dot={true} />
              <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" strokeWidth={2} dot={true} />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed">
            <p className="text-muted-foreground">Generate a forecast to see the chart.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
