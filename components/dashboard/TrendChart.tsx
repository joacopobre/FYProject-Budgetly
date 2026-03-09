'use client'
import { TrendPoint } from '@/lib/transactions/buildTrendSeries'
import { BarChart, Bar, XAxis, CartesianGrid, YAxis } from 'recharts'
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
  if (data.length === 0) return <p className="text-sm text-gray-500">No data for this period</p>
  return (
    <div className="h-64 w-full">
      <ChartContainer className="h-full w-full" config={chartConfig}>
        <BarChart data={data} barGap={6}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="income" fill="var(--color-income)" radius={[6, 6, 2, 2]} />
          <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[6, 6, 2, 2]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
