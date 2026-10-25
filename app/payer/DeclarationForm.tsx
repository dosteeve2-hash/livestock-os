'use client'

import { useState } from 'react'

interface Props {
  plan: 'troupeau' | 'cooperative'
  periode: 'mois' | 'an'
  lienContact: string
}

type Etat = { type: 'repos' } | { type: 'envoi' } | { type: 'ok' } | { type: 'erreur'; message: string }

export default function DeclarationForm({ plan, periode, lienContact }: Props) {
  const [etat, setEtat] = useState<Etat>({ type: 'repos' })

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setEtat({ type: 'envoi' })
    try {
      const r = await fetch('/api/paiement/declarer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          periode,
          referenceTransfert: data.get('referenceTransfert'),
          telephone: data.get('telephone'),
        }),
      })
      if (r.ok) {
        setEtat({ type: 'ok' })
        return
      }
      const corps = await r.json().catch(() => ({}))
      setEtat({ type: 'erreur', message: corps.message ?? 'Envoi impossible. Vérifiez les champs et réessayez.' })
    } catch {
      setEtat({ type: 'erreur', message: 'Pas de connexion. Réessayez quand le réseau revient.' })
    }
  }

  if (etat.type === 'ok') {
    return (
      <p role="status" className="mt-4 rounded-[12px] border border-sage/25 bg-sage/[0.06] p-4 text-sm text-sage">
        Déclaration reçue. Le plan sera activé après vérification du transfert.
      </p>
    )
  }

  return (
    <form onSubmit={envoyer} className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        ID de transaction
        <input
          name="referenceTransfert"
          required
          minLength={6}
          maxLength={40}
          autoComplete="off"
          autoCapitalize="characters"
          className="min-h-[48px] rounded-[10px] border border-leather/20 bg-paper px-3 font-mono text-base"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Numéro qui a payé
        <input
          name="telephone"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="8 chiffres"
          className="min-h-[48px] rounded-[10px] border border-leather/20 bg-paper px-3 font-mono text-base"
        />
      </label>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={etat.type === 'envoi'}
          className="inline-flex min-h-[50px] items-center rounded-full bg-ochre px-6 text-sm font-semibold text-paper-light transition-colors hover:bg-leather disabled:opacity-60"
        >
          {etat.type === 'envoi' ? 'Envoi…' : 'J’ai payé, déclarer le transfert'}
        </button>
        {etat.type === 'erreur' && (
          <p role="alert" className="mt-3 text-sm text-brick">
            {etat.message}{' '}
            <a href={lienContact} target="_blank" rel="noreferrer" className="underline underline-offset-4">Nous écrire</a>
          </p>
        )}
      </div>
    </form>
  )
}
