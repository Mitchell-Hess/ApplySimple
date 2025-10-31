import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthPage = nextUrl.pathname.startsWith('/auth');
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');

  // Allow API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  // Redirect non-logged-in users to sign in
  if (!isAuthPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next|favicon.ico|public).*)'],
};
