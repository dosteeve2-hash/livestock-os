'use client'

import type { CSSProperties } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

type ValeurPoint = {
  mois: string
  valeur: number
}

type VenteAchat = {
  mois: string
  ventes: number
  achats: number
}

const DATA_VALEUR_TROUPEAU: ValeurPoint[] = [
  { mois: 'Août', valeur: 10.2 },
  { mois: 'Sep', valeur: 10.8 },
  { mois: 'Oct', valeur: 11.1 },
  { mois: 'Nov', valeur: 11.5 },
  { mois: 'Déc', valeur: 11.0 },
  { mois: 'Jan', valeur: 11.3 },
  { mois: 'Fév', valeur: 11.8 },
  { mois: 'Mar', valeur: 12.1 },
  { mois: 'Avr', valeur: 12.4 },
  { mois: 'Mai', valeur: 12.0 },
  { mois: 'Jun', valeur: 12.2 },
  { mois: 'Jul', valeur: 12.4 },
]

const DATA_VENTES_ACHATS: VenteAchat[] = [
  { mois: 'Fév', ventes: 320, achats: 180 },
  { mois: 'Mar', ventes: 450, achats: 200 },
  { mois: 'Avr', ventes: 280, achats: 420 },
  { mois: 'Mai', ventes: 520, achats: 150 },
  { mois: 'Jun', ventes: 380, achats: 320 },
  { mois: 'Jul', ventes: 570, achats: 488 },
]

const TOOLTIP_STYLE: CSSProperties = {
  backgroundColor: '#0A1628',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '12px',
}

const TICK_STYLE = { fill: 'rgba(255,255,255,0.4)', fontSize: 10 }

export function ValeurTroupeauChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={DATA_VALEUR_TROUPEAU}
        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="mois"
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}M`}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(v) => [`${v}M FCFA`, 'Valeur troupeau']}
        />
        <Line
          type="monotone"
          dataKey="valeur"
          stroke="#D4AF37"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: '#D4AF37' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function VentesAchatsChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={DATA_VENTES_ACHATS}
        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="mois"
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}K`}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(v, name) => [
            `${Number(v).toLocaleString('fr-FR')}K FCFA`,
            name === 'ventes' ? 'Ventes' : 'Achats',
          ]}
        />
        <Legend
          wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}
          formatter={(value) => (value === 'ventes' ? 'Ventes' : 'Achats')}
        />
        <Bar dataKey="ventes" fill="#D4AF37" radius={[4, 4, 0, 0]} />
        <Bar dataKey="achats" fill="#00BCD4" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
