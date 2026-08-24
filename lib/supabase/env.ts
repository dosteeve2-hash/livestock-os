/**
 * Les `!` sur `process.env` faisaient crasher toute l'app — landing publique
 * comprise — avec une erreur Supabase opaque. On échoue ici, en nommant
 * précisément ce qui manque.
 */
function requis(nom: string, valeur: string | undefined) {
  if (!valeur) {
    throw new Error(
      `Variable d'environnement manquante : ${nom}. ` +
        `Copiez .env.example en .env.local et renseignez vos identifiants Supabase.`
    )
  }
  return valeur
}

export function supabaseEnv() {
  return {
    url: requis('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: requis(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  }
}
