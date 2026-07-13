'use client'

import { motion } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertTriangle,
  TrendingUp,
  Activity,
  ShoppingCart,
  Info,
} from 'lucide-react'

const MOCK_STATS = {
  totalAnimaux: 143,
  bovins: 45,
  ovins: 72,
  caprins: 26,
  valeurEstimee: 42500000,
  vaccinationsEnRetard: 8,
  ventesThisMonth: 5,
  revenuMois: 3200000,
}

const MOCK_ALERTES = [
  {
    type: 'vaccination',
    message: '8 animaux — vaccination Newcastle en retard',
    urgence: 'haute',
    date: '2026-07-12',
  },
  {
    type: 'sante',
    message: 'Bovin #BV-023 — symptômes respiratoires signalés',
    urgence: 'haute',
    date: '2026-07-13',
  },
  {
    type: 'marche',
    message: 'Prix bovin en hausse de 12% — bon moment pour vendre',
    urgence: 'info',
    date: '2026-07-13',
  },
]

const DONUT_DATA = [
  { name: 'Bovins', value: 45, color: '#D4AF37' },
  { name: 'Ovins', value: 72, color: '#00BCD4' },
  { name: 'Caprins', value: 26, color: '#a78bfa' },
]

function formatFCFA(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

const statCards = [
  {
    label: 'Total animaux',
    value: MOCK_STATS.totalAnimaux.toString(),
    sub: `${MOCK_STATS.bovins} bovins · ${MOCK_STATS.ovins} ovins · ${MOCK_STATS.caprins} caprins`,
    icon: '🐄',
    color: 'border-[#D4AF37]/20',
  },
  {
    label: 'Valeur estimée',
    value: formatFCFA(MOCK_STATS.valeurEstimee),
    sub: 'Valeur marché troupeau',
    icon: '💰',
    color: 'border-green-500/20',
  },
  {
    label: 'Vaccinations retard',
    value: MOCK_STATS.vaccinationsEnRetard.toString(),
    sub: 'Animaux à vacciner d\'urgence',
    icon: '💉',
    color: 'border-red-500/20',
  },
  {
    label: 'Revenu ce mois',
    value: formatFCFA(MOCK_STATS.revenuMois),
    sub: `${MOCK_STATS.ventesThisMonth} ventes ce mois`,
    icon: '📈',
    color: 'border-[#00BCD4]/20',
  },
]

export default function DashboardClient() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 120 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
        <p className="text-white/50 text-sm mt-1">13 juillet 2026 — Vue d&apos;ensemble du troupeau</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, stiffness: 100, delay: i * 0.08 }}
          >
            <Card className={`border ${card.color}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/50 uppercase tracking-wide mb-1">{card.label}</p>
                    <p className="text-xl font-bold text-white leading-tight truncate">{card.value}</p>
                    <p className="text-xs text-white/40 mt-1">{card.sub}</p>
                  </div>
                  <span className="text-2xl ml-2 flex-shrink-0">{card.icon}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts + Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring' as const, stiffness: 80, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-white/80">Répartition du troupeau</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={DONUT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {DONUT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0d1e36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {DONUT_DATA.map((d) => (
                  <div key={d.name} className="text-center">
                    <div className="text-lg font-bold" style={{ color: d.color }}>{d.value}</div>
                    <div className="text-xs text-white/40">{d.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alertes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring' as const, stiffness: 80, delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-white/80">Alertes sanitaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {MOCK_ALERTES.map((alerte, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring' as const, stiffness: 100, delay: 0.4 + i * 0.1 }}
                  className={`flex items-start gap-3 rounded-lg p-3 border ${
                    alerte.urgence === 'haute'
                      ? 'border-red-500/20 bg-red-500/5'
                      : 'border-[#00BCD4]/20 bg-[#00BCD4]/5'
                  }`}
                >
                  <span className="mt-0.5 flex-shrink-0">
                    {alerte.urgence === 'haute'
                      ? <AlertTriangle className="w-4 h-4 text-red-400" />
                      : <Info className="w-4 h-4 text-[#00BCD4]" />
                    }
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 leading-snug">{alerte.message}</p>
                    <p className="text-xs text-white/30 mt-1">{alerte.date}</p>
                  </div>
                  <Badge variant={alerte.urgence === 'haute' ? 'danger' : 'info'} className="flex-shrink-0 text-xs">
                    {alerte.urgence}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
