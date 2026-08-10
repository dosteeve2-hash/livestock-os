'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const CHEPTEL_DATA = [
  { mois: 'Mar', bovins: 38, ovins: 20, caprins: 12 },
  { mois: 'Avr', bovins: 40, ovins: 22, caprins: 13 },
  { mois: 'Mai', bovins: 42, ovins: 24, caprins: 14 },
  { mois: 'Jun', bovins: 44, ovins: 23, caprins: 15 },
  { mois: 'Jul', bovins: 43, ovins: 25, caprins: 15 },
  { mois: 'Aoû', bovins: 45, ovins: 26, caprins: 16 },
]

const VENTES_DATA = [
  { mois: 'Mar', montant: 320 },
  { mois: 'Avr', montant: 480 },
  { mois: 'Mai', montant: 290 },
  { mois: 'Jun', montant: 610 },
  { mois: 'Jul', montant: 570 },
  { mois: 'Aoû', montant: 420 },
]

const VACCINS_A_VENIR = [
  { animal: 'BV-004', vaccin: 'Fièvre aphteuse', date: '15 août', urgence: false },
  { animal: 'OV-007', vaccin: 'Brucellose', date: '20 août', urgence: false },
  { animal: 'BV-001', vaccin: 'Rappel charbon', date: '28 août', urgence: true },
]

const TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: '#0c1a34', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, color: 'white', fontSize: 11 },
  labelStyle: { color: '#D4AF37' },
}

interface Props {
  prenom: string
  stats: { label: string; value: string; icon: string; color: string; detail: string }[]
  alertes: { icon: string; msg: string; urgence: string }[]
  mouvements: { animal: string; type: string; montant: number; date: string }[]
}

export default function DashboardClient({ prenom, stats, alertes, mouvements }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Salutation */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">
          Bonjour, <span className="text-[#D4AF37]">{prenom}</span> 👋
        </h1>
        <p className="text-white/50 text-sm mt-1">Tableau de bord élevage</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{s.icon}</span>
              <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
            </div>
            <div className="text-white/70 text-xs font-medium">{s.label}</div>
            <div className="text-white/40 text-[11px] mt-0.5">{s.detail}</div>
          </div>
        ))}
      </div>

      {/* Chart cheptel */}
      {mounted && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wide mb-3">Évolution cheptel</p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={CHEPTEL_DATA}>
              <defs>
                <linearGradient id="bovins" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ovins" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00BCD4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="mois" tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="bovins" stroke="#D4AF37" fill="url(#bovins)" strokeWidth={2} name="Bovins" />
              <Area type="monotone" dataKey="ovins" stroke="#00BCD4" fill="url(#ovins)" strokeWidth={2} name="Ovins" />
              <Area type="monotone" dataKey="caprins" stroke="#a78bfa" fill="none" strokeWidth={1.5} strokeDasharray="4 2" name="Caprins" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart ventes */}
      {mounted && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wide mb-3">Ventes (k FCFA)</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={VENTES_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="mois" tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}k`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [`${v}k FCFA`, 'Ventes']} />
              <Bar dataKey="montant" fill="#D4AF37" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Alertes */}
      <div className="mb-6">
        <h2 className="text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">Alertes sanitaires</h2>
        <div className="space-y-2">
          {alertes.map((a, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${
              a.urgence === 'haute' ? 'bg-red-500/10 border-red-500/20'
              : a.urgence === 'info' ? 'bg-[#00BCD4]/10 border-[#00BCD4]/20'
              : 'bg-white/5 border-white/10'
            }`}>
              <span className="text-base mt-0.5">{a.icon}</span>
              <span className="text-white/80 text-xs leading-relaxed">{a.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vaccinations à venir */}
      <div className="mb-6">
        <h2 className="text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">Vaccinations à venir</h2>
        <div className="space-y-2">
          {VACCINS_A_VENIR.map((v, i) => (
            <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div>
                <span className="text-white font-medium text-sm">{v.animal}</span>
                <span className="text-white/50 text-xs ml-2">{v.vaccin}</span>
              </div>
              <div className="flex items-center gap-2">
                {v.urgence && <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />}
                <span className="text-white/50 text-xs">{v.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Derniers mouvements */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#D4AF37] font-semibold text-xs uppercase tracking-wide">Derniers mouvements</h2>
          <Link href="/dashboard/mouvements" className="text-[#00BCD4] text-xs">Voir tout →</Link>
        </div>
        <div className="space-y-2">
          {mouvements.map((m, i) => (
            <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div>
                <span className="text-white font-medium text-sm">{m.animal}</span>
                <span className="text-white/50 text-xs ml-2">{m.type}</span>
              </div>
              <div className="text-right">
                {m.montant > 0 && (
                  <div className="text-[#D4AF37] text-sm font-semibold">{m.montant.toLocaleString('fr-FR')} F</div>
                )}
                <div className="text-white/40 text-xs">{m.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">Actions rapides</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: '/dashboard/animaux',   label: '+ Ajouter animal',      icon: '🐄' },
            { href: '/dashboard/sante',     label: '+ Soin / vaccin',       icon: '🩺' },
            { href: '/dashboard/mouvements',label: '+ Enregistrer vente',   icon: '💰' },
            { href: '/dashboard/marche',    label: 'Prix du marché',         icon: '📊' },
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all">
              <span className="text-xl">{a.icon}</span>
              <span className="text-white/80 text-xs font-medium">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
