import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

const NAV = [
  { href: '/dashboard', label: 'Accueil', icon: '🏠' },
  { href: '/dashboard/cheptel', label: 'Cheptel', icon: '🐄' },
  { href: '/dashboard/sante', label: 'Santé', icon: '🩺' },
  { href: '/dashboard/mouvements', label: 'Mouvements', icon: '🚛' },
  { href: '/dashboard/marche', label: 'Marché', icon: '📊' },
  { href: '/dashboard/parametres', label: 'Paramètres', icon: '⚙️' },
]

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const isDemo = user.email === 'demo@livestockos.app'

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col">
      {/* Bannière démo */}
      {isDemo && (
        <div className="bg-[#00BCD4]/20 border-b border-[#00BCD4]/30 px-4 py-2 text-center">
          <span className="text-[#00BCD4] text-xs font-medium">
            🎯 Mode démo — Données fictives · Compte demo@livestockos.app
          </span>
        </div>
      )}

      {/* Header mobile */}
      <header className="sticky top-0 z-40 bg-[#0A1628]/95 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐄</span>
          <span className="font-bold text-[#D4AF37] text-base">LivestockOS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-xs hidden sm:block">
            {user.email}
          </span>
          <LogoutButton />
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 pb-24">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A1628]/98 backdrop-blur border-t border-white/10">
        <div className="grid grid-cols-6 px-1 py-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[10px] text-white/50 group-hover:text-[#D4AF37] transition-colors leading-none text-center">
                {item.label.split(' ')[0]}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
