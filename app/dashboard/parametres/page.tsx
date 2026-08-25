'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type TypeElevage = 'Bovin' | 'Ovin' | 'Caprin' | 'Mixte'

interface ProfilEleveur {
  nom: string
  email: string
  telephone: string
}

interface Exploitation {
  nom: string
  localisation: string
  typeElevage: TypeElevage
  superficie: string
}

interface Alertes {
  poidsMinVente: string
  capaciteMax: string
}

// ─── Valeurs initiales ────────────────────────────────────────────────────────

const INIT_PROFIL: ProfilEleveur = {
  nom: 'Ibrahim Sawadogo',
  email: 'ibrahim.sawadogo@mail.com',
  telephone: '+226 70 12 34 56',
}

const INIT_EXPLOITATION: Exploitation = {
  nom: 'Ferme Sawadogo',
  localisation: 'Ouahigouya, Nord Burkina',
  typeElevage: 'Mixte',
  superficie: '15',
}

const INIT_ALERTES: Alertes = {
  poidsMinVente: '250',
  capaciteMax: '50',
}

// ─── Types d'élevage ─────────────────────────────────────────────────────────

const TYPES_ELEVAGE: TypeElevage[] = ['Bovin', 'Ovin', 'Caprin', 'Mixte']
const ICONS_ELEVAGE: Record<TypeElevage, string> = {
  Bovin: '🐄',
  Ovin: '🐑',
  Caprin: '🐐',
  Mixte: '🌾',
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title, icon, children,
}: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5">
      <h2 className="text-[#D4AF37] font-semibold text-sm mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  )
}

// ─── Champ de formulaire ──────────────────────────────────────────────────────

function Field({
  label, value, onChange, type = 'text', placeholder = '', suffix,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  suffix?: string
}) {
  return (
    <div>
      <label className="text-white/50 text-xs mb-1.5 block">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-colors pr-12"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParametresPage() {
  const [profil, setProfil] = useState<ProfilEleveur>(INIT_PROFIL)
  const [exploitation, setExploitation] = useState<Exploitation>(INIT_EXPLOITATION)
  const [alertes, setAlertes] = useState<Alertes>(INIT_ALERTES)
  const [saved, setSaved] = useState(false)

  function patchProfil(k: keyof ProfilEleveur, v: string) {
    setProfil(p => ({ ...p, [k]: v }))
  }
  function patchExploitation(k: keyof Exploitation, v: string) {
    setExploitation(e => ({ ...e, [k]: v }))
  }
  function patchAlertes(k: keyof Alertes, v: string) {
    setAlertes(a => ({ ...a, [k]: v }))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    // En production : upsert Supabase
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#D4AF37]">⚙️ Paramètres</h1>
        <p className="text-white/50 text-sm mt-1">Votre profil et votre exploitation</p>
      </div>

      <form onSubmit={handleSave}>

        {/* Profil éleveur */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, delay: 0 }}
        >
          <Section title="Profil éleveur" icon="👤">
            <div className="space-y-4">
              <Field
                label="Nom complet"
                value={profil.nom}
                onChange={v => patchProfil('nom', v)}
                placeholder="Ibrahim Sawadogo"
              />
              <Field
                label="Adresse email"
                value={profil.email}
                onChange={v => patchProfil('email', v)}
                type="email"
                placeholder="nom@mail.com"
              />
              <Field
                label="Téléphone"
                value={profil.telephone}
                onChange={v => patchProfil('telephone', v)}
                type="tel"
                placeholder="+226 70 00 00 00"
              />
            </div>
          </Section>
        </motion.div>

        {/* Exploitation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, delay: 0.1 }}
        >
          <Section title="Exploitation" icon="🏡">
            <div className="space-y-4">
              <Field
                label="Nom de l'exploitation"
                value={exploitation.nom}
                onChange={v => patchExploitation('nom', v)}
                placeholder="Ferme Sawadogo"
              />
              <Field
                label="Localisation"
                value={exploitation.localisation}
                onChange={v => patchExploitation('localisation', v)}
                placeholder="Village, Région"
              />

              {/* Type élevage */}
              <div>
                <label className="text-white/50 text-xs mb-2 block">Type d&apos;élevage</label>
                <div className="grid grid-cols-4 gap-2">
                  {TYPES_ELEVAGE.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => patchExploitation('typeElevage', t)}
                      className={`py-2.5 rounded-xl text-xs font-medium border transition-all flex flex-col items-center gap-1 ${
                        exploitation.typeElevage === t
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                          : 'border-white/10 text-white/50 hover:border-white/30'
                      }`}
                    >
                      <span className="text-lg">{ICONS_ELEVAGE[t]}</span>
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Field
                label="Superficie"
                value={exploitation.superficie}
                onChange={v => patchExploitation('superficie', v)}
                type="number"
                placeholder="10"
                suffix="ha"
              />
            </div>
          </Section>
        </motion.div>

        {/* Alertes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, delay: 0.2 }}
        >
          <Section title="Seuils d'alertes" icon="🔔">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-white/50 text-xs">Poids minimum de vente</span>
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">Alerte orange</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={alertes.poidsMinVente}
                    onChange={e => patchAlertes('poidsMinVente', e.target.value)}
                    min="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">kg</span>
                </div>
                <p className="text-white/30 text-xs mt-1.5">
                  Alerte si un animal passe sous ce poids avant vente
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-white/50 text-xs">Capacité maximum du cheptel</span>
                  <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">Alerte rouge</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={alertes.capaciteMax}
                    onChange={e => patchAlertes('capaciteMax', e.target.value)}
                    min="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-colors pr-20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">animaux</span>
                </div>
                <p className="text-white/30 text-xs mt-1.5">
                  Alerte si le cheptel dépasse cette capacité
                </p>
              </div>
            </div>
          </Section>
        </motion.div>

        {/* Bouton sauvegarder */}
        <motion.button
          type="submit"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ type: 'spring' as const, delay: 0.3 }}
          className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-[#D4AF37] text-[#0A1628] hover:bg-[#D4AF37]/90'
          }`}
        >
          {saved ? '✓ Sauvegardé !' : 'Sauvegarder les paramètres'}
        </motion.button>
      </form>

      {/* Version app */}
      <p className="text-center text-white/20 text-xs mt-6">LivestockOS v0.1 · Sahel Agri-Tech</p>
    </div>
  )
}
