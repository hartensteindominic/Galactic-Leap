import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Galactic Leap - Art Marketplace & Social Platform',
  description: 'Buy and sell art, connect with artists and collectors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
