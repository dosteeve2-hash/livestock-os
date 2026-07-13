'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  PawPrint,
  HeartPulse,
  ArrowLeftRight,
  TrendingUp,
  BarChart3,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cheptel', label: 'Cheptel', icon: PawPrint },
  { href: '/sante', label: 'Santé', icon: HeartPulse },
  { href: '/mouvements', label: 'Mouvements', icon: ArrowLeftRight },
  { href: '/marche', label: 'Marché', icon: TrendingUp },
  { href: '/rapports', label: 'Rapports', icon: BarChart3 },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#0A1628] overflow-hidden">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#060e1a]">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <span className="text-2xl">🐄</span>
          <div>
            <div className="font-bold text-[#D4AF37] leading-tight">LivestockOS</div>
            <div className="text-xs text-white/40">Gestion d&apos;élevage</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-6 py-4 border-t border-white/10">
          <div className="text-xs text-white/30">FORGE Afrika · v1.0</div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#060e1a] border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐄</span>
          <span className="font-bold text-[#D4AF37]">LivestockOS</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/70 hover:text-white">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
          className="md:hidden fixed inset-0 z-40 bg-[#060e1a] pt-16"
        >
          <nav className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all',
                    active
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </motion.div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">
        {children}
      </main>
    </div>
  )
}
