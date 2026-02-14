import type { Metadata } from 'next'
import '../globals.css'
import { switzer } from '../fonts'
import AppNav from '@/components/AppNav'

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
    <html className="bg-gray-200">
      <body className={switzer.className}>
        <div id="wrapper" className="flex min-h-screen flex-col text-black">
          <AppNav />
          <main className="bg-gray-200 pt-24">{children}</main>
        </div>
      </body>
    </html>
  )
}
