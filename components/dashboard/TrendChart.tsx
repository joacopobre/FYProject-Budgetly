'use client'
import { TrendPoint } from '@/lib/transactions/buildTrendSeries'
import { BarChart, Bar, XAxis, CartesianGrid } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

type Props = {
  data: TrendPoint[]
}
const chartConfig = {
  income: {
    label: 'Income',
    color: '#10b981',
  },
  expenses: {
    label: 'Expenses',
    color: '#ef4444',
  },
}

export function TrendChart({ data }: Props) {
  if (data.length === 0) return <p>No data for this period</p>
  return (
    <div className="h-64 w-full">
      <ChartContainer className="h-full w-full" config={chartConfig}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="income" fill="var(--color-income)" radius={4} />
          <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
    
  )
}
