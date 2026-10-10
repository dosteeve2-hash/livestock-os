import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ÉlevageTrack — Gestion d\'élevage sahélien',
  description: 'Application mobile de gestion d\'élevage pour éleveurs sahéliens. Suivi du cheptel, santé animale, mouvements et prix du marché.',
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
  themeColor: '#0A1628',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#0A1628] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
