'use client'
import { XAxis, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

import type { BalancePoint } from '@/lib/transactions/buildBalanceSeries'
type Props = {
  data: BalancePoint[]
}
export function BalanceSparkline({ data }: Props) {
  const chartConfig = {
    balance: {
      label: 'Balance',
      color: '#10b981',
    },
  }
  if (data.length === 0) return null
  return (
    <div className="h-24 w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart data={data}>
          <CartesianGrid vertical={false} strokeOpacity={0.2} />
          <XAxis dataKey="label" hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="var(--color-balance)"
            fill="var(--color-balance)"
            fillOpacity={0.15}
            strokeWidth={2.5}
            dot={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
