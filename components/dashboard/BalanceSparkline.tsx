'use client'
import { XAxis, CartesianGrid, AreaChart, Area } from 'recharts'
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
          <defs>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-balance)" stopOpacity={0.22} />
              <stop offset="95%" stopColor="var(--color-balance)" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="label" hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="var(--color-balance)"
            fill="url(#balanceFill)"
            strokeWidth={2.25}
            dot={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
