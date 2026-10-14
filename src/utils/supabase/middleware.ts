import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isAdmin } from '@/lib/auth/is-admin'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshes the auth token if needed
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes logic
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If we are on /admin/login, don't redirect to login again
    if (request.nextUrl.pathname === '/admin/login') {
      if (isAdmin(user)) {
        // If admin is logged in and visits login page, redirect to dashboard
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
      // Non-admins (e.g. store customers) stay here so they can sign in with an admin account
      return supabaseResponse
    }

    // If user is not logged in and visits any other /admin route, redirect to login
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Logged in but not an admin (e.g. a store customer): send back to the store
    if (!isAdmin(user)) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
