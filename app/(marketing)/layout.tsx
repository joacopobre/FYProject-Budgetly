import type { Metadata } from 'next'
import '../globals.css'
import { switzer } from '../fonts'

export const metadata: Metadata = {
  title: 'Budgetly',
  description: 'Personal budgeting app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={switzer.className}>
      <body>{children}</body>
    </html>
  )
}
