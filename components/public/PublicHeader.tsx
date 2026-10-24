import Link from 'next/link'
import { ArrowUpRight, BookOpen } from 'lucide-react'

export default function PublicHeader() {
  return (
    <header className="relative z-30 border-b border-leather/10 bg-paper-light/95 px-4 sm:px-7 lg:px-10">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-3">
        <Link href="/" className="flex min-h-[48px] shrink-0 items-center gap-2.5" aria-label="LivestockOS, accueil">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-leather text-paper-light">
            <BookOpen size={19} strokeWidth={1.7} aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[1.3rem] font-semibold tracking-tight text-leather">LivestockOS</span>
            <span className="hidden text-[10px] uppercase tracking-[0.17em] text-ink-muted sm:block">Le carnet du troupeau</span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="flex items-center gap-1 sm:gap-3 lg:gap-6">
          <Link href="/#cheptel" className="hidden min-h-[44px] items-center px-2 text-sm text-ink-soft transition-colors hover:text-ochre md:inline-flex">
            Le suivi
          </Link>
          <Link href="/#passeport" className="hidden min-h-[44px] items-center px-2 text-sm text-ink-soft transition-colors hover:text-ochre md:inline-flex">
            Passeport
          </Link>
          <Link href="/tarifs" className="inline-flex min-h-[44px] items-center px-2 text-sm font-medium text-ink-soft transition-colors hover:text-ochre">
            Tarifs
          </Link>
          <Link href="/auth/login" className="inline-flex min-h-[44px] items-center px-2 text-sm text-ink-soft transition-colors hover:text-ochre">
            Connexion
          </Link>
          <Link
            href="/auth/register"
            className="hidden min-h-[48px] items-center gap-2 rounded-full bg-ochre px-5 text-sm font-semibold text-paper-light transition-[background-color,transform] duration-300 hover:bg-leather active:scale-[0.98] sm:inline-flex"
          >
            Créer un compte
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  )
}
