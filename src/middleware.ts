import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    // Vérifier spécifiquement l'erreur "User from sub claim in JWT does not exist"
    if (error?.message === 'User from sub claim in JWT does not exist') {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/connexion', req.url));
    }

    // Si on accède au dashboard et qu'il n'y a pas de session
    if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
      return NextResponse.redirect(new URL('/connexion', req.url));
    }

    // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion ou d'inscription
    if (session && (req.nextUrl.pathname === '/connexion' || req.nextUrl.pathname === '/inscription')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
  } catch (e) {
    return NextResponse.redirect(new URL('/connexion', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/connexion', '/inscription'],
};
