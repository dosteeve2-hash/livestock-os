'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type Etape = {
  numero: number
  titre: string
  description: string
  icon: string
  action: string
  href: string
}

const ETAPES: Etape[] = [
  {
    numero: 1,
    titre: 'Enregistrer vos animaux',
    description:
      'Commencez par enregistrer votre cheptel. Chaque animal reçoit un identifiant unique : espèce, sexe, âge, poids et valeur estimée.',
    icon: '🐄',
    action: 'Aller aux animaux',
    href: '/dashboard/animaux',
  },
  {
    numero: 2,
    titre: 'Suivre la santé',
    description:
      'Enregistrez les vaccinations et traitements. LivestockOS vous rappellera les dates de rappel pour ne jamais manquer un soin.',
    icon: '🩺',
    action: 'Voir la santé',
    href: '/dashboard/sante',
  },
  {
    numero: 3,
    titre: 'Gérer les mouvements',
    description:
      'Tracez chaque vente, achat, naissance ou transfert. Suivez vos revenus en FCFA et consultez l\'historique complet.',
    icon: '🚛',
    action: 'Journal des mouvements',
    href: '/dashboard/mouvements',
  },
  {
    numero: 4,
    titre: 'Consulter les prix',
    description:
      'Accédez aux prix du marché par espèce et catégorie. LivestockOS vous indique quand c\'est le bon moment pour vendre.',
    icon: '📊',
    action: 'Voir les prix',
    href: '/dashboard/marche',
  },
]

export default function OnboardingPage() {
  const [etapeActive, setEtapeActive] = useState(0)
  const [isDemo, setIsDemo] = useState(false)
  const router = useRouter()

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setIsDemo(data?.user?.email === 'demo@livestockos.app')
    })
  }, [])

  const etape = ETAPES[etapeActive]
  const estDerniere = etapeActive === ETAPES.length - 1

  function suivant() {
    if (estDerniere) {
      router.push('/dashboard')
    } else {
      setEtapeActive((prev) => prev + 1)
    }
  }

  function precedent() {
    if (etapeActive > 0) setEtapeActive((prev) => prev - 1)
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center px-6 py-12">
      {/* Bannière démo */}
      {isDemo && (
        <div className="w-full max-w-sm mb-6 bg-[#00BCD4]/10 border border-[#00BCD4]/30 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <div>
              <div className="text-[#00BCD4] font-semibold text-sm">Mode démo actif</div>
              <div className="text-white/50 text-xs">
                Vous explorez LivestockOS avec des données fictives
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full max-w-sm mb-8 text-center">
        <div className="text-4xl mb-3">🐄</div>
        <h1 className="text-xl font-bold text-[#D4AF37]">
          Bienvenue sur LivestockOS
        </h1>
        <p className="text-white/50 text-sm mt-1">
          4 étapes pour démarrer
        </p>
      </div>

      {/* Indicateurs étapes */}
      <div className="flex gap-2 mb-8">
        {ETAPES.map((_, i) => (
          <button
            key={i}
            onClick={() => setEtapeActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === etapeActive
                ? 'w-8 bg-[#D4AF37]'
                : i < etapeActive
                ? 'w-4 bg-[#D4AF37]/40'
                : 'w-4 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Carte étape */}
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={etapeActive}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            {/* Numéro + icône */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
                <span className="text-[#D4AF37] font-bold text-sm">{etape.numero}</span>
              </div>
              <span className="text-4xl">{etape.icon}</span>
            </div>

            <h2 className="text-[#D4AF37] font-bold text-lg mb-3">{etape.titre}</h2>
            <p className="text-white/70 text-sm leading-relaxed mb-6">{etape.description}</p>

            {/* Lien vers la section */}
            <Link
              href={etape.href}
              className="block w-full text-center py-3 border border-[#00BCD4]/40 text-[#00BCD4] rounded-xl text-sm font-medium hover:bg-[#00BCD4]/10 transition-colors mb-4"
            >
              {etape.action} →
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-4">
          {etapeActive > 0 && (
            <button
              onClick={precedent}
              className="flex-1 py-3 border border-white/20 text-white/60 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
            >
              ← Précédent
            </button>
          )}
          <button
            onClick={suivant}
            className="flex-1 py-3 bg-[#D4AF37] text-[#0A1628] rounded-xl text-sm font-bold hover:bg-[#D4AF37]/90 transition-colors"
          >
            {estDerniere ? '🎉 Commencer !' : 'Suivant →'}
          </button>
        </div>

        {/* Passer */}
        <div className="mt-4 text-center">
          <Link
            href="/dashboard"
            className="text-white/60 text-xs hover:text-white/50 transition-colors"
          >
            Passer l&apos;introduction
          </Link>
        </div>
      </div>
    </div>
  )
}
