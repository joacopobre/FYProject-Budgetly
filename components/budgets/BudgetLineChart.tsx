'use client'

import { LineChart, Line, XAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

type Props = {
  data: { label: string; value: number }[]
}

const chartConfig = {
  value: {
    label: 'Balance',
    color: '#10b981',
  },
}

export function BudgetLineChart({ data }: Props) {
  if (data.length === 0) return <p>No activity</p>

  return (
    <div className="h-48 w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart data={data}>
          <CartesianGrid vertical={false} strokeOpacity={0.2} />
          <XAxis dataKey="label" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="linear"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
