'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useTheme } from '@/context/ThemeContext'
import type { NetWorthPoint } from '@/lib/transactions/buildNetWorthSeries'

type Props = {
  data: NetWorthPoint[]
}

const chartConfig = {
  balance: {
    label: 'Net Worth',
    color: '#10b981',
  },
}

function formatYAxis(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}k`
  return `$${value.toFixed(0)}`
}

export function NetWorthChart({ data }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const gridStroke = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
  const tickFill = '#64748b'

  if (data.length === 0)
    return <p className="text-sm text-gray-500 dark:text-slate-500">No data for this period</p>

  return (
    <div className="h-48 w-full sm:h-64">
      <ChartContainer className="h-full w-full" config={chartConfig}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="netWorthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-balance)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--color-balance)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={gridStroke} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: tickFill, fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: tickFill, fontSize: 11 }}
            tickFormatter={formatYAxis}
            width={52}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Net Worth']}
                className={`!bg-[#0e2318] !border-white/10 !text-slate-200${isDark ? ' [&_.text-muted-foreground]:!text-slate-400 [&_.text-foreground]:!text-white' : ''}`}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="var(--color-balance)"
            fill="url(#netWorthFill)"
            strokeWidth={2.25}
            dot={false}
            activeDot={{ r: 4, fill: isDark ? '#34d399' : '#059669' }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
