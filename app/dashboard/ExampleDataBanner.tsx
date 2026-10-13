'use client'

import { usePathname } from 'next/navigation'

const EXAMPLE_ROUTES = [
  '/dashboard/marche',
  '/dashboard/mouvements',
  '/dashboard/rapports',
]

export default function ExampleDataBanner() {
  const pathname = usePathname()
  if (!EXAMPLE_ROUTES.some((route) => pathname.startsWith(route))) return null

  return (
    <div
      role="note"
      className="mb-4 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-3 text-xs text-white/70"
    >
      <strong className="text-[#D4AF37]">Données d&apos;exemple.</strong> Les prix, mouvements,
      incidents et courbes de cette page sont fictifs : ils illustrent le module et ne reflètent
      pas votre troupeau. Seuls les animaux, soins et ventes que vous saisissez sont les vôtres.
    </div>
  )
}
