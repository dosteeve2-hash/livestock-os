import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LivestockOS — Le carnet du berger, devenu numérique',
  description: 'Un registre numérique pour suivre le cheptel, les soins et les ventes, et publier un passeport de suivi vérifiable.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
  keywords: ['élevage', 'bétail', 'Burkina Faso', 'sahel', 'cheptel', 'bovin', 'ovin', 'caprin'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#F3EDDF',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  )
}
