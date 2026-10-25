import { CircleAlert, Store } from 'lucide-react'

export default function MarchePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-10">
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#D4AF37]/70">Repères de vente</p>
        <h1 className="mt-2 text-xl font-bold text-[#D4AF37]">Prix du marché</h1>
      </div>

      <section className="rounded-2xl border border-[#D4AF37]/20 bg-white/[0.04] p-5 sm:p-6" aria-labelledby="marche-indisponible">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]" aria-hidden="true">
          <Store size={20} strokeWidth={1.7} />
        </span>
        <h2 id="marche-indisponible" className="mt-5 text-base font-semibold text-white">Aucune cotation vérifiée disponible</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Les montants affichés auparavant étaient des données de démonstration, sans source de marché reliée ni actualisation vérifiable. Ils ont été retirés.
        </p>
        <div className="mt-5 flex items-start gap-3 border-t border-white/10 pt-4">
          <CircleAlert size={17} className="mt-0.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-white/65">
            Vérifiez les prix auprès des marchés ou acheteurs locaux avant toute transaction. Aucun prix indicatif n&apos;est fourni ici.
          </p>
        </div>
      </section>
    </div>
  )
}
