import type { Metadata } from 'next'
import './globals.css'
import { switzer } from './fonts'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Budgetly',
  description: 'Personal budgeting app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${switzer.className} bg-gray-200`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
