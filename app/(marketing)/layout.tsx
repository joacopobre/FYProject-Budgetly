import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair',
})
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div id="font-root" className={`${playfair.variable} ${inter.variable}`}>
      {children}
    </div>
  )
}
