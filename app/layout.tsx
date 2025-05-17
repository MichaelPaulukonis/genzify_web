import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'genzify',
  description: 'Translate your text to Gen Z slang',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
