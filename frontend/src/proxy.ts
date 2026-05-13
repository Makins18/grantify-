import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Fallback keys for local dev if not set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // This will refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Protect /dashboard routes
  const isDemo = request.cookies.has('grantify_demo');

  // Strict separation: standard users vs B2B partners
  if (!user && !isDemo && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/b2b/dashboard'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && request.nextUrl.pathname.startsWith('/b2b/dashboard')) {
    // Assuming B2B partners have a specific role in metadata
    const role = user.user_metadata?.role;
    if (role !== 'b2b_partner') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard' // Redirect unauthorized users back to normal dashboard
      return NextResponse.redirect(url)
    }
  }

  // Redirect to dashboard if logged in and on login/home page
  if ((user || isDemo) && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
