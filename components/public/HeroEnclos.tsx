'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function HeroEnclos() {
  const scene = useRef<HTMLElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [wideScreen, setWideScreen] = useState(false)
  const [entered, setEntered] = useState(false)
  const enteredRef = useRef(false)

  const { scrollYProgress } = useScroll({
    target: scene,
    offset: ['start start', 'end end'],
  })
  const top = useTransform(scrollYProgress, [0.05, 0.68], [wideScreen ? 11 : 58, 0])
  const right = useTransform(scrollYProgress, [0.05, 0.68], [5, 0])
  const bottom = useTransform(scrollYProgress, [0.05, 0.68], [wideScreen ? 8 : 4, 0])
  const left = useTransform(scrollYProgress, [0.05, 0.68], [wideScreen ? 52 : 5, 0])
  const radius = useTransform(scrollYProgress, [0.05, 0.68], [18, 0])
  const clipPath = useMotionTemplate`inset(${top}% ${right}% ${bottom}% ${left}% round ${radius}px)`
  const imageScale = useTransform(scrollYProgress, [0, 0.68], [1.12, 1])

  useEffect(() => {
    const motionSetting = window.matchMedia('(prefers-reduced-motion: reduce)')
    const viewportSetting = window.matchMedia('(min-width: 768px)')
    const updateMotion = () => setReducedMotion(motionSetting.matches)
    const updateViewport = () => setWideScreen(viewportSetting.matches)

    updateMotion()
    updateViewport()
    motionSetting.addEventListener('change', updateMotion)
    viewportSetting.addEventListener('change', updateViewport)

    return () => {
      motionSetting.removeEventListener('change', updateMotion)
      viewportSetting.removeEventListener('change', updateViewport)
    }
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!enteredRef.current && progress > 0.72) {
      enteredRef.current = true
      setEntered(true)
    } else if (enteredRef.current && progress < 0.66) {
      enteredRef.current = false
      setEntered(false)
    }
  })

  const content = (
    <>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ochre-bright sm:text-xs">Un registre à hauteur de troupeau</p>
      <h1 className="mt-5 max-w-[15ch] font-display text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.035em] text-paper-light sm:text-6xl lg:text-[5rem]">
        Le carnet du berger, devenu numérique.
      </h1>
      <p className="mt-5 max-w-[37ch] text-sm leading-relaxed text-paper/80 sm:text-base lg:text-lg">
        Cheptel, soins et ventes saisies : les notes utiles réunies dans un registre accessible depuis votre téléphone.
      </p>
      <Link
        href="/auth/register"
        className="group mt-7 inline-flex min-h-[50px] items-center gap-3 rounded-full bg-ochre-bright py-1.5 pl-6 pr-2 text-sm font-semibold text-leather-deep transition-[transform,background-color] duration-300 hover:bg-paper-light active:scale-[0.98]"
      >
        Créer un compte gratuit
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-leather-deep/10 transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </Link>
      <p className="mt-3 text-xs text-paper/70">Gratuit jusqu&apos;à 20 têtes · Sans engagement</p>
    </>
  )

  if (reducedMotion) {
    return (
      <section className="leather-grain bg-leather-deep px-5 pb-8 pt-10 text-paper-light sm:px-8 sm:pb-12 sm:pt-14">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-12">
          <div>{content}</div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-paper-deep">
            <Image
              src="/images/photos/elevage-zebu.webp"
              alt="Un zébu brun au premier plan, suivi d’autres bovins."
              fill
              priority
              sizes="(min-width: 768px) 52vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={scene} className="relative h-[185svh] bg-leather-deep md:h-[200svh]" aria-label="Découvrir le registre LivestockOS">
      <div className="leather-grain sticky top-0 h-[100svh] min-h-[640px] overflow-hidden bg-leather-deep">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_34%,rgba(128,93,51,0.2),transparent_45%)]" aria-hidden="true" />

        <div className="absolute inset-0 z-10 mx-auto flex max-w-7xl items-start px-5 pt-[9svh] sm:px-8 md:items-center md:pt-0">
          <div className="max-w-xl md:max-w-[47%]" inert={entered}>
            {content}
          </div>
        </div>

        <motion.div style={{ clipPath }} className="absolute inset-0 z-20 overflow-hidden will-change-[clip-path]">
          <motion.div style={{ scale: imageScale }} className="absolute inset-0">
            <Image
              src="/images/photos/elevage-zebu.webp"
              alt="Un zébu brun au premier plan, suivi d’autres bovins."
              fill
              priority
              sizes="100vw"
              className="object-cover object-[57%_center]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-leather-deep/90 via-leather-deep/15 to-leather-deep/10" aria-hidden="true" />
          <motion.div
            initial={false}
            animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-12 sm:px-8 sm:pb-16"
            inert={!entered}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ochre-bright sm:text-xs">Chaque bête compte</p>
            <p className="mt-3 max-w-[18ch] font-display text-3xl font-semibold leading-[1.05] text-paper-light sm:text-5xl lg:text-6xl">
              Le suivi reste avec vous, où que le troupeau vous mène.
            </p>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-4 right-5 z-30 font-mono text-[10px] tracking-[0.14em] text-paper/70 sm:right-8" aria-hidden="true">
          DÉFILER POUR ENTRER <span className="ml-1 text-ochre-bright">↓</span>
        </div>
      </div>
    </section>
  )
}
