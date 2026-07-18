'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type Espece = 'Bovin' | 'Ovin' | 'Caprin' | 'Volaille'
type Sexe = 'Mâle' | 'Femelle'
type EtatSante = 'Sain' | 'Traitement' | 'Observation'

interface Animal {
  id: string
  espece: Espece
  race: string
  sexe: Sexe
  age: string
  poids: string
  etatSante: EtatSante
  dateVaccination: string
  valeur: number
}

// ─── Données mock ─────────────────────────────────────────────────────────────

const MOCK_ANIMAUX: Animal[] = [
  { id: 'BV-001', espece: 'Bovin', race: 'Zébu Peul', sexe: 'Mâle', age: '4 ans', poids: '380 kg', etatSante: 'Sain', dateVaccination: '2026-12-14', valeur: 485000 },
  { id: 'BV-002', espece: 'Bovin', race: 'Zébu Peul', sexe: 'Femelle', age: '3 ans', poids: '290 kg', etatSante: 'Sain', dateVaccination: '2026-11-20', valeur: 365000 },
  { id: 'BV-003', espece: 'Bovin', race: 'Azawak', sexe: 'Femelle', age: '5 ans', poids: '310 kg', etatSante: 'Observation', dateVaccination: '2026-08-05', valeur: 380000 },
  { id: 'OV-001', espece: 'Ovin', race: 'Mouton Djallonké', sexe: 'Mâle', age: '2 ans', poids: '45 kg', etatSante: 'Sain', dateVaccination: '2026-07-21', valeur: 72000 },
  { id: 'OV-002', espece: 'Ovin', race: 'Mouton Peul-Peul', sexe: 'Femelle', age: '1.5 ans', poids: '38 kg', etatSante: 'Sain', dateVaccination: '2026-09-10', valeur: 58000 },
  { id: 'OV-003', espece: 'Ovin', race: 'Mouton Djallonké', sexe: 'Mâle', age: '3 ans', poids: '52 kg', etatSante: 'Traitement', dateVaccination: '2026-07-17', valeur: 78000 },
  { id: 'CP-001', espece: 'Caprin', race: 'Chèvre Sahélienne', sexe: 'Mâle', age: '2 ans', poids: '38 kg', etatSante: 'Sain', dateVaccination: '2026-07-22', valeur: 52000 },
  { id: 'CP-002', espece: 'Caprin', race: 'Chèvre Rousse de Maradi', sexe: 'Femelle', age: '1.5 ans', poids: '32 kg', etatSante: 'Sain', dateVaccination: '2026-10-02', valeur: 48000 },
  { id: 'VL-001', espece: 'Volaille', race: 'Poule locale', sexe: 'Femelle', age: '8 mois', poids: '1.8 kg', etatSante: 'Sain', dateVaccination: '2026-08-15', valeur: 4500 },
  { id: 'VL-002', espece: 'Volaille', race: 'Poule locale', sexe: 'Femelle', age: '6 mois', poids: '1.5 kg', etatSante: 'Sain', dateVaccination: '2026-08-15', valeur: 3800 },
  { id: 'VL-003', espece: 'Volaille', race: 'Coq local', sexe: 'Mâle', age: '10 mois', poids: '2.2 kg', etatSante: 'Sain', dateVaccination: '2026-08-15', valeur: 5200 },
]

const ESPECES: Array<'Tous' | Espece> = ['Tous', 'Bovin', 'Ovin', 'Caprin', 'Volaille']

const ICONS: Record<Espece, string> = {
  Bovin: '🐄',
  Ovin: '🐑',
  Caprin: '🐐',
  Volaille: '🐔',
}

const ETAT_STYLES: Record<EtatSante, string> = {
  Sain: 'bg-green-500/20 text-green-400 border-green-500/30',
  Traitement: 'bg-red-500/20 text-red-400 border-red-500/30',
  Observation: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
}

function EtatBadge({ etat }: { etat: EtatSante }) {
  return (
    <span className={`text-[10px] border px-2 py-0.5 rounded-full ${ETAT_STYLES[etat]}`}>
      {etat}
    </span>
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ─── Modal Fiche animal ────────────────────────────────────────────────────────

function ModalFicheAnimal({ animal, onClose }: { animal: Animal; onClose: () => void }) {
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
          <div className="flex items-center gap-3">
            <span className="text-3xl">{ICONS[animal.espece]}</span>
            <div>
              <h2 className="text-white font-bold text-lg leading-none">{animal.id}</h2>
              <span className="text-white/40 text-xs">{animal.espece} · {animal.sexe}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-white/40 text-[10px] mb-1">Espèce</div>
              <div className="text-white text-sm font-medium">{animal.espece}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-white/40 text-[10px] mb-1">Race</div>
              <div className="text-white text-sm font-medium">{animal.race}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-white/40 text-[10px] mb-1">Âge</div>
              <div className="text-white text-sm font-medium">{animal.age}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-white/40 text-[10px] mb-1">Poids</div>
              <div className="text-white text-sm font-medium">{animal.poids}</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
            <div className="text-white/40 text-[10px]">État de santé</div>
            <EtatBadge etat={animal.etatSante} />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
            <div className="text-white/40 text-[10px]">Prochaine vaccination</div>
            <div className="text-[#00BCD4] text-sm font-medium">💉 {formatDate(animal.dateVaccination)}</div>
          </div>

          <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-3 flex items-center justify-between">
            <div className="text-[#D4AF37]/70 text-[10px]">Valeur estimée</div>
            <div className="text-[#D4AF37] text-sm font-bold">{animal.valeur.toLocaleString('fr-FR')} FCFA</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 mt-5 bg-white/5 border border-white/10 text-white/70 font-medium rounded-xl text-sm hover:bg-white/10 transition-colors"
        >
          Fermer
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Modal Ajouter animal ──────────────────────────────────────────────────────

interface FormAnimal {
  id: string
  espece: Espece
  race: string
  sexe: Sexe
  age: string
  poids: string
  etatSante: EtatSante
  dateVaccination: string
  valeur: string
}

const FORM_INIT: FormAnimal = {
  id: '',
  espece: 'Bovin',
  race: '',
  sexe: 'Mâle',
  age: '',
  poids: '',
  etatSante: 'Sain',
  dateVaccination: '2026-07-18',
  valeur: '',
}

function ModalAjouterAnimal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (animal: Animal) => void
}) {
  const [form, setForm] = useState<FormAnimal>(FORM_INIT)

  function handle(k: keyof FormAnimal, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onAdd({
      id: form.id || `${form.espece.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      espece: form.espece,
      race: form.race || 'Race locale',
      sexe: form.sexe,
      age: form.age || '—',
      poids: form.poids || '—',
      etatSante: form.etatSante,
      dateVaccination: form.dateVaccination,
      valeur: Number(form.valeur) || 0,
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
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#D4AF37] font-bold text-lg">+ Ajouter un animal</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">×</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-white/60 text-xs mb-1 block">Identifiant</label>
            <input
              type="text"
              placeholder="ex: BV-004 (auto si vide)"
              value={form.id}
              onChange={e => handle('id', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <div>
            <label className="text-white/60 text-xs mb-1 block">Espèce</label>
            <div className="grid grid-cols-4 gap-2">
              {(['Bovin', 'Ovin', 'Caprin', 'Volaille'] as Espece[]).map(esp => (
                <button
                  key={esp}
                  type="button"
                  onClick={() => handle('espece', esp)}
                  className={`py-2.5 rounded-xl text-xs font-medium border transition-all flex flex-col items-center gap-1 ${
                    form.espece === esp
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                      : 'border-white/10 text-white/50 hover:border-white/30'
                  }`}
                >
                  <span className="text-base">{ICONS[esp]}</span>
                  <span>{esp}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white/60 text-xs mb-1 block">Race</label>
            <input
              type="text"
              placeholder="ex: Zébu Peul"
              value={form.race}
              onChange={e => handle('race', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <div>
            <label className="text-white/60 text-xs mb-1 block">Sexe</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Mâle', 'Femelle'] as Sexe[]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handle('sexe', s)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    form.sexe === s
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                      : 'border-white/10 text-white/50 hover:border-white/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/60 text-xs mb-1 block">Âge</label>
              <input
                type="text"
                placeholder="ex: 2 ans"
                value={form.age}
                onChange={e => handle('age', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">Poids</label>
              <input
                type="text"
                placeholder="ex: 45 kg"
                value={form.poids}
                onChange={e => handle('poids', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
          </div>

          <div>
            <label className="text-white/60 text-xs mb-1 block">État de santé</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Sain', 'Observation', 'Traitement'] as EtatSante[]).map(etat => (
                <button
                  key={etat}
                  type="button"
                  onClick={() => handle('etatSante', etat)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    form.etatSante === etat
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                      : 'border-white/10 text-white/50 hover:border-white/30'
                  }`}
                >
                  {etat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white/60 text-xs mb-1 block">Date de vaccination</label>
            <input
              type="date"
              value={form.dateVaccination}
              onChange={e => handle('dateVaccination', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <div>
            <label className="text-white/60 text-xs mb-1 block">Valeur estimée (FCFA)</label>
            <input
              type="number"
              placeholder="0"
              value={form.valeur}
              onChange={e => handle('valeur', e.target.value)}
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#D4AF37] text-[#0A1628] font-bold rounded-xl text-sm hover:bg-[#D4AF37]/90 transition-colors mt-2"
          >
            Enregistrer l&apos;animal
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function AnimauxPage() {
  const [animaux, setAnimaux] = useState<Animal[]>(MOCK_ANIMAUX)
  const [filtreEspece, setFiltreEspece] = useState<'Tous' | Espece>('Tous')
  const [recherche, setRecherche] = useState('')
  const [ficheAnimal, setFicheAnimal] = useState<Animal | null>(null)
  const [modalAjout, setModalAjout] = useState(false)

  const compteParEspece = useMemo(() => {
    const compte: Record<Espece, number> = { Bovin: 0, Ovin: 0, Caprin: 0, Volaille: 0 }
    for (const a of animaux) compte[a.espece]++
    return compte
  }, [animaux])

  const animauxFiltres = useMemo(() => {
    const q = recherche.trim().toLowerCase()
    return animaux.filter(a => {
      const matchEspece = filtreEspece === 'Tous' || a.espece === filtreEspece
      const matchRecherche = q === '' || a.id.toLowerCase().includes(q) || a.race.toLowerCase().includes(q)
      return matchEspece && matchRecherche
    })
  }, [animaux, filtreEspece, recherche])

  return (
    <>
      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#D4AF37]">🐄 Animaux</h1>
            <p className="text-white/50 text-sm mt-1">Registre complet de votre cheptel</p>
          </div>
          <button
            onClick={() => setModalAjout(true)}
            className="bg-[#D4AF37] text-[#0A1628] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#D4AF37]/90 transition-colors shrink-0"
          >
            + Ajouter
          </button>
        </div>

        {/* KPI total */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3 text-center"
        >
          <div className="text-3xl font-bold text-[#D4AF37]">{animaux.length}</div>
          <div className="text-white/50 text-xs mt-1">Total animaux</div>
        </motion.div>

        {/* 4 KPIs par espèce */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {(['Bovin', 'Ovin', 'Caprin', 'Volaille'] as Espece[]).map((esp, i) => (
            <motion.div
              key={esp}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' as const, delay: i * 0.06 }}
              className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center"
            >
              <div className="text-lg leading-none mb-1">{ICONS[esp]}</div>
              <div className="text-white font-bold text-sm">{compteParEspece[esp]}</div>
              <div className="text-white/40 text-[9px] mt-0.5">{esp}s</div>
            </motion.div>
          ))}
        </div>

        {/* Recherche */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="🔎 Rechercher par ID ou race…"
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
          />
        </div>

        {/* Filtre espèces */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {ESPECES.map(e => (
            <button
              key={e}
              onClick={() => setFiltreEspece(e)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-colors ${
                filtreEspece === e
                  ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]'
                  : 'border-white/10 text-white/50 hover:border-white/30'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Tableau */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-[#D4AF37] font-semibold text-sm">Registre</h2>
            <span className="text-white/30 text-xs">{animauxFiltres.length} résultat{animauxFiltres.length > 1 ? 's' : ''}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-3 py-2 text-left text-white/40 font-medium">ID</th>
                  <th className="px-3 py-2 text-left text-white/40 font-medium">Espèce</th>
                  <th className="px-3 py-2 text-left text-white/40 font-medium">Race</th>
                  <th className="px-3 py-2 text-left text-white/40 font-medium">Âge</th>
                  <th className="px-3 py-2 text-right text-white/40 font-medium">État</th>
                </tr>
              </thead>
              <tbody>
                {animauxFiltres.map(a => (
                  <tr
                    key={a.id}
                    onClick={() => setFicheAnimal(a)}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-3 py-3 text-white font-semibold whitespace-nowrap">
                      <span className="mr-1">{ICONS[a.espece]}</span>{a.id}
                    </td>
                    <td className="px-3 py-3 text-white/70 whitespace-nowrap">{a.espece}</td>
                    <td className="px-3 py-3 text-white/60 whitespace-nowrap">{a.race}</td>
                    <td className="px-3 py-3 text-white/60 whitespace-nowrap">{a.age}</td>
                    <td className="px-3 py-3 text-right">
                      <EtatBadge etat={a.etatSante} />
                    </td>
                  </tr>
                ))}
                {animauxFiltres.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-white/30">
                      Aucun animal ne correspond à votre recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bouton ajouter bas */}
        <button
          onClick={() => setModalAjout(true)}
          className="w-full py-4 border-2 border-dashed border-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-sm font-medium hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5 transition-all"
        >
          + Ajouter un animal
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {ficheAnimal && (
          <ModalFicheAnimal animal={ficheAnimal} onClose={() => setFicheAnimal(null)} />
        )}
        {modalAjout && (
          <ModalAjouterAnimal
            onClose={() => setModalAjout(false)}
            onAdd={a => setAnimaux(prev => [a, ...prev])}
          />
        )}
      </AnimatePresence>
    </>
  )
}
