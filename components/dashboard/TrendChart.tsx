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
import { useTheme } from '@/context/ThemeContext'

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
    color: '#dc2626',
  },
}

export function TrendChart({ data }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const gridStroke = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
  const tickFill = isDark ? '#64748b' : '#64748b'

  if (data.length === 0)
    return <p className="text-sm text-gray-500 dark:text-slate-500">No data for this period</p>

  return (
    <div className="h-48 w-full sm:h-64">
      <ChartContainer className="h-full w-full" config={chartConfig}>
        <BarChart data={data} barGap={4} barCategoryGap="20%">
          <CartesianGrid vertical={false} stroke={gridStroke} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: tickFill, fontSize: 12 }}
          />
          <YAxis hide />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className={
                  isDark
                    ? '!bg-[#0e2318] !border-white/10 !text-slate-200 [&_.text-muted-foreground]:!text-slate-400 [&_.text-foreground]:!text-white'
                    : ''
                }
              />
            }
          />
          <ChartLegend
            content={
              <ChartLegendContent
                className={isDark ? 'text-slate-300 [&>*]:text-slate-300' : ''}
              />
            }
          />
          <Bar
            dataKey="income"
            fill="var(--color-income)"
            radius={[6, 6, 2, 2]}
            activeBar={{ fill: isDark ? '#34d399' : '#059669' }}
          />
          <Bar
            dataKey="expenses"
            fill="var(--color-expenses)"
            radius={[6, 6, 2, 2]}
            activeBar={{ fill: isDark ? '#f87171' : '#b91c1c' }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
