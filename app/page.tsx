'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Activity,
  BarChart3,
  MapPin,
  ShoppingCart,
  Wifi,
  Smartphone,
} from 'lucide-react'

const features = [
  {
    icon: '🐄',
    title: 'Registre cheptel',
    description: 'Identifiez chaque animal : espèce, race, âge, santé, valeur FCFA. Retrouvez n\'importe quelle bête en 2 secondes.',
    color: 'border-[#D4AF37]/30 bg-[#D4AF37]/5',
  },
  {
    icon: '💉',
    title: 'Suivi santé & vaccinations',
    description: 'Calendrier vaccinal automatique. Alertes avant les retards. Historique complet par animal.',
    color: 'border-[#00BCD4]/30 bg-[#00BCD4]/5',
  },
  {
    icon: '💰',
    title: 'Gestion des ventes',
    description: 'Enregistrez chaque transaction. Suivez vos revenus mensuels en FCFA. Bilans par espèce.',
    color: 'border-green-500/30 bg-green-500/5',
  },
  {
    icon: '📊',
    title: 'Prix marché temps réel',
    description: 'Cours du bétail sur les marchés sahéliens. Vendez au bon moment, au bon prix.',
    color: 'border-purple-500/30 bg-purple-500/5',
  },
]

const stats = [
  { label: 'Zone sahélienne', value: '🌍', sub: 'Burkina · Mali · Niger · Sénégal' },
  { label: 'Offline-first', value: '📶', sub: 'Fonctionne sans réseau' },
  { label: 'Multi-espèces', value: '🐄🐑🐐', sub: 'Bovins · Ovins · Caprins' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐄</span>
          <span className="font-bold text-lg text-[#D4AF37]">LivestockOS</span>
        </div>
        <Link href="/dashboard">
          <Button size="sm">Accéder à l&apos;app</Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 100 }}
        >
          <Badge className="mb-6 bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 text-sm px-4 py-1.5">
            🐄 LivestockOS — Gestion d&apos;élevage sahélien
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Connaissez chaque bête.{' '}
            <span className="text-[#D4AF37]">Gérez tout votre troupeau.</span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
            Enregistrement, santé, ventes — mobile-first, offline-ready.
            Conçu pour les éleveurs sahéliens, fonctionne même sans réseau.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto text-base px-8">
                Démarrer maintenant
              </Button>
            </Link>
            <Link href="/cheptel">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
                Voir le registre
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 80, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16"
        >
          {stats.map((s, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="text-3xl mb-2">{s.value}</div>
              <div className="font-semibold text-[#D4AF37]">{s.label}</div>
              <div className="text-sm text-white/50 mt-1">{s.sub}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ type: 'spring' as const, stiffness: 80 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Tout ce dont un éleveur a besoin
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring' as const, stiffness: 100, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-xl border p-6 ${f.color}`}
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Mobile-first callout */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 80 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-[#00BCD4]/20 bg-[#00BCD4]/5 p-10 text-center"
        >
          <div className="flex justify-center gap-6 mb-6 text-4xl">
            <Smartphone className="text-[#00BCD4] w-10 h-10" />
            <Wifi className="text-[#D4AF37] w-10 h-10" />
            <MapPin className="text-white/40 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3">
            Pensé pour le terrain
          </h2>
          <p className="text-white/60 max-w-lg mx-auto">
            Interface ultra-simple. Fonctionne sur téléphone 4G ou 2G,
            et même complètement offline — vos données se synchronisent
            dès que le réseau revient.
          </p>
          <Link href="/dashboard" className="inline-block mt-8">
            <Button size="lg">Commencer gratuitement</Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 text-center text-white/30 text-sm">
        <p>© 2026 LivestockOS · FORGE Afrika · Gestion d&apos;élevage sahélien mobile-first</p>
      </footer>
    </div>
  )
}
