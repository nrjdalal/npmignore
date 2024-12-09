import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/app/providers'
import { fontMono, fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-dvh font-sans antialiased',
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
