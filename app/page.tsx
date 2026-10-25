import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownRight, ArrowRight, BookOpenCheck, HeartPulse, ReceiptText } from 'lucide-react'
import PublicFooter from '@/components/public/PublicFooter'
import PublicHeader from '@/components/public/PublicHeader'
import HeroEnclos from '@/components/public/HeroEnclos'
import AnimalFlipCard from '@/components/public/AnimalFlipCard'
import HealthTimeline from '@/components/public/HealthTimeline'
import PassportSpecimen from '@/components/public/PassportSpecimen'
import SkipLink from '@/components/public/SkipLink'

const OUTILS = [
  {
    num: '01',
    titre: 'Le cheptel',
    texte: 'Une fiche par animal avec son identifiant, son espèce, sa race, son âge, son poids et sa valeur estimée.',
    Icone: BookOpenCheck,
  },
  {
    num: '02',
    titre: 'Les soins',
    texte: 'Vaccinations, traitements et contrôles avec dates, statut, vétérinaire et prochaine échéance si besoin.',
    Icone: HeartPulse,
  },
  {
    num: '03',
    titre: 'Les ventes',
    texte: 'Consignez la date, l’animal, l’acheteur, le prix réellement reçu et le mode de paiement.',
    Icone: ReceiptText,
  },
]

export default function LandingPage() {
  return (
    <>
      <SkipLink />
      <PublicHeader />

      <main id="contenu">
        <HeroEnclos />

        <section className="paper-grain bg-paper px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36" aria-labelledby="titre-carnet">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ochre">Un carnet qui se feuillette autrement</p>
              <h2 id="titre-carnet" className="mt-4 max-w-[12ch] font-display text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.03em] text-leather sm:text-5xl lg:text-6xl">
                L&apos;histoire du troupeau, bête par bête.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft">
                Enregistrez les animaux, gardez la trace des soins et notez les ventes. Les éléments du registre suivent les champs réellement disponibles dans l&apos;application.
              </p>
              <div className="mt-8 flex items-center gap-3 border-l-2 border-brick pl-4 text-sm leading-relaxed text-ink-muted">
                <span>Pas de troupeau d&apos;exemple présenté comme réel : votre registre commence avec vos propres saisies.</span>
              </div>
            </div>

            <figure className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-paper-deep">
                <Image
                  src="/images/photos/elevage-troupeau.webp"
                  alt="Des bovins rassemblés sous un arbre autour d'une mangeoire."
                  fill
                  sizes="(min-width: 1024px) 54vw, 100vw"
                  loading="lazy"
                  className="object-cover object-center"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-muted sm:text-[10px]">
                <span>Le suivi commence par une fiche claire</span>
                <span className="text-brick">01 / Cheptel</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="cheptel" className="bg-paper-light px-5 py-20 sm:px-8 sm:py-28 lg:px-10" aria-labelledby="titre-fiche">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-center lg:gap-20">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage">La fiche, recto verso</p>
              <h2 id="titre-fiche" className="mt-4 max-w-[13ch] font-display text-[2.5rem] font-semibold leading-[1.03] tracking-[-0.03em] text-leather sm:text-5xl">
                Du repère de l&apos;animal à son carnet de soins.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft">
                Touchez la fiche pour découvrir les informations que l&apos;application conserve. Son recto présente les champs du cheptel ; son verso rassemble les soins et leur statut.
              </p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sage">
                <ArrowDownRight size={16} aria-hidden="true" />
                Touchez ou utilisez Entrée pour retourner la fiche
              </p>
            </div>
            <AnimalFlipCard />
          </div>
        </section>

        <section className="leather-grain bg-leather-deep px-5 py-20 text-paper-light sm:px-8 sm:py-28 lg:px-10" aria-labelledby="titre-sante">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ochre-bright">Le fil des soins</p>
              <h2 id="titre-sante" className="mt-4 max-w-[11ch] font-display text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                Se souvenir du prochain geste.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-paper/75">
                Chaque soin peut être planifié, suivi en cours, puis marqué comme fait. La frise reprend les statuts du registre, sans inventer de rendez-vous ni de dates.
              </p>
            </div>
            <HealthTimeline />
          </div>
        </section>

        <section id="passeport" className="paper-grain bg-paper px-5 py-20 sm:px-8 sm:py-28 lg:px-10" aria-labelledby="titre-passeport">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
            <PassportSpecimen />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brick">Un document à transmettre</p>
              <h2 id="titre-passeport" className="mt-4 max-w-[12ch] font-display text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.03em] text-leather sm:text-5xl lg:text-6xl">
                Un lien daté. Un suivi consultable.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
                Depuis le tableau de bord, publiez un passeport avec les données de votre registre. Le lien permet de consulter le relevé et sa date de publication, enregistrée par le serveur.
              </p>
              <p className="mt-4 max-w-xl border-l-2 border-brick pl-4 text-sm leading-relaxed text-ink-muted">
                Les données restent déclaratives : le lien atteste la publication du relevé, pas l&apos;existence physique des animaux ni leur valeur.
              </p>
              <Link href="/auth/register" className="group mt-7 inline-flex min-h-[48px] items-center gap-3 rounded-full border border-leather/30 px-5 text-sm font-semibold text-leather transition-colors hover:border-sage hover:bg-sage hover:text-paper-light">
                Créer mon registre
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-paper-deep px-5 py-20 sm:px-8 sm:py-28 lg:px-10" aria-labelledby="titre-outils">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 md:grid-cols-[1fr_0.8fr] md:items-end md:gap-10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ochre">Le registre au quotidien</p>
                <h2 id="titre-outils" className="mt-4 max-w-[12ch] font-display text-[2.65rem] font-semibold leading-[1.03] tracking-[-0.03em] text-leather sm:text-5xl">
                  Des notes utiles, au même endroit.
                </h2>
              </div>
              <p className="max-w-xl pb-1 text-sm leading-relaxed text-ink-soft sm:text-base">
                L&apos;application est pensée pour le terrain. Le registre fonctionne hors connexion sur l&apos;appareil utilisé.
              </p>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-[18px] border border-leather/10 bg-leather/10 md:grid-cols-3">
              {OUTILS.map(({ num, titre, texte, Icone }) => (
                <article key={num} className="paper-grain min-w-0 bg-paper-light p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-brick">{num}</span>
                    <Icone size={19} strokeWidth={1.6} className="text-sage" aria-hidden="true" />
                  </div>
                  <h3 className="mt-7 font-display text-2xl font-semibold text-leather">{titre}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{texte}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-l-2 border-brick pl-4 text-xs leading-relaxed text-ink-muted sm:flex-row sm:gap-8 sm:text-sm">
              <p>Les saisies du cheptel restent stockées localement sur cet appareil ; elles ne sont pas synchronisées entre plusieurs appareils.</p>
              <p className="shrink-0 font-medium text-brick">La commande vocale en langues locales est à venir.</p>
            </div>
          </div>
        </section>

        <section className="bg-sage px-5 py-16 text-paper-light sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/75">Pour commencer</p>
              <h2 className="mt-3 max-w-[16ch] font-display text-3xl font-semibold leading-tight sm:text-4xl">Votre prochain carnet peut commencer ici.</h2>
            </div>
            <Link href="/tarifs" className="group inline-flex min-h-[50px] shrink-0 items-center justify-between gap-5 rounded-full bg-paper-light py-1.5 pl-6 pr-2 text-sm font-semibold text-sage transition-[transform,background-color] duration-300 hover:bg-paper active:scale-[0.98]">
              Voir les tarifs
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage/10 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  )
}
