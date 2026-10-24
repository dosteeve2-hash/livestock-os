'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useCollection } from '@/lib/store/useCollection'
import { ANIMAUX_SEED, SOINS_SEED, VENTES_SEED } from '@/lib/store/seed'
import { COLLECTIONS, type Animal, type Soin, type Vente } from '@/lib/store/types'
import { animauxPluriel, cheptelVivant, repartitionEspeces, valeurTroupeau } from '@/lib/store/derive'
import { useUserId } from '../UserContext'

interface Props {
  nom: string
  email: string
  membreDepuis: string
}

const ICONS: Record<Animal['espece'], string> = {
  Bovin: '🐄',
  Ovin: '🐑',
  Caprin: '🐐',
  Volaille: '🐔',
}

function fcfa(n: number) {
  return n.toLocaleString('fr-FR')
}

function dateLongue(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Douze derniers mois, borne incluse. */
function ilYaUnAn() {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 1)
  return d.toISOString().slice(0, 10)
}

export default function PasseportClient({ nom, email, membreDepuis }: Props) {
  const userId = useUserId()
  const [animaux] = useCollection<Animal>(userId, COLLECTIONS.animaux, ANIMAUX_SEED)
  const [soins] = useCollection<Soin>(userId, COLLECTIONS.soins, SOINS_SEED)
  const [ventes] = useCollection<Vente>(userId, COLLECTIONS.ventes, VENTES_SEED)

  const bilan = useMemo(() => {
    const depuis = ilYaUnAn()
    const vivants = cheptelVivant(animaux)
    const parEspece = repartitionEspeces(animaux)

    const soinsAn = soins.filter((s) => s.date >= depuis && s.statut === 'Fait')
    const ventesAn = ventes.filter((v) => v.date >= depuis)
    const encaisse = ventesAn.reduce((t, v) => t + v.prix, 0)
    const investiSante = soinsAn.reduce((t, s) => t + s.cout, 0)

    // Un animal est couvert s'il a reçu au moins une vaccination sur l'année.
    const vaccinesIds = new Set(
      soinsAn.filter((s) => s.type === 'Vaccination').map((s) => s.animal)
    )
    const couverts = vivants.filter((a) => vaccinesIds.has(a.id)).length
    const couverture = vivants.length === 0 ? 0 : Math.round((couverts / vivants.length) * 100)

    // Mois distincts ayant généré au moins une vente — mesure de régularité.
    const moisActifs = new Set(ventesAn.map((v) => v.date.slice(0, 7))).size

    return {
      vivants,
      parEspece,
      valeur: valeurTroupeau(animaux),
      soinsAn,
      ventesAn,
      encaisse,
      investiSante,
      couverture,
      couverts,
      moisActifs,
      depuis,
    }
  }, [animaux, soins, ventes])

  const [publication, setPublication] = useState<
    | { etat: 'repos' }
    | { etat: 'envoi' }
    | { etat: 'ok'; code: string }
    | { etat: 'erreur'; message: string; planInsuffisant?: boolean }
  >({ etat: 'repos' })

  async function publier() {
    setPublication({ etat: 'envoi' })
    try {
      const reponse = await fetch('/api/passeport/publier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nbTetes: bilan.vivants.length,
          valeurTotale: bilan.valeur,
          couvertureVaccinale: bilan.couverture,
          revenus12m: bilan.encaisse,
          nbVentes12m: bilan.ventesAn.length,
          payload: {
            parEspece: bilan.parEspece,
            investiSante: bilan.investiSante,
            moisActifs: bilan.moisActifs,
            inventaire: bilan.vivants.map((a) => ({
              id: a.id, espece: a.espece, race: a.race, age: a.age, valeur: a.valeur,
            })),
            ventes: [...bilan.ventesAn]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((v) => ({ date: v.date, acheteur: v.acheteur, prix: v.prix })),
          },
        }),
      })

      if (!reponse.ok) {
        const corps = await reponse.json().catch(() => ({}))
        setPublication({
          etat: 'erreur',
          message: corps.message ?? 'Publication impossible. Vérifiez votre connexion et réessayez.',
          planInsuffisant: reponse.status === 402,
        })
        return
      }

      const { code } = await reponse.json()
      setPublication({ etat: 'ok', code })
    } catch {
      setPublication({ etat: 'erreur', message: 'Publication impossible. Vérifiez votre connexion et réessayez.' })
    }
  }

  const editeLe = new Date().toISOString().slice(0, 10)

  return (
    <>
      {/* Le passeport doit rester lisible sur papier : fond blanc, encre noire,
          et on retire tout ce qui ne sert qu'à l'écran. */}
      <style>{`
        @media print {
          @page { margin: 14mm; }
          body { background: #fff !important; }
          header, nav, .no-print { display: none !important; }
          main { padding-bottom: 0 !important; }
          .passeport { max-width: none !important; padding: 0 !important; }
          .passeport * { color: #111 !important; border-color: #bbb !important; background: transparent !important; }
          .passeport .encadre { border: 1px solid #bbb !important; }
          .passeport .titre { color: #7a5c00 !important; }
          .passeport table { font-size: 10pt; }
          .passeport .saut { break-inside: avoid; }
        }
      `}</style>

      <div className="passeport px-4 py-6 max-w-lg mx-auto">
        {/* Actions — écran seulement */}
        <div className="no-print flex items-center justify-between mb-6 gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#D4AF37]">📄 Passeport du cheptel</h1>
            <p className="text-white/50 text-sm mt-1">Dossier à présenter à une microfinance</p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-[#D4AF37] text-[#0A1628] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#D4AF37]/90 transition-colors shrink-0"
          >
            Imprimer
          </button>
        </div>

        <div className="no-print bg-[#00BCD4]/10 border border-[#00BCD4]/30 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
          <span className="text-lg shrink-0">💡</span>
          <p className="text-white/70 text-xs leading-relaxed">
            Ce document rassemble les données saisies dans votre registre : taille du troupeau,
            suivi sanitaire et revenus des douze derniers mois. Les valeurs restent déclaratives.
            Imprimez-le ou enregistrez-le en PDF pour le transmettre.
          </p>
        </div>

        {/* Publication vérifiable */}
        <div className="no-print border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-xl p-4 mb-6">
          {publication.etat === 'ok' ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔗</span>
                <span className="text-[#D4AF37] text-sm font-semibold">Relevé publié</span>
              </div>
              <p className="text-white/60 text-xs mb-3 leading-relaxed">
                Transmettez ce lien à votre prêteur. Il y verra les mêmes chiffres, la date de
                publication enregistrée par le serveur, et l&apos;historique des relevés disponibles.
              </p>
              <div className="bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2.5 mb-2">
                <div className="text-white/40 text-[10px] mb-1">Code du relevé</div>
                <div className="text-[#D4AF37] font-mono text-base tracking-wider">{publication.code}</div>
              </div>
              <a
                href={`/verifier/${publication.code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs font-semibold text-[#0A1628] bg-[#D4AF37] rounded-lg py-2.5 hover:bg-[#D4AF37]/90 transition-colors"
              >
                Ouvrir la page de vérification
              </a>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔒</span>
                <span className="text-[#D4AF37] text-sm font-semibold">Rendre ce relevé vérifiable</span>
              </div>
              <p className="text-white/60 text-xs mb-3 leading-relaxed">
                Publier enregistre ces chiffres avec une date horodatée par le serveur et crée un
                lien consultable. Des publications successives documentent l&apos;historique de votre
                registre, sans garantir un financement.
              </p>
              {publication.etat === 'erreur' && (
                <p className="text-red-400 text-xs mb-2">
                  {publication.message}
                  {publication.planInsuffisant && (
                    <>
                      {' '}
                      <Link href="/tarifs" className="text-[#D4AF37] underline underline-offset-2">
                        Voir les plans →
                      </Link>
                    </>
                  )}
                </p>
              )}
              <button
                onClick={publier}
                disabled={publication.etat === 'envoi'}
                className="w-full text-xs font-bold text-[#0A1628] bg-[#D4AF37] rounded-lg py-2.5 hover:bg-[#D4AF37]/90 transition-colors disabled:opacity-60"
              >
                {publication.etat === 'envoi' ? 'Publication…' : 'Publier et obtenir un lien'}
              </button>
            </>
          )}
        </div>

        {/* En-tête du document */}
        <div className="encadre border border-white/10 rounded-xl p-5 mb-4 saut">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="titre text-[#D4AF37] font-bold text-lg leading-tight">
                Passeport du cheptel
              </div>
              <div className="text-white/40 text-[11px] mt-0.5">
                Édité le {dateLongue(editeLe)}
              </div>
            </div>
            <span className="text-2xl">🐄</span>
          </div>

          <dl className="space-y-2 text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-white/40">Éleveur</dt>
              <dd className="text-white font-medium text-right">{nom}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/40">Contact</dt>
              <dd className="text-white/80 text-right break-all">{email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/40">Suivi depuis</dt>
              <dd className="text-white/80 text-right">{dateLongue(membreDepuis)}</dd>
            </div>
          </dl>
        </div>

        {/* Synthèse */}
        <h2 className="titre text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">
          1 · Le troupeau aujourd&apos;hui
        </h2>
        <div className="encadre border border-white/10 rounded-xl p-5 mb-5 saut">
          <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-white/10">
            <div>
              <div className="text-3xl font-bold text-[#D4AF37]">{bilan.vivants.length}</div>
              <div className="text-white/40 text-[11px]">
                {bilan.vivants.length > 1 ? 'têtes vivantes' : 'tête vivante'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-[#00BCD4]">{fcfa(bilan.valeur)}</div>
              <div className="text-white/40 text-[11px]">FCFA — valeur estimée</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            {(Object.keys(bilan.parEspece) as Animal['espece'][]).map((esp) => (
              <div key={esp}>
                <div className="text-base">{ICONS[esp]}</div>
                <div className="text-white font-semibold text-sm">{bilan.parEspece[esp]}</div>
                <div className="text-white/40 text-[10px]">{esp}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Suivi sanitaire */}
        <h2 className="titre text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">
          2 · Suivi sanitaire sur douze mois
        </h2>
        <div className="encadre border border-white/10 rounded-xl p-5 mb-5 saut">
          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div>
              <div className="text-xl font-bold text-white">{bilan.soinsAn.length}</div>
              <div className="text-white/40 text-[10px] mt-0.5">soins réalisés</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-400">{bilan.couverture}%</div>
              <div className="text-white/40 text-[10px] mt-0.5">couverture vaccinale</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{fcfa(bilan.investiSante)}</div>
              <div className="text-white/40 text-[10px] mt-0.5">FCFA investis</div>
            </div>
          </div>
          <p className="text-white/50 text-[11px] leading-relaxed">
            {animauxPluriel(bilan.couverts)} sur {bilan.vivants.length}{' '}
            {bilan.couverts > 1 ? 'ont reçu' : 'a reçu'} au moins une vaccination sur la période. Un troupeau suivi tombe moins malade —
            ce relevé reprend les soins enregistrés dans votre registre. Il ne remplace pas un
            contrôle vétérinaire ni une vérification des animaux sur le terrain.
          </p>
        </div>

        {/* Revenus */}
        <h2 className="titre text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">
          3 · Revenus sur douze mois
        </h2>
        <div className="encadre border border-white/10 rounded-xl p-5 mb-5 saut">
          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div>
              <div className="text-xl font-bold text-[#D4AF37]">{fcfa(bilan.encaisse)}</div>
              <div className="text-white/40 text-[10px] mt-0.5">FCFA encaissés</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{bilan.ventesAn.length}</div>
              <div className="text-white/40 text-[10px] mt-0.5">ventes</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{bilan.moisActifs}/12</div>
              <div className="text-white/40 text-[10px] mt-0.5">mois avec vente</div>
            </div>
          </div>

          {bilan.ventesAn.length > 0 && (
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-1.5 text-white/40 font-medium">Date</th>
                  <th className="text-left py-1.5 text-white/40 font-medium">Acheteur</th>
                  <th className="text-right py-1.5 text-white/40 font-medium">Montant</th>
                </tr>
              </thead>
              <tbody>
                {[...bilan.ventesAn]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 8)
                  .map((v) => (
                    <tr key={v.id} className="border-b border-white/5">
                      <td className="py-1.5 text-white/60 whitespace-nowrap">
                        {new Date(v.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      </td>
                      <td className="py-1.5 text-white/80 truncate max-w-[120px]">{v.acheteur}</td>
                      <td className="py-1.5 text-right text-[#D4AF37] font-semibold whitespace-nowrap">
                        {fcfa(v.prix)} F
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Inventaire */}
        <h2 className="titre text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">
          4 · Inventaire détaillé
        </h2>
        <div className="encadre border border-white/10 rounded-xl p-5 mb-5">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-1.5 text-white/40 font-medium">Identifiant</th>
                <th className="text-left py-1.5 text-white/40 font-medium">Race</th>
                <th className="text-left py-1.5 text-white/40 font-medium">Âge</th>
                <th className="text-right py-1.5 text-white/40 font-medium">Valeur</th>
              </tr>
            </thead>
            <tbody>
              {bilan.vivants.map((a) => (
                <tr key={a.id} className="border-b border-white/5">
                  <td className="py-1.5 text-white font-medium whitespace-nowrap">
                    <span className="mr-1">{ICONS[a.espece]}</span>
                    {a.id}
                  </td>
                  <td className="py-1.5 text-white/60 truncate max-w-[110px]">{a.race}</td>
                  <td className="py-1.5 text-white/60 whitespace-nowrap">{a.age}</td>
                  <td className="py-1.5 text-right text-white/80 whitespace-nowrap">{fcfa(a.valeur)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {bilan.vivants.length === 0 && (
            <p className="text-white/40 text-xs text-center py-4">
              Aucun animal enregistré.
            </p>
          )}
        </div>

        {/* Mentions */}
        <div className="encadre border border-white/10 rounded-xl p-4 saut">
          <p className="text-white/40 text-[10px] leading-relaxed">
            Document généré par LivestockOS le {dateLongue(editeLe)} à partir des saisies de
            l&apos;éleveur. Les valeurs sont déclaratives et estimées par l&apos;exploitant : elles
            n&apos;engagent ni un vétérinaire ni un expert assermenté. Une visite de contrôle reste
            recommandée avant tout engagement financier.
          </p>
        </div>
      </div>
    </>
  )
}
