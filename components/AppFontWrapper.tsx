'use client'

const FONTS = [
  { key: 'a', variable: '--font-a' },
] as const

type Props = {
  children: React.ReactNode
  fontVariables: string
}

export function AppFontWrapper({ children, fontVariables }: Props) {
  const activeVar = FONTS.find(f => f.key === 'a')!.variable

  return (
    <div
      className={fontVariables}
      style={{ fontFamily: `var(${activeVar})` }}
    >
      {children}
    </div>
  )
}
