import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API auth routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check if user has session token
  const sessionToken = request.cookies.get('authjs.session-token') || request.cookies.get('__Secure-authjs.session-token');
  const isLoggedIn = !!sessionToken;

  const isAuthPage = pathname.startsWith('/auth');
  const isPasswordResetPage = pathname === '/auth/reset-password' || pathname === '/auth/forgot-password';

  // Redirect logged-in users away from auth pages (except password reset pages)
  if (isAuthPage && isLoggedIn && !isPasswordResetPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect non-logged-in users to sign in
  if (!isAuthPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon|icon|public).*)'],
};
