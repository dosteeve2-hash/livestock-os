'use client'

import { ArrowDown, ArrowUp } from 'lucide-react'
import { useState } from 'react'

export default function AnimalFlipCard() {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="perspective-[1300px]">
      <div
        className={`flip-panel preserve-3d relative min-h-[420px] rounded-[22px] shadow-[0_24px_70px_rgba(61,44,27,0.14)] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        <div
          className="face-hidden absolute inset-0 overflow-hidden rounded-[22px] border border-leather/12 bg-paper-light p-5 sm:p-7"
          inert={flipped}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-ochre">Aperçu des champs</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">Fiche d&apos;un animal</h3>
            </div>
            <span className="rounded-full border border-leather/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">Registre</span>
          </div>

          <dl className="mt-7 divide-y divide-leather/10 border-y border-leather/10">
            {['Identifiant', 'Espèce · race', 'Sexe · âge', 'Poids · valeur estimée', 'État de santé'].map((field) => (
              <div key={field} className="flex min-h-[49px] items-center justify-between gap-3 py-2.5">
                <dt className="text-sm text-ink-soft">{field}</dt>
                <dd className="font-mono text-xs tracking-wider text-ochre" aria-label="Champ à renseigner">— — —</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-ink-muted">La carte présente les champs disponibles, sans inventer de dossier d&apos;élevage.</p>

          <div className="absolute inset-x-5 bottom-5 inline-flex min-h-[48px] items-center justify-between rounded-full bg-leather px-5 text-sm font-semibold text-paper-light sm:inset-x-7 sm:bottom-7" aria-hidden="true">
            Voir les soins et vaccinations
            <ArrowDown size={16} />
          </div>
          <button
            type="button"
            onClick={() => setFlipped(true)}
            aria-pressed={flipped}
            className="absolute inset-0 rounded-[22px] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-5px] focus-visible:outline-ochre"
            aria-label="Retourner la fiche pour voir les soins et vaccinations"
          />
        </div>

        <div
          className="face-hidden absolute inset-0 flex flex-col overflow-hidden rounded-[22px] bg-leather-deep p-5 text-paper-light [transform:rotateY(180deg)] sm:p-7"
          inert={!flipped}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-ochre-bright">Au dos de la fiche</p>
              <h3 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Suivi des soins</h3>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-ochre-bright" aria-hidden="true">02</span>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-2">
            {['Vaccination', 'Traitement', 'Contrôle'].map((type) => (
              <span key={type} className="flex min-h-[42px] items-center justify-center rounded-full border border-paper/20 px-2 text-center text-[11px] text-paper/90">{type}</span>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-paper/15 bg-paper/5 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ochre-bright">Chaque soin peut noter</p>
            <ul className="mt-3 space-y-2 text-sm text-paper/85">
              <li>Date et animal concerné</li>
              <li>Vétérinaire, description et coût</li>
              <li>Statut et prochaine échéance, si besoin</li>
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {['Planifié', 'En cours', 'Fait'].map((status) => (
              <span key={status} className="rounded-full bg-sage px-3 py-1.5 text-xs font-medium text-paper-light">{status}</span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setFlipped(false)}
            aria-pressed={flipped}
            className="mt-auto inline-flex min-h-[48px] items-center justify-between rounded-full border border-paper/25 px-5 text-sm font-semibold text-paper-light transition-colors hover:bg-paper/10"
          >
            Revenir à la fiche
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
