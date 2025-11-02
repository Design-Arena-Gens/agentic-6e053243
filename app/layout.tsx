import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Facebook Hindi Video Uploader',
  description: 'Upload videos to Facebook with AI-generated Hindi voiceovers',
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
