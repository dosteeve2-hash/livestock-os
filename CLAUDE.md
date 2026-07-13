# LivestockOS — Instructions Claude

## Stack
- Next.js 15 App Router + TypeScript strict (0 `any`)
- Supabase SSR : TOUJOURS `getUser()`, JAMAIS `getSession()`
- PWA offline-first (Workbox) — priorité mobile
- Framer Motion : `type: 'spring' as const`
- Charte : Navy #0A1628, Gold #D4AF37, Cyan #00BCD4

## Règles obligatoires
- Mobile-first en priorité absolue
- Pub/sub Supabase Realtime — JAMAIS de polling
- `npm run build` 0 erreurs avant chaque push
- Co-authored-by: Claude <claude@anthropic.com> dans chaque commit

## Contexte produit
App mobile éleveurs sahéliens. Interface ultra-simple, fonctionne offline.
