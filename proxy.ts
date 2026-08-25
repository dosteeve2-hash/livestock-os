import { getSessionCookie } from 'better-auth/cookies'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Garde optimiste : on ne lit que la présence du cookie de session, sans
 * requête base. La validation réelle se fait dans le layout /dashboard, qui
 * appelle `auth.api.getSession()` — un cookie forgé n'ouvre donc rien.
 */
export async function proxy(request: NextRequest) {
  const aUneSession = getSessionCookie(request) !== null
  const { pathname } = request.nextUrl

  if (!aUneSession && pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  if (aUneSession && pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|icons/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
