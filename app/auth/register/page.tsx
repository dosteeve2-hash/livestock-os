'use client'

import { useActionState } from 'react'
import { registerAction } from './actions'
import Link from 'next/link'

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null)

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="text-5xl mb-3">🐄</div>
        <h1 className="text-2xl font-bold text-[#D4AF37]">ÉlevageTrack</h1>
        <p className="text-white/50 text-sm mt-1">Créer votre compte éleveur</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6">Inscription gratuite</h2>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2" htmlFor="nom">
              Nom complet
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              autoComplete="name"
              placeholder="Votre nom"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="votre@email.com"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="8 caractères minimum"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
            />
          </div>

          {state && 'error' in state && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-[#D4AF37] text-[#0A1628] rounded-xl font-bold text-base disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#D4AF37]/90 transition-colors mt-2"
          >
            {isPending ? 'Création du compte...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/50 text-sm">
            Déjà inscrit ?{' '}
            <Link href="/auth/login" className="text-[#D4AF37] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-white/40 text-xs hover:text-white/60 transition-colors">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
