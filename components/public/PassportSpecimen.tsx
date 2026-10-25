import { ShieldCheck } from 'lucide-react'

const LIGNES = [
  ['Le troupeau', 'Données déclarées'],
  ['Le suivi sanitaire', 'Soins consignés'],
  ['Les ventes', 'Historique saisi'],
]

export default function PassportSpecimen() {
  return (
    <div className="relative mx-auto w-full max-w-[510px]">
      <div className="absolute -inset-3 rotate-[-3deg] rounded-[24px] border border-ochre/15 bg-paper-deep/80" aria-hidden="true" />
      <article className="paper-grain relative overflow-hidden rounded-[20px] border border-leather/15 bg-paper-light p-5 shadow-[0_30px_80px_rgba(43,36,29,0.22)] sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-leather/15 pb-5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ochre">LivestockOS · Registre</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-leather sm:text-3xl">Passeport du cheptel</h3>
            <p className="mt-1 text-xs text-ink-muted">Aperçu du document, sans données d&apos;éleveur</p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sage/35 text-sage" aria-hidden="true">
            <ShieldCheck size={24} strokeWidth={1.5} />
          </span>
        </div>

        <dl className="mt-4 divide-y divide-leather/10">
          {LIGNES.map(([titre, valeur]) => (
            <div key={titre} className="flex min-h-[51px] items-center justify-between gap-3 py-2.5">
              <dt className="text-sm font-medium text-ink">{titre}</dt>
              <dd className="text-right text-xs text-ink-muted">{valeur}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-sage/20 bg-sage/[0.06] p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage text-paper-light" aria-hidden="true">
            <ShieldCheck size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-sage">Lien de vérification</p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">Date de publication horodatée par le serveur</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-leather/20 pt-4">
          <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-ink-muted">Document généré depuis les saisies<br />de l&apos;éleveur</span>
          <span className="rounded-full border border-brick/35 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-brick">Déclaratif</span>
        </div>
      </article>
    </div>
  )
}
