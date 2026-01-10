import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * Middleware for route protection and authentication
 * Runs on every request to protected routes
 */

// Routes that require authentication
const protectedRoutes = [
  '/perfil',
  '/issues/new',
  '/issues/mis-casos',
  '/grabador',
];

// Routes that should redirect to home if already authenticated
const authRoutes = [
  '/auth/login',
  '/auth/register',
];

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/recursos',
  '/constitucion',
  '/offline',
  '/api/auth/login',
  '/api/auth/register',
];

/**
 * Verify JWT token
 */
async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
    );
    
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Check if route is protected
 */
function isProtectedRoute(pathname) {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

/**
 * Check if route is auth route
 */
function isAuthRoute(pathname) {
  return authRoutes.some(route => pathname.startsWith(route));
}

/**
 * Check if route is public
 */
function isPublicRoute(pathname) {
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route));
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes (except auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/videos') ||
    pathname.includes('.') && !pathname.includes('/api/')
  ) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('accessToken')?.value;
  
  // Verify token if present
  let user = null;
  if (token) {
    user = await verifyToken(token);
  }

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!user) {
      // Redirect to login with return URL
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // User is authenticated, allow access
    return NextResponse.next();
  }

  // Handle auth routes (login, register)
  if (isAuthRoute(pathname)) {
    if (user) {
      // User is already authenticated, redirect to home or specified redirect
      const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    
    // User is not authenticated, allow access to auth pages
    return NextResponse.next();
  }

  // Public routes - allow access
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|videos|.*\\..*|sw.js|manifest.json).*)',
  ],
};
