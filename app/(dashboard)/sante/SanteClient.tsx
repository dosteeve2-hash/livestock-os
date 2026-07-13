'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, CheckCircle2, Clock, Plus, Syringe } from 'lucide-react'

type TypeEvenement = 'Maladie' | 'Vaccination' | 'Contrôle'
type Statut = 'En traitement' | 'À faire' | 'Fait'

interface EvenementSante {
  id: string
  animal: string
  espece: string
  type: TypeEvenement
  description: string
  veterinaire: string
  traitement: string
  dateDebut: string | null
  statut: Statut
}

interface VaccinationPrevue {
  espece: string
  vaccin: string
  animauxCibles: number
  datePrevue: string
  urgence: 'haute' | 'normale'
}

const MOCK_EVENEMENTS: EvenementSante[] = [
  {
    id: '1',
    animal: 'BV-023',
    espece: 'Bovin',
    type: 'Maladie',
    description: 'Symptômes respiratoires — toux, fièvre légère',
    veterinaire: 'Dr. Sawadogo',
    traitement: 'Pénicilline 5 jours',
    dateDebut: '2026-07-13',
    statut: 'En traitement',
  },
  {
    id: '2',
    animal: 'OV-002',
    espece: 'Ovin',
    type: 'Vaccination',
    description: 'Rappel vaccin Newcastle — en retard',
    veterinaire: 'À planifier',
    traitement: 'Vaccin Newcastle',
    dateDebut: null,
    statut: 'À faire',
  },
  {
    id: '3',
    animal: 'BV-001',
    espece: 'Bovin',
    type: 'Vaccination',
    description: 'FMD + CBPP',
    veterinaire: 'Dr. Sawadogo',
    traitement: 'Vaccin FMD',
    dateDebut: '2026-05-15',
    statut: 'Fait',
  },
  {
    id: '4',
    animal: 'CP-001',
    espece: 'Caprin',
    type: 'Contrôle',
    description: 'Pesée mensuelle + prise de sang',
    veterinaire: 'Dr. Ouédraogo',
    traitement: '-',
    dateDebut: '2026-07-10',
    statut: 'Fait',
  },
]

const MOCK_VACCINATIONS: VaccinationPrevue[] = [
  {
    espece: 'Ovin',
    vaccin: 'Newcastle',
    animauxCibles: 24,
    datePrevue: '2026-07-20',
    urgence: 'haute',
  },
  {
    espece: 'Bovin',
    vaccin: 'FMD rappel',
    animauxCibles: 12,
    datePrevue: '2026-08-15',
    urgence: 'normale',
  },
]

const TYPE_ICONS: Record<TypeEvenement, React.ReactNode> = {
  Maladie: <AlertTriangle className="w-4 h-4 text-red-400" />,
  Vaccination: <Syringe className="w-4 h-4 text-[#00BCD4]" />,
  Contrôle: <CheckCircle2 className="w-4 h-4 text-green-400" />,
}

const STATUT_BADGE: Record<Statut, 'danger' | 'warning' | 'success'> = {
  'En traitement': 'danger',
  'À faire': 'warning',
  'Fait': 'success',
}

const ESPECE_EMOJI: Record<string, string> = {
  Bovin: '🐄',
  Ovin: '🐑',
  Caprin: '🐐',
}

export default function SanteClient() {
  const [typeFilter, setTypeFilter] = useState<string>('Tous')
  const [statutFilter, setStatutFilter] = useState<string>('Tous')

  const filtered = MOCK_EVENEMENTS.filter((e) => {
    const matchType = typeFilter === 'Tous' || e.type === typeFilter
    const matchStatut = statutFilter === 'Tous' || e.statut === statutFilter
    return matchType && matchStatut
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 120 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Suivi sanitaire</h1>
          <p className="text-white/50 text-sm mt-1">Événements de santé du troupeau</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Signaler un problème
        </Button>
      </motion.div>

      {/* Vaccinations urgentes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 100, delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Syringe className="w-4 h-4 text-[#D4AF37]" />
          Vaccinations à planifier
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_VACCINATIONS.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring' as const, stiffness: 100, delay: 0.15 + i * 0.1 }}
              className={`rounded-xl border p-4 flex items-start gap-4 ${
                v.urgence === 'haute'
                  ? 'border-red-500/20 bg-red-500/5'
                  : 'border-[#D4AF37]/20 bg-[#D4AF37]/5'
              }`}
            >
              <span className="text-2xl">{ESPECE_EMOJI[v.espece] ?? '🐾'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white text-sm">{v.vaccin}</span>
                  <Badge variant={v.urgence === 'haute' ? 'danger' : 'warning'} className="text-xs">
                    {v.urgence}
                  </Badge>
                </div>
                <p className="text-xs text-white/50">{v.animauxCibles} animaux · {v.espece}</p>
                <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Prévu le {v.datePrevue}
                </p>
              </div>
              <Button size="sm" variant="outline" className="text-xs flex-shrink-0">
                Planifier
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-white/40 self-center mr-1">Type :</span>
          {(['Tous', 'Maladie', 'Vaccination', 'Contrôle'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                typeFilter === t
                  ? 'bg-[#D4AF37] text-[#0A1628]'
                  : 'bg-[#0d1e36] text-white/60 border border-white/10 hover:border-[#D4AF37]/30'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-white/40 self-center mr-1">Statut :</span>
          {(['Tous', 'À faire', 'En traitement', 'Fait'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatutFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statutFilter === s
                  ? 'bg-[#00BCD4] text-[#0A1628]'
                  : 'bg-[#0d1e36] text-white/60 border border-white/10 hover:border-[#00BCD4]/30'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">
          Timeline événements
        </h2>
        <AnimatePresence mode="popLayout">
          {filtered.map((evt, i) => (
            <motion.div
              key={evt.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring' as const, stiffness: 120, delay: i * 0.07 }}
            >
              <Card className="hover:border-white/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-8 h-8 rounded-full bg-[#0d1e36] border border-white/20 flex items-center justify-center flex-shrink-0">
                        {TYPE_ICONS[evt.type]}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">
                          {ESPECE_EMOJI[evt.espece]} {evt.animal}
                        </span>
                        <Badge variant="secondary" className="text-xs">{evt.type}</Badge>
                        <Badge variant={STATUT_BADGE[evt.statut]} className="text-xs">{evt.statut}</Badge>
                      </div>
                      <p className="text-sm text-white/70 mb-2">{evt.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-white/40">
                        <span>👨‍⚕️ {evt.veterinaire}</span>
                        <span>💊 {evt.traitement}</span>
                        {evt.dateDebut && <span>📅 {evt.dateDebut}</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <div className="text-4xl mb-3">✅</div>
          <p>Aucun événement pour ces filtres</p>
        </div>
      )}
    </div>
  )
}
