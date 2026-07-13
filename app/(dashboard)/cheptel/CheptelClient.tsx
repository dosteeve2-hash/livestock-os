'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Search, Filter } from 'lucide-react'

type Sante = 'Bon' | 'Attention' | 'Mauvais'
type Espece = 'Bovin' | 'Ovin' | 'Caprin'

interface Animal {
  id: string
  espece: Espece
  race: string
  sexe: string
  age: string
  poids: string
  valeur: number
  sante: Sante
  dernierVaccin: string
  localisation: string
  tag: string
}

const MOCK_ANIMAUX: Animal[] = [
  { id: 'BV-001', espece: 'Bovin', race: 'Zébu Peul', sexe: 'Mâle', age: '3 ans', poids: '285 kg', valeur: 525000, sante: 'Bon', dernierVaccin: '2026-05-15', localisation: 'Pâturage Nord', tag: 'Boucle auriculaire #A012' },
  { id: 'BV-002', espece: 'Bovin', race: 'Zébu Peul', sexe: 'Femelle', age: '4 ans', poids: '220 kg', valeur: 420000, sante: 'Bon', dernierVaccin: '2026-05-15', localisation: 'Pâturage Nord', tag: '#A013' },
  { id: 'BV-023', espece: 'Bovin', race: 'Zébu Peul', sexe: 'Mâle', age: '2 ans', poids: '195 kg', valeur: 350000, sante: 'Mauvais', dernierVaccin: '2025-11-10', localisation: 'Enclos 1', tag: '#A023' },
  { id: 'OV-001', espece: 'Ovin', race: 'Mouton Sahélien', sexe: 'Mâle', age: '1 an', poids: '35 kg', valeur: 65000, sante: 'Bon', dernierVaccin: '2026-04-20', localisation: 'Enclos 2', tag: '#O001' },
  { id: 'OV-002', espece: 'Ovin', race: 'Mouton Sahélien', sexe: 'Femelle', age: '2 ans', poids: '42 kg', valeur: 75000, sante: 'Attention', dernierVaccin: '2025-12-10', localisation: 'Enclos 2', tag: '#O002' },
  { id: 'CP-001', espece: 'Caprin', race: 'Chèvre Sahélienne', sexe: 'Femelle', age: '3 ans', poids: '28 kg', valeur: 45000, sante: 'Bon', dernierVaccin: '2026-06-01', localisation: 'Enclos 3', tag: '#C001' },
]

const ESPECE_EMOJI: Record<Espece, string> = {
  Bovin: '🐄',
  Ovin: '🐑',
  Caprin: '🐐',
}

const SANTE_BADGE: Record<Sante, 'success' | 'warning' | 'danger'> = {
  Bon: 'success',
  Attention: 'warning',
  Mauvais: 'danger',
}

function formatFCFA(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

export default function CheptelClient() {
  const [especeFilter, setEspeceFilter] = useState<string>('Tous')
  const [santeFilter, setSanteFilter] = useState<string>('Tous')
  const [search, setSearch] = useState('')

  const filtered = MOCK_ANIMAUX.filter((a) => {
    const matchEspece = especeFilter === 'Tous' || a.espece === especeFilter
    const matchSante = santeFilter === 'Tous' || a.sante === santeFilter
    const matchSearch = search === '' || a.id.toLowerCase().includes(search.toLowerCase()) || a.race.toLowerCase().includes(search.toLowerCase())
    return matchEspece && matchSante && matchSearch
  })

  const bovins = MOCK_ANIMAUX.filter((a) => a.espece === 'Bovin').length
  const ovins = MOCK_ANIMAUX.filter((a) => a.espece === 'Ovin').length
  const caprins = MOCK_ANIMAUX.filter((a) => a.espece === 'Caprin').length

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
          <h1 className="text-2xl font-bold text-white">Registre du cheptel</h1>
          <p className="text-white/50 text-sm mt-1">{MOCK_ANIMAUX.length} animaux enregistrés</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter animal
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: MOCK_ANIMAUX.length, emoji: '🐾' },
          { label: 'Bovins', value: bovins, emoji: '🐄' },
          { label: 'Ovins', value: ovins, emoji: '🐑' },
          { label: 'Caprins', value: caprins, emoji: '🐐' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' as const, stiffness: 100, delay: i * 0.07 }}
            className="rounded-xl border border-white/10 bg-[#0d1e36] p-4 text-center"
          >
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Rechercher par ID ou race…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0d1e36] border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['Tous', 'Bovin', 'Ovin', 'Caprin'] as const).map((e) => (
            <button
              key={e}
              onClick={() => setEspeceFilter(e)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                especeFilter === e
                  ? 'bg-[#D4AF37] text-[#0A1628]'
                  : 'bg-[#0d1e36] text-white/60 border border-white/10 hover:border-[#D4AF37]/30'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['Tous', 'Bon', 'Attention', 'Mauvais'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSanteFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                santeFilter === s
                  ? 'bg-[#00BCD4] text-[#0A1628]'
                  : 'bg-[#0d1e36] text-white/60 border border-white/10 hover:border-[#00BCD4]/30'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Animal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((animal, i) => (
            <motion.div
              key={animal.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring' as const, stiffness: 120, delay: i * 0.05 }}
            >
              <Card className="hover:border-[#D4AF37]/30 transition-colors cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{ESPECE_EMOJI[animal.espece]}</span>
                      <div>
                        <div className="font-bold text-white text-sm">{animal.id}</div>
                        <div className="text-xs text-white/40">{animal.race}</div>
                      </div>
                    </div>
                    <Badge variant={SANTE_BADGE[animal.sante]}>{animal.sante}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-white/40">Sexe : </span>
                      <span className="text-white/80">{animal.sexe}</span>
                    </div>
                    <div>
                      <span className="text-white/40">Âge : </span>
                      <span className="text-white/80">{animal.age}</span>
                    </div>
                    <div>
                      <span className="text-white/40">Poids : </span>
                      <span className="text-white/80">{animal.poids}</span>
                    </div>
                    <div>
                      <span className="text-white/40">Tag : </span>
                      <span className="text-white/80">{animal.tag}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-white/40">📍 {animal.localisation}</span>
                    <span className="font-semibold text-[#D4AF37] text-sm">{formatFCFA(animal.valeur)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <div className="text-4xl mb-3">🔍</div>
          <p>Aucun animal trouvé avec ces filtres</p>
        </div>
      )}
    </div>
  )
}
