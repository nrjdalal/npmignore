import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/app/providers'

export const metadata: Metadata = {
  title: 'npmignore',
  description: 'npmignore - npm on steroids',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
