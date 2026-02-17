export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="bg-gray-200 text-black">{children}</div>
}
