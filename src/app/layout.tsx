import type { Metadata } from 'next'
import './globals.css';
import { MarketplaceProvider } from '@/components/providers/Marketplace';

export const metadata: Metadata = {
  title: 'Sitecore Marketplace Extensions',
  description: 'Sitecore Marketplace extension starter application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <MarketplaceProvider>
          {children}
        </MarketplaceProvider>
      </body>
    </html>
  )
}
