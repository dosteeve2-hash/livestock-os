import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth/server'
import { abonnementDe } from '@/lib/plans/db'
import TarifsClient from './TarifsClient'

export const metadata: Metadata = {
  title: 'Tarifs — LivestockOS',
  description:
    'Gratuit jusqu’à 20 têtes. Plan Troupeau à 3 000 FCFA par mois : passeports vérifiables illimités pour la microfinance.',
}

const ETAPES = [
  {
    n: '1',
    titre: 'Créez votre compte',
    texte: 'Gratuit, en deux minutes. Enregistrez vos premiers animaux — même sans réseau.',
  },
  {
    n: '2',
    titre: 'Envoyez le montant par Orange Money',
    texte: 'Puis écrivez-nous avec votre e-mail de connexion et la référence du transfert.',
  },
  {
    n: '3',
    titre: 'Votre plan est activé sous 24 h',
    texte: 'Vous recevez une confirmation. Rien à installer, rien à reconfigurer.',
  },
]

const FAQ = [
  {
    q: 'Que se passe-t-il si je dépasse 20 têtes en plan Éleveur ?',
    r: 'Vos animaux restent enregistrés. Vous ne pouvez simplement plus en ajouter, ni publier un passeport de plus de 20 têtes, tant que vous n’êtes pas passé au plan Troupeau.',
  },
  {
    q: 'Pourquoi payer pour un passeport ?',
    r: 'Parce qu’il est daté par le serveur et vérifiable par un lien : une microfinance peut constater elle-même l’ancienneté de votre suivi. C’est ce document qui ouvre l’accès au crédit — pas le registre.',
  },
  {
    q: 'Et si j’arrête de payer ?',
    r: 'Vous revenez au plan Éleveur. Aucune donnée n’est supprimée, jamais.',
  },
  {
    q: 'Pourquoi Orange Money et pas une carte bancaire ?',
    r: 'Parce que c’est ce que vous avez dans la poche. Le paiement par carte viendra, mais il ne passera jamais devant le mobile money.',
  },
]

export default async function TarifsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const abonnement = session
    ? await abonnementDe(session.user.id, session.user.email)
    : null

  const contactWhatsapp = process.env.NEXT_PUBLIC_ACTIVATION_WHATSAPP?.replace(/\D/g, '') || null
  const contactEmail = process.env.NEXT_PUBLIC_ACTIVATION_EMAIL || 'docompaore2@gmail.com'

  return (
    <main className="min-h-screen bg-[#0A1628] flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐄</span>
          <span className="text-lg font-bold text-[#D4AF37]">LivestockOS</span>
        </Link>
        <Link
          href={session ? '/dashboard' : '/auth/login'}
          className="text-sm text-[#00BCD4] hover:text-[#D4AF37] transition-colors font-medium"
        >
          {session ? 'Tableau de bord →' : 'Connexion →'}
        </Link>
      </header>

      <section className="px-6 pt-14 pb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#D4AF37] leading-tight mb-4">
          Gratuit jusqu&apos;à 20 têtes.
          <br />
          Ensuite, le prix d&apos;une dose de vaccin.
        </h1>
        <p className="text-white/60 text-base leading-relaxed">
          Un troupeau de 60 têtes vaut plusieurs millions de FCFA. Le suivre, le prouver et le
          présenter à une microfinance coûte 3 000 FCFA par mois.
        </p>
      </section>

      <section className="px-6 pb-16">
        <TarifsClient
          planActuel={abonnement?.effectif ?? null}
          connecte={Boolean(session)}
          contactWhatsapp={contactWhatsapp}
          contactEmail={contactEmail}
        />
      </section>

      <section id="activer" className="px-6 pb-16 max-w-2xl mx-auto w-full">
        <h2 className="text-[#D4AF37] font-bold text-lg mb-6 text-center">Comment activer un plan</h2>
        <ol className="space-y-4">
          {ETAPES.map((e) => (
            <li key={e.n} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-[#D4AF37] text-[#0A1628] font-bold flex items-center justify-center">
                {e.n}
              </span>
              <div>
                <div className="text-white font-semibold text-sm">{e.titre}</div>
                <div className="text-white/55 text-xs mt-1 leading-relaxed">{e.texte}</div>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-white/35 text-xs text-center mt-4">
          Contact :{' '}
          {contactWhatsapp ? (
            <a href={`https://wa.me/${contactWhatsapp}`} className="text-[#00BCD4] hover:underline">
              WhatsApp
            </a>
          ) : (
            <a href={`mailto:${contactEmail}`} className="text-[#00BCD4] hover:underline">
              {contactEmail}
            </a>
          )}
        </p>
      </section>

      <section className="px-6 pb-16 max-w-2xl mx-auto w-full">
        <h2 className="text-[#D4AF37] font-bold text-lg mb-6 text-center">Questions fréquentes</h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group bg-white/5 border border-white/10 rounded-xl p-4">
              <summary className="cursor-pointer text-white text-sm font-medium list-none flex justify-between items-center">
                {f.q}
                <span className="text-white/30 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-white/55 text-xs mt-3 leading-relaxed">{f.r}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="px-6 py-4 border-t border-white/10 text-center">
        <p className="text-white/40 text-xs">© 2026 LivestockOS · FORGE Afrika · Burkina Faso</p>
      </footer>
    </main>
  )
}
