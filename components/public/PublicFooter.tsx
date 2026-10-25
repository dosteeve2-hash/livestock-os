import Link from 'next/link'
import { ArrowUpRight, BookOpen } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="leather-grain bg-leather-deep px-5 py-12 text-paper sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-[1.4fr_1fr] sm:items-end">
        <div>
          <Link href="/" className="inline-flex min-h-[44px] items-center gap-2.5" aria-label="LivestockOS, accueil">
            <BookOpen size={21} strokeWidth={1.6} aria-hidden="true" />
            <span className="font-display text-2xl font-semibold">LivestockOS</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/75">
            Le carnet du berger, devenu numérique. Gardez vos notes de cheptel, de soins et de ventes au même endroit.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm sm:justify-self-end">
          <Link href="/tarifs" className="inline-flex min-h-[44px] items-center text-paper/85 transition-colors hover:text-ochre-bright">Tarifs</Link>
          <Link href="/auth/login" className="inline-flex min-h-[44px] items-center text-paper/85 transition-colors hover:text-ochre-bright">Connexion</Link>
          <Link href="/credits" className="inline-flex min-h-[44px] items-center text-paper/85 transition-colors hover:text-ochre-bright">Crédits photo</Link>
          <a href="mailto:docompaore2@gmail.com" className="inline-flex min-h-[44px] items-center gap-1 text-paper/85 transition-colors hover:text-ochre-bright">
            Nous écrire <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-paper/15 pt-5 text-xs text-paper/60 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} LivestockOS</span>
        <span>Un registre numérique. Des données saisies par l&apos;éleveur.</span>
      </div>
    </footer>
  )
}
