// @ts-check
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

// Import direct, et non FlatCompat.
//
// La version precedente passait par `new FlatCompat().extends('next/core-web-vitals')`,
// necessaire du temps de Next 15 : eslint-config-next n'exposait pas encore ses configs
// au format plat. Depuis Next 16 il les expose (`eslint-config-next/core-web-vitals`
// rend directement un tableau de 4 configs plates), et FlatCompat, lui, ne sait plus
// les traduire : il produit une structure circulaire et ESLint s'arrete sur
// « TypeError: Converting circular structure to JSON », code de sortie 2.
//
// Autrement dit, le lint de ce depot ne DEMARRAIT PAS. Ce n'etait pas du lint sale,
// c'etait pas de lint du tout.

// Les deux configs sont necessaires : `core-web-vitals` seule n'apporte pas le plugin
// @typescript-eslint, et la regle no-explicit-any ci-dessous echouait alors sur
// « could not find plugin ». Du temps de FlatCompat, `next/core-web-vitals` au format
// eslintrc les embarquait ensemble ; au format plat elles sont separees.
const configuration = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]

export default configuration
