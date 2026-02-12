import type { Metadata } from 'next'
import '../globals.css'
import { switzer } from '../fonts'
import Link from 'next/link'

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
    <html className='bg-gray-200' >
      <body >
        <div id="wrapper" className="flex flex-col text-black">
          <nav className="flex gap-10 bg-white px-10 text-black justify-center py-5">
            <Link href="/dashboard">dashboard</Link>
            <Link href="/transactions">transactions</Link>
          </nav>
          <main className='bg-gray-200'>{children}</main>
        </div>
      </body>
    </html>
  )
}
