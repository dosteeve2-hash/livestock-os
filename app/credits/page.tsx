import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import credits from '@/lib/credits-photos.json'
import PublicFooter from '@/components/public/PublicFooter'
import PublicHeader from '@/components/public/PublicHeader'
import SkipLink from '@/components/public/SkipLink'

export const metadata: Metadata = {
  title: 'Crédits photo — LivestockOS',
  description: 'Sources, auteurs et licences des photographies utilisées sur LivestockOS.',
}

export default function CreditsPage() {
  return (
    <>
      <SkipLink />
      <PublicHeader />
      <main id="contenu" className="paper-grain min-h-screen bg-paper px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ochre">Transparence des images</p>
          <h1 className="mt-4 max-w-2xl font-display text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.035em] text-leather sm:text-6xl">
            Crédits photo
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            Ces images sont utilisées sous les licences indiquées ci-dessous. Les fichiers WebP ont été copiés depuis la bibliothèque Forge Africa avec leurs crédits d&apos;origine.
          </p>

          <ul className="mt-10 space-y-5">
            {credits.map((photo) => (
              <li key={photo.slug} className="grid overflow-hidden rounded-[18px] border border-leather/12 bg-paper-light sm:grid-cols-[minmax(200px,0.72fr)_1fr]">
                <div className="relative aspect-[4/3] bg-paper-deep sm:aspect-auto sm:min-h-[250px]">
                  <Image
                    src={photo.fichier}
                    alt={photo.slug === 'elevage-zebu' ? 'Un zébu brun au premier plan, suivi d’autres bovins.' : 'Des bovins réunis sous un arbre autour d’une mangeoire.'}
                    fill
                    sizes="(min-width: 640px) 36vw, 100vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 sm:p-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brick">{photo.slug}</p>
                  <h2 className="mt-2 font-display text-xl font-semibold text-leather sm:text-2xl">{photo.titre}</h2>
                  <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-[110px_1fr]">
                    <dt className="font-medium text-ink-muted">Auteur</dt>
                    <dd className="text-ink">{photo.auteur}</dd>
                    <dt className="font-medium text-ink-muted">Licence</dt>
                    <dd>
                      <a href={photo.licenceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center gap-1 font-medium text-sage underline decoration-sage/35 underline-offset-4 hover:decoration-sage">
                        {photo.licence}
                        <ArrowUpRight size={14} aria-hidden="true" />
                        <span className="sr-only">(ouvre un nouvel onglet)</span>
                      </a>
                    </dd>
                    <dt className="font-medium text-ink-muted">Page source</dt>
                    <dd className="break-all">
                      <a href={photo.source} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center text-sage underline decoration-sage/35 underline-offset-4 hover:decoration-sage">
                        Wikimedia Commons
                        <span className="sr-only">(ouvre un nouvel onglet)</span>
                      </a>
                    </dd>
                    <dt className="font-medium text-ink-muted">Modifications</dt>
                    <dd className="leading-relaxed text-ink-soft">{photo.modifications}</dd>
                  </dl>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <PublicFooter />
    </>
  )
}
