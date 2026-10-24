'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ORDRE_PLANS, PLANS, formatFcfa, type Plan } from '@/lib/plans/plans'

interface Props {
  planActuel: Plan | null
  connecte: boolean
  contactWhatsapp: string | null
  contactEmail: string
}

function lienActivation(plan: Plan, annuel: boolean, whatsapp: string | null, email: string) {
  const p = PLANS[plan]
  const montant = annuel ? p.prixAnnuel : p.prixMensuel
  const texte = `Bonjour, je souhaite activer le plan ${p.nom} de LivestockOS (${formatFcfa(montant)} ${annuel ? 'par an' : 'par mois'}). Mon e-mail de connexion : `
  if (whatsapp) return `https://wa.me/${whatsapp}?text=${encodeURIComponent(texte)}`
  return `mailto:${email}?subject=${encodeURIComponent(`Activation plan ${p.nom} — LivestockOS`)}&body=${encodeURIComponent(texte)}`
}

export default function TarifsClient({ planActuel, connecte, contactWhatsapp, contactEmail }: Props) {
  const [annuel, setAnnuel] = useState(true)

  return (
    <>
      {/* Bascule */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setAnnuel(false)}
          className={`text-sm px-4 py-2 rounded-full border transition-colors ${
            !annuel ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 text-white/50'
          }`}
        >
          Mensuel
        </button>
        <button
          onClick={() => setAnnuel(true)}
          className={`text-sm px-4 py-2 rounded-full border transition-colors ${
            annuel ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 text-white/50'
          }`}
        >
          Annuel <span className="text-[#00BCD4] text-xs ml-1">2 mois offerts</span>
        </button>
      </div>

      {/* Cartes */}
      <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto w-full">
        {ORDRE_PLANS.map((id, i) => {
          const p = PLANS[id]
          const prix = annuel ? p.prixAnnuel : p.prixMensuel
          const estActuel = planActuel === id
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative flex flex-col min-w-0 rounded-2xl p-6 border ${
                p.misEnAvant
                  ? 'border-[#D4AF37] bg-[#D4AF37]/[0.06]'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {p.misEnAvant && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37] text-[#0A1628] px-3 py-1 rounded-full">
                  Le plus choisi
                </span>
              )}
              <h2 className="text-[#D4AF37] font-bold text-xl">{p.nom}</h2>
              <p className="text-white/50 text-xs mt-1">{p.pourQui}</p>

              <div className="mt-5 mb-1">
                <span className="text-2xl md:text-3xl font-bold text-white">{formatFcfa(prix)}</span>
                {prix > 0 && (
                  <span className="text-white/60 text-sm"> / {annuel ? 'an' : 'mois'}</span>
                )}
              </div>
              <p className="text-white/60 text-xs h-4">
                {prix > 0 && annuel && `soit ${formatFcfa(Math.round(prix / 12))} par mois`}
                {prix === 0 && 'pour toujours'}
              </p>

              <ul className="mt-5 space-y-2 flex-1">
                {p.inclus.map((l) => (
                  <li key={l} className="text-white/75 text-sm flex gap-2">
                    <span className="text-[#00BCD4]">✓</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {estActuel ? (
                  <div className="w-full py-3 text-center text-sm rounded-xl border border-white/15 text-white/50">
                    Votre plan actuel
                  </div>
                ) : id === 'eleveur' ? (
                  <Link
                    href={connecte ? '/dashboard' : '/auth/register'}
                    className="block w-full py-3 text-center text-sm font-bold rounded-xl border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                  >
                    {connecte ? 'Retour au tableau de bord' : 'Commencer gratuitement'}
                  </Link>
                ) : (
                  <a
                    href={lienActivation(id, annuel, contactWhatsapp, contactEmail)}
                    target="_blank"
                    rel="noreferrer"
                    className={`block w-full py-3 text-center text-sm font-bold rounded-xl transition-colors ${
                      p.misEnAvant
                        ? 'bg-[#D4AF37] text-[#0A1628] hover:bg-[#D4AF37]/90'
                        : 'border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10'
                    }`}
                  >
                    Activer via Orange Money
                  </a>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}
