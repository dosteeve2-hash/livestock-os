'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
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
  const reducedMotion = useReducedMotion()

  return (
    <>
      <div className="mb-8 flex items-center justify-center gap-2" role="group" aria-label="Période de facturation">
        <button
          type="button"
          onClick={() => setAnnuel(false)}
          aria-pressed={!annuel}
          className={`min-h-[48px] rounded-full border px-5 text-sm font-medium transition-colors ${
            !annuel ? 'border-leather bg-leather text-paper-light' : 'border-leather/20 text-ink-soft hover:border-leather/50'
          }`}
        >
          Mensuel
        </button>
        <button
          type="button"
          onClick={() => setAnnuel(true)}
          aria-pressed={annuel}
          className={`min-h-[48px] rounded-full border px-5 text-sm font-medium transition-colors ${
            annuel ? 'border-leather bg-leather text-paper-light' : 'border-leather/20 text-ink-soft hover:border-leather/50'
          }`}
        >
          Annuel <span className={annuel ? 'ml-1 text-paper' : 'ml-1 text-sage'}>2 mois offerts</span>
        </button>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-3">
        {ORDRE_PLANS.map((id, index) => {
          const plan = PLANS[id]
          const prix = annuel ? plan.prixAnnuel : plan.prixMensuel
          const estActuel = planActuel === id
          const misEnAvant = Boolean(plan.misEnAvant)

          return (
            <motion.article
              key={id}
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0 } : { delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`flex min-w-0 flex-col rounded-[18px] border p-6 sm:p-7 ${
                misEnAvant ? 'border-ochre/50 bg-paper-light shadow-[0_18px_48px_rgba(65,47,27,0.1)]' : 'border-leather/12 bg-paper-light'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold text-leather">{plan.nom}</h2>
                {estActuel && <span className="rounded-full bg-sage/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-sage">Plan actuel</span>}
                {misEnAvant && !estActuel && <span className="rounded-full bg-ochre/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ochre">Jusqu&apos;à 200 têtes</span>}
              </div>
              <p className="mt-1 text-sm text-ink-muted">{plan.pourQui}</p>

              <div className="mt-6 flex min-h-[58px] flex-wrap items-baseline gap-x-2">
                <span className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{formatFcfa(prix)}</span>
                {prix > 0 && <span className="text-sm text-ink-muted">/ {annuel ? 'an' : 'mois'}</span>}
              </div>
              <p className="mt-1 min-h-[20px] text-xs text-ink-muted">
                {prix > 0 && annuel && `Soit ${formatFcfa(Math.round(prix / 12))} par mois`}
                {prix === 0 && 'Sans limite de durée'}
              </p>

              <ul className="mt-6 flex-1 space-y-3 border-t border-leather/10 pt-5">
                {plan.inclus.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <Check size={16} className="mt-0.5 shrink-0 text-sage" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                {estActuel ? (
                  <div className="flex min-h-[48px] items-center justify-center rounded-full border border-sage/25 bg-sage/[0.06] text-sm font-medium text-sage" aria-current="true">
                    Votre plan actuel
                  </div>
                ) : id === 'eleveur' ? (
                  <Link
                    href={connecte ? '/dashboard' : '/auth/register'}
                    className="flex min-h-[50px] items-center justify-center rounded-full bg-leather px-5 text-center text-sm font-semibold text-paper-light transition-colors hover:bg-sage"
                  >
                    {connecte ? 'Retour au tableau de bord' : 'Créer un compte gratuit'}
                  </Link>
                ) : (
                  <a
                    href={lienActivation(id, annuel, contactWhatsapp, contactEmail)}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex min-h-[50px] items-center justify-center gap-2 rounded-full px-5 text-center text-sm font-semibold transition-colors ${
                      misEnAvant ? 'bg-ochre text-paper-light hover:bg-leather' : 'border border-leather/25 text-leather hover:border-sage hover:bg-sage hover:text-paper-light'
                    }`}
                  >
                    Demander l&apos;activation
                    <ArrowUpRight size={15} aria-hidden="true" />
                    <span className="sr-only">(ouvre un nouvel onglet)</span>
                  </a>
                )}
              </div>
            </motion.article>
          )
        })}
      </div>
    </>
  )
}
