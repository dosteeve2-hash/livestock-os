'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import { useCollection } from '@/lib/store/useCollection'
import { ANIMAUX_SEED, VENTES_SEED } from '@/lib/store/seed'
import {
  COLLECTIONS,
  type Animal,
  type ModePaiement,
  type Vente,
} from '@/lib/store/types'
import { nextId } from '@/lib/store/store'
import { useUserId } from '../UserContext'

const PAIEMENTS: ModePaiement[] = ['Espèces', 'Orange Money', 'Moov Money', 'Crédit']

const PAIEMENT_STYLES: Record<ModePaiement, string> = {
  'Espèces': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Orange Money': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Moov Money': 'bg-[#00BCD4]/20 text-[#00BCD4] border-[#00BCD4]/30',
  'Crédit': 'bg-red-500/20 text-red-400 border-red-500/30',
}

const ICONS: Record<Animal['espece'], string> = {
  Bovin: '🐄',
  Ovin: '🐑',
  Caprin: '🐐',
  Volaille: '🐔',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function moisCourt(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'short' })
}

// ─── Modal Enregistrer une vente ──────────────────────────────────────────────

interface FormVente {
  animalId: string
  acheteur: string
  date: string
  prix: string
  paiement: ModePaiement
}

function ModalVendre({
  cheptel,
  onClose,
  onSell,
}: {
  cheptel: Animal[]
  onClose: () => void
  onSell: (vente: Vente) => void
}) {
  const [form, setForm] = useState<FormVente>({
    animalId: cheptel[0]?.id ?? '',
    acheteur: '',
    date: new Date().toISOString().slice(0, 10),
    prix: cheptel[0] ? String(cheptel[0].valeur) : '',
    paiement: 'Espèces',
  })

  const animal = cheptel.find((a) => a.id === form.animalId)

  function choisirAnimal(id: string) {
    const cible = cheptel.find((a) => a.id === id)
    // Le prix part de la valeur estimée : l'éleveur ajuste au lieu de tout saisir.
    setForm((f) => ({ ...f, animalId: id, prix: cible ? String(cible.valeur) : f.prix }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!animal) return

    onSell({
      id: nextId('V'),
      animalId: animal.id,
      espece: animal.espece,
      acheteur: form.acheteur.trim() || 'Acheteur non renseigné',
      date: form.date,
      prix: Number(form.prix) || 0,
      paiement: form.paiement,
      createdAt: new Date().toISOString().slice(0, 10),
    })
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
        className="w-full max-w-md bg-[#0D1E36] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#D4AF37] font-bold text-lg">💰 Enregistrer une vente</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="text-white/60 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        {cheptel.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">🐄</div>
            <p className="text-white/60 text-sm">
              Aucun animal disponible à la vente.
            </p>
            <p className="text-white/60 text-xs mt-1">
              Ajoutez d&apos;abord un animal au cheptel.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="vente-animal" className="text-white/60 text-xs mb-1 block">
                Animal vendu
              </label>
              <select
                id="vente-animal"
                value={form.animalId}
                onChange={(e) => choisirAnimal(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              >
                {cheptel.map((a) => (
                  <option key={a.id} value={a.id} className="bg-[#0D1E36]">
                    {a.id} — {a.espece} · {a.race}
                  </option>
                ))}
              </select>
            </div>

            {animal && (
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-3 flex items-center justify-between">
                <span className="text-[#D4AF37]/70 text-[10px]">Valeur estimée</span>
                <span className="text-[#D4AF37] text-sm font-bold">
                  {animal.valeur.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            )}

            <div>
              <label htmlFor="vente-acheteur" className="text-white/60 text-xs mb-1 block">
                Acheteur
              </label>
              <input
                id="vente-acheteur"
                type="text"
                placeholder="ex: Boucherie Rood Woko"
                value={form.acheteur}
                onChange={(e) => setForm((f) => ({ ...f, acheteur: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/50 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="vente-date" className="text-white/60 text-xs mb-1 block">
                  Date
                </label>
                <input
                  id="vente-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label htmlFor="vente-prix" className="text-white/60 text-xs mb-1 block">
                  Prix réel (FCFA)
                </label>
                <input
                  id="vente-prix"
                  type="number"
                  min="0"
                  value={form.prix}
                  onChange={(e) => setForm((f) => ({ ...f, prix: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <span className="text-white/60 text-xs mb-1 block">Mode de paiement</span>
              <div className="grid grid-cols-2 gap-2">
                {PAIEMENTS.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, paiement: mode }))}
                    className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${
                      form.paiement === mode
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                        : 'border-white/10 text-white/50 hover:border-white/30'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#D4AF37] text-[#0A1628] font-bold rounded-xl text-sm hover:bg-[#D4AF37]/90 transition-colors mt-2"
            >
              Enregistrer la vente
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function VentesPage() {
  const userId = useUserId()
  const [modal, setModal] = useState(false)
  const [ventes, ventesApi] = useCollection<Vente>(userId, COLLECTIONS.ventes, VENTES_SEED)
  const [animaux, animauxApi] = useCollection<Animal>(userId, COLLECTIONS.animaux, ANIMAUX_SEED)

  const cheptel = useMemo(() => animaux.filter((a) => !a.vendu), [animaux])

  const ventesTriees = useMemo(
    () => [...ventes].sort((a, b) => b.date.localeCompare(a.date)),
    [ventes]
  )

  const ventesDuMois = useMemo(() => {
    const mois = new Date().toISOString().slice(0, 7)
    return ventes.filter((v) => v.date.startsWith(mois))
  }, [ventes])

  const caDuMois = useMemo(
    () => ventesDuMois.reduce((acc, v) => acc + v.prix, 0),
    [ventesDuMois]
  )

  const prixMoyen = useMemo(
    () => (ventes.length === 0 ? 0 : Math.round(ventes.reduce((a, v) => a + v.prix, 0) / ventes.length)),
    [ventes]
  )

  const impayes = useMemo(
    () => ventes.filter((v) => v.paiement === 'Crédit').reduce((a, v) => a + v.prix, 0),
    [ventes]
  )

  /** Chiffre d'affaires des six derniers mois, en milliers de FCFA. */
  const serieCa = useMemo(() => {
    const buckets: { mois: string; ca: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setDate(1)
      d.setMonth(d.getMonth() - i)
      const cle = d.toISOString().slice(0, 7)
      const ca = ventes
        .filter((v) => v.date.startsWith(cle))
        .reduce((acc, v) => acc + v.prix, 0)
      buckets.push({ mois: moisCourt(`${cle}-01`), ca: Math.round(ca / 1000) })
    }
    return buckets
  }, [ventes])

  /** Une vente sort l'animal du cheptel : les deux registres restent cohérents. */
  function enregistrerVente(vente: Vente) {
    ventesApi.add(vente)
    animauxApi.update(vente.animalId, { vendu: true })
  }

  return (
    <>
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#D4AF37]">💰 Ventes</h1>
            <p className="text-white/50 text-sm mt-1">Revenus et acheteurs</p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="bg-[#D4AF37] text-[#0A1628] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#D4AF37]/90 transition-colors shrink-0"
          >
            + Vendre
          </button>
        </div>

        {/* Indicateurs */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const }}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
          >
            <div className="text-xl font-bold text-[#D4AF37]">
              {Math.round(caDuMois / 1000)}k
            </div>
            <div className="text-white/50 text-[10px] mt-1">FCFA ce mois</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, delay: 0.08 }}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
          >
            <div className="text-xl font-bold text-[#00BCD4]">{ventesDuMois.length}</div>
            <div className="text-white/50 text-[10px] mt-1">Ventes ce mois</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, delay: 0.16 }}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
          >
            <div className="text-xl font-bold text-green-400">
              {Math.round(prixMoyen / 1000)}k
            </div>
            <div className="text-white/50 text-[10px] mt-1">Prix moyen</div>
          </motion.div>
        </div>

        {impayes > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring' as const }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5 flex items-center gap-3"
          >
            <span className="text-xl">⏳</span>
            <div>
              <span className="text-red-300 text-sm font-semibold">
                {impayes.toLocaleString('fr-FR')} FCFA à recouvrer
              </span>
              <div className="text-red-400/60 text-xs mt-0.5">
                Ventes réglées à crédit, encaissement en attente
              </div>
            </div>
          </motion.div>
        )}

        {/* Chiffre d'affaires */}
        <h2 className="text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">
          📈 Six derniers mois
        </h2>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serieCa} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="mois"
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(212,175,55,0.08)' }}
                  contentStyle={{
                    background: '#0D1E36',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                  formatter={(value: number) => [`${value}k FCFA`, 'CA']}
                />
                <Bar dataKey="ca" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Journal */}
        <h2 className="text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">
          📋 Historique des ventes
        </h2>
        <div className="space-y-3">
          {ventesTriees.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' as const, delay: Math.min(i * 0.05, 0.3) }}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl shrink-0">{ICONS[v.espece]}</span>
                  <div className="min-w-0">
                    <span className="text-white font-semibold text-sm">{v.animalId}</span>
                    <span className="text-white/60 text-xs ml-1">({v.espece})</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] border px-2 py-0.5 rounded-full shrink-0 ${PAIEMENT_STYLES[v.paiement]}`}
                >
                  {v.paiement}
                </span>
              </div>
              <div className="ml-8 space-y-1.5">
                <div className="text-white/80 text-xs font-medium truncate">🤝 {v.acheteur}</div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">📅 {formatDate(v.date)}</span>
                  <span className="text-[#D4AF37] text-sm font-bold">
                    {v.prix.toLocaleString('fr-FR')} F
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {ventesTriees.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-xl">
              <div className="text-3xl mb-2">💰</div>
              <p className="text-white/50 text-sm">Aucune vente enregistrée.</p>
              <p className="text-white/60 text-xs mt-1">
                Votre première vente apparaîtra ici.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => setModal(true)}
            className="w-full py-4 border-2 border-dashed border-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-sm font-medium hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5 transition-all"
          >
            + Enregistrer une vente
          </button>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <ModalVendre
            cheptel={cheptel}
            onClose={() => setModal(false)}
            onSell={enregistrerVente}
          />
        )}
      </AnimatePresence>
    </>
  )
}
