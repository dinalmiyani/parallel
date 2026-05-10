import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/pricing',
  '/about',
  '/blog(.*)',
  '/(.*)/changelog',         
  '/api/subscribe(.*)',
  '/api/unsubscribe(.*)',
  '/api/confirm-email(.*)',
  '/api/webhooks(.*)',
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();
  const url = req.nextUrl.clone();

  if (userId && orgId && isAuthRoute(req)) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (userId && !orgId && !isOnboardingRoute(req) && !isPublicRoute(req)) {
    url.pathname = '/onboarding';
    return NextResponse.redirect(url);
  }

  if (!userId && !isPublicRoute(req)) {
    url.pathname = '/sign-in';
    url.searchParams.set('redirect_url', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};