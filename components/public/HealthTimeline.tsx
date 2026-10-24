'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Check, Clock3, HeartPulse } from 'lucide-react'

const ETAPES = [
  {
    statut: 'Planifié',
    titre: 'Le prochain soin est noté',
    texte: 'Consignez une vaccination, un traitement ou un contrôle, avec une date de rappel si nécessaire.',
    icon: Clock3,
  },
  {
    statut: 'En cours',
    titre: 'Le suivi reste rattaché à l’animal',
    texte: 'Chaque note peut garder l’identifiant, le vétérinaire, la description et le coût du soin.',
    icon: HeartPulse,
  },
  {
    statut: 'Fait',
    titre: 'L’historique reste dans le registre',
    texte: 'Retrouvez les soins consignés et les vaccinations saisies pour préparer vos relevés.',
    icon: Check,
  },
]

export default function HealthTimeline() {
  const reducedMotion = useReducedMotion()

  return (
    <ol className="relative mt-9 space-y-7 before:absolute before:bottom-8 before:left-[19px] before:top-8 before:w-px before:bg-paper/20 sm:mt-12 sm:space-y-9">
      {ETAPES.map((etape, index) => {
        const Icon = etape.icon
        return (
          <motion.li
            key={etape.statut}
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.7, delay: index * 0.11, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex gap-4 sm:gap-6"
          >
            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ochre-bright/50 bg-leather-deep text-ochre-bright">
              <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1 border-b border-paper/15 pb-6 sm:pb-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ochre-bright">{etape.statut}</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-paper-light sm:text-2xl">{etape.titre}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-paper/75">{etape.texte}</p>
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}
