'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'

  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="text-5xl mb-3">🐄</div>
        <h1 className="text-2xl font-bold text-[#D4AF37]">LivestockOS</h1>
        <p className="text-white/50 text-sm mt-1">Gestion d&apos;élevage sahélien</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6">Connexion</h2>

        {/* Bloc démo */}
        <div className="mb-6 bg-[#00BCD4]/10 border border-[#00BCD4]/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎯</span>
            <span className="text-[#00BCD4] font-semibold text-sm">Compte démo éleveur</span>
          </div>
          <div className="text-white/70 text-xs space-y-1">
            <div>
              <span className="text-white/50">Email :</span>{' '}
              <span className="font-mono text-[#00BCD4]">demo@livestockos.app</span>
            </div>
            <div>
              <span className="text-white/50">Mot de passe :</span>{' '}
              <span className="font-mono text-[#00BCD4]">Demo2026!</span>
            </div>
          </div>
        </div>

        <form action={formAction} className="space-y-4">
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
              defaultValue={isDemo ? 'demo@livestockos.app' : ''}
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
              autoComplete="current-password"
              defaultValue={isDemo ? 'Demo2026!' : ''}
              placeholder="••••••••"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
            />
          </div>

          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-[#D4AF37] text-[#0A1628] rounded-xl font-bold text-base disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#D4AF37]/90 transition-colors mt-2"
          >
            {isPending ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/50 text-sm">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-[#D4AF37] hover:underline">
              Créer un compte
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="text-[#D4AF37] text-lg">Chargement...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
