import Link from 'next/link'
import ProjectVideo from '@/components/ProjectVideo'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0A1628] flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐄</span>
          <span className="text-lg font-bold text-[#D4AF37]">LivestockOS</span>
        </div>
        <nav className="flex items-center gap-5">
          <Link
            href="/tarifs"
            className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors font-medium"
          >
            Tarifs
          </Link>
          <Link
            href="/auth/login"
            className="text-sm text-[#00BCD4] hover:text-[#D4AF37] transition-colors font-medium"
          >
            Connexion →
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 px-6 py-16 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="text-6xl mb-6">🐄</div>
        <h1 className="text-3xl font-bold text-[#D4AF37] mb-4 leading-tight">
          Le dossier que la microfinance accepte
        </h1>
        <p className="text-white/70 text-base mb-3 leading-relaxed">
          Votre troupeau, prouvé, daté, vérifiable en un lien. Plus un animal perdu sans preuve,
          plus un vaccin oublié.
        </p>
        <p className="text-white/60 text-sm mb-8 leading-relaxed">
          Registre du cheptel, santé et ventes depuis votre téléphone — même sans réseau.
          Gratuit jusqu&apos;à 20 têtes.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/auth/register"
            className="w-full py-4 bg-[#D4AF37] text-[#0A1628] rounded-xl font-bold text-base hover:bg-[#D4AF37]/90 transition-colors"
          >
            Commencer gratuitement
          </Link>
          <Link
            href="/auth/login"
            className="w-full py-4 border border-[#D4AF37]/40 text-[#D4AF37] rounded-xl font-medium text-base hover:bg-[#D4AF37]/10 transition-colors"
          >
            J&apos;ai déjà un compte
          </Link>
          <Link
            href="/auth/login?demo=true"
            className="w-full py-3 text-[#00BCD4] text-sm hover:underline transition-colors"
          >
            🎯 Essayer la démo sans inscription
          </Link>
        </div>
      </section>

      {/* Vidéo */}
      <section className="px-6 pb-12 max-w-2xl mx-auto w-full text-center">
        <h2 className="text-[#D4AF37] font-bold text-lg mb-4">LivestockOS en vidéo</h2>
        <ProjectVideo slug="livestock" lang="fr" title="Vidéo de présentation de LivestockOS" />
        <div className="flex flex-col sm:flex-row gap-3 mt-5 justify-center">
          <Link
            href="/tarifs"
            className="px-6 py-3 bg-[#D4AF37] text-[#0A1628] rounded-xl font-bold text-base hover:bg-[#D4AF37]/90 transition-colors"
          >
            Voir les tarifs
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 border border-[#D4AF37]/40 text-[#D4AF37] rounded-xl font-medium text-base hover:bg-[#D4AF37]/10 transition-colors"
          >
            Créer un compte gratuit
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-16 max-w-md mx-auto w-full">
        <h2 className="text-[#D4AF37] font-bold text-lg mb-6 text-center">
          Tout ce dont vous avez besoin
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📄', title: 'Passeport', desc: 'Vérifiable par le prêteur' },
            { icon: '🐄', title: 'Cheptel', desc: 'Registre complet' },
            { icon: '🩺', title: 'Santé', desc: 'Vaccins & soins' },
            { icon: '💰', title: 'Ventes', desc: 'Chiffre d’affaires réel' },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-semibold text-[#D4AF37] text-sm">{f.title}</div>
              <div className="text-white/60 text-xs mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-white/10 text-center">
        <p className="text-white/60 text-xs">
          © 2026 LivestockOS · FORGE Afrika · Burkina Faso
        </p>
      </footer>
    </main>
  )
}
