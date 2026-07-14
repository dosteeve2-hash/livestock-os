'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type TypeSoin = 'Vaccination' | 'Traitement' | 'Contrôle'
type StatutSoin = 'Planifié' | 'En cours' | 'Fait'

interface Soin {
  id: string
  date: string
  animal: string
  groupe: string
  type: TypeSoin
  description: string
  veterinaire: string
  cout: number
  statut: StatutSoin
  prochaine?: string
}

// ─── Données mock ─────────────────────────────────────────────────────────────

const MOCK_SOINS: Soin[] = [
  {
    id: '1', date: '2026-07-14', animal: 'BV-001', groupe: 'Bovins',
    type: 'Vaccination', description: 'Fièvre aphteuse',
    veterinaire: 'Dr Konaté', cout: 15000, statut: 'Fait', prochaine: '2026-12-14',
  },
  {
    id: '2', date: '2026-07-10', animal: 'OV-003', groupe: 'Ovins',
    type: 'Traitement', description: 'Parasites intestinaux — Albendazole',
    veterinaire: 'Dr Diallo', cout: 8500, statut: 'En cours', prochaine: '2026-07-17',
  },
  {
    id: '3', date: '2026-07-01', animal: 'BV-002', groupe: 'Bovins',
    type: 'Vaccination', description: 'Charbon bactéridien',
    veterinaire: 'Dr Konaté', cout: 12000, statut: 'Fait', prochaine: '2026-11-20',
  },
  {
    id: '4', date: '2026-07-18', animal: 'CP-001', groupe: 'Caprins',
    type: 'Vaccination', description: 'Pasteurellose',
    veterinaire: 'Dr Traoré', cout: 9000, statut: 'Planifié',
  },
  {
    id: '5', date: '2026-07-16', animal: 'OV-001', groupe: 'Ovins',
    type: 'Vaccination', description: 'Clavelée',
    veterinaire: 'Dr Diallo', cout: 7500, statut: 'Planifié',
  },
  {
    id: '6', date: '2026-07-20', animal: 'BV-003', groupe: 'Bovins',
    type: 'Contrôle', description: 'Bilan mensuel de santé',
    veterinaire: 'Dr Konaté', cout: 5000, statut: 'Planifié',
  },
  {
    id: '7', date: '2026-07-05', animal: 'CP-002', groupe: 'Caprins',
    type: 'Traitement', description: 'Gale — Ivermectine',
    veterinaire: 'Dr Traoré', cout: 6000, statut: 'Fait',
  },
]

// Animaux malades (statut En cours avec traitement)
const ANIMAUX_MALADES = MOCK_SOINS.filter(
  s => s.statut === 'En cours' && s.type === 'Traitement',
)

// Vaccinations dans les 7 prochains jours
const AUJOURDHUI = new Date('2026-07-14')
const DANS_7J = new Date('2026-07-21')
const VACCINS_A_VENIR = MOCK_SOINS.filter(s => {
  if (s.statut === 'Fait') return false
  const d = new Date(s.date)
  return d >= AUJOURDHUI && d <= DANS_7J
})

// Stats mois courant (juillet 2026)
const SOINS_CE_MOIS = MOCK_SOINS.filter(s => s.date.startsWith('2026-07'))
const COUT_TOTAL = SOINS_CE_MOIS.reduce((acc, s) => acc + s.cout, 0)
const NB_MORTS = 0
const NB_TOTAL_ANIMAUX = 12
const TAUX_MORTALITE = ((NB_MORTS / NB_TOTAL_ANIMAUX) * 100).toFixed(1)

// ─── Utils ────────────────────────────────────────────────────────────────────

const TYPES_ICONS: Record<TypeSoin, string> = {
  Vaccination: '💉',
  Traitement: '💊',
  Contrôle: '🩺',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function joursRestants(d: string) {
  const diff = new Date(d).getTime() - AUJOURDHUI.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

function StatutBadge({ statut }: { statut: StatutSoin }) {
  const cfg: Record<StatutSoin, string> = {
    Fait: 'bg-green-500/20 text-green-400 border-green-500/30',
    'En cours': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Planifié: 'bg-[#00BCD4]/20 text-[#00BCD4] border-[#00BCD4]/30',
  }
  return (
    <span className={`text-[10px] border px-2 py-0.5 rounded-full ${cfg[statut]}`}>
      {statut}
    </span>
  )
}

// ─── Modal Ajouter soin ───────────────────────────────────────────────────────

interface FormSoin {
  date: string
  animal: string
  type: TypeSoin
  description: string
  veterinaire: string
  cout: string
}

function ModalAjouterSoin({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<FormSoin>({
    date: '2026-07-14',
    animal: '',
    type: 'Vaccination',
    description: '',
    veterinaire: '',
    cout: '',
  })

  function handle(k: keyof FormSoin, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    // En production : appel Supabase
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring' as const, damping: 20 }}
        className="w-full max-w-md bg-[#0D1E36] border border-white/10 rounded-2xl p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#D4AF37] font-bold text-lg">+ Enregistrer un soin</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">×</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="text-white/60 text-xs mb-1 block">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => handle('date', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              required
            />
          </div>

          {/* Animal / Groupe */}
          <div>
            <label className="text-white/60 text-xs mb-1 block">Animal ou groupe</label>
            <input
              type="text"
              placeholder="ex: BV-001, Troupeau ovin…"
              value={form.animal}
              onChange={e => handle('animal', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
              required
            />
          </div>

          {/* Type de soin */}
          <div>
            <label className="text-white/60 text-xs mb-1 block">Type de soin</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Vaccination', 'Traitement', 'Contrôle'] as TypeSoin[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handle('type', t)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    form.type === t
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                      : 'border-white/10 text-white/50 hover:border-white/30'
                  }`}
                >
                  {TYPES_ICONS[t]} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-white/60 text-xs mb-1 block">Description</label>
            <input
              type="text"
              placeholder="ex: Vaccin fièvre aphteuse…"
              value={form.description}
              onChange={e => handle('description', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
              required
            />
          </div>

          {/* Vétérinaire */}
          <div>
            <label className="text-white/60 text-xs mb-1 block">Vétérinaire</label>
            <input
              type="text"
              placeholder="ex: Dr Konaté"
              value={form.veterinaire}
              onChange={e => handle('veterinaire', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          {/* Coût */}
          <div>
            <label className="text-white/60 text-xs mb-1 block">Coût (FCFA)</label>
            <input
              type="number"
              placeholder="0"
              value={form.cout}
              onChange={e => handle('cout', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
              min="0"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#D4AF37] text-[#0A1628] font-bold rounded-xl text-sm hover:bg-[#D4AF37]/90 transition-colors mt-2"
          >
            Enregistrer
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function SantePage() {
  const [modal, setModal] = useState(false)

  return (
    <>
      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#D4AF37]">🩺 Santé animale</h1>
            <p className="text-white/50 text-sm mt-1">Soins, vaccinations et alertes</p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="bg-[#D4AF37] text-[#0A1628] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#D4AF37]/90 transition-colors"
          >
            + Soin
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, delay: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
          >
            <div className="text-xl font-bold text-[#D4AF37]">{SOINS_CE_MOIS.length}</div>
            <div className="text-white/50 text-[10px] mt-1">Soins ce mois</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, delay: 0.08 }}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
          >
            <div className="text-xl font-bold text-[#00BCD4]">
              {COUT_TOTAL.toLocaleString('fr-FR')}
            </div>
            <div className="text-white/50 text-[10px] mt-1">FCFA dépensés</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, delay: 0.16 }}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
          >
            <div className="text-xl font-bold text-green-400">{TAUX_MORTALITE}%</div>
            <div className="text-white/50 text-[10px] mt-1">Taux mortalité</div>
          </motion.div>
        </div>

        {/* Alertes */}
        {ANIMAUX_MALADES.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring' as const }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-3 flex items-center gap-3"
          >
            <span className="text-xl">🚨</span>
            <div>
              <span className="text-red-300 text-sm font-semibold">
                {ANIMAUX_MALADES.length} animal{ANIMAUX_MALADES.length > 1 ? 'x' : ''} malade{ANIMAUX_MALADES.length > 1 ? 's' : ''}
              </span>
              <div className="text-red-400/60 text-xs mt-0.5">
                {ANIMAUX_MALADES.map(a => a.animal).join(', ')}
              </div>
            </div>
          </motion.div>
        )}

        {VACCINS_A_VENIR.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring' as const, delay: 0.1 }}
            className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3 mb-5 flex items-center gap-3"
          >
            <span className="text-xl">⚠️</span>
            <div>
              <span className="text-orange-300 text-sm font-semibold">
                {VACCINS_A_VENIR.length} vaccination{VACCINS_A_VENIR.length > 1 ? 's' : ''} dans les 7 prochains jours
              </span>
              <div className="text-orange-400/60 text-xs mt-0.5">
                {VACCINS_A_VENIR.map(v => `${v.animal} — ${v.description}`).join(' · ')}
              </div>
            </div>
          </motion.div>
        )}

        {/* Calendrier vaccinations 7 jours */}
        {VACCINS_A_VENIR.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">
              📅 Prochaines 7 jours
            </h2>
            <div className="space-y-2">
              {VACCINS_A_VENIR.map(v => {
                const jours = joursRestants(v.date)
                return (
                  <div
                    key={v.id}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                  >
                    <span className="text-lg">{TYPES_ICONS[v.type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-semibold">{v.animal} — {v.description}</div>
                      <div className="text-white/40 text-[10px]">{v.veterinaire} · {formatDate(v.date)}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${
                      jours <= 2
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    }`}>
                      J-{jours}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Journal des soins */}
        <h2 className="text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">
          📋 Journal des soins
        </h2>
        <div className="space-y-3">
          {MOCK_SOINS.sort((a, b) => b.date.localeCompare(a.date)).map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' as const, delay: i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{TYPES_ICONS[s.type]}</span>
                  <div>
                    <span className="text-white font-semibold text-sm">{s.animal}</span>
                    <span className="text-white/40 text-xs ml-1">({s.groupe})</span>
                  </div>
                </div>
                <StatutBadge statut={s.statut} />
              </div>
              <div className="ml-8 space-y-1.5">
                <div className="text-white/80 text-xs font-medium">{s.type} · {s.description}</div>
                <div className="text-white/40 text-xs">👨‍⚕️ {s.veterinaire}</div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-white/40">
                    <span>📅 {formatDate(s.date)}</span>
                    {s.prochaine && (
                      <span className="text-[#00BCD4]">🔄 {formatDate(s.prochaine)}</span>
                    )}
                  </div>
                  <span className="text-[#D4AF37] text-xs font-semibold">
                    {s.cout.toLocaleString('fr-FR')} F
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bouton ajouter bas */}
        <div className="mt-6">
          <button
            onClick={() => setModal(true)}
            className="w-full py-4 border-2 border-dashed border-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-sm font-medium hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5 transition-all"
          >
            + Enregistrer un soin
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && <ModalAjouterSoin onClose={() => setModal(false)} />}
      </AnimatePresence>
    </>
  )
}
