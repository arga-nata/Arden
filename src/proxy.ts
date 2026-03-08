import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Nama fungsi diubah dari middleware menjadi proxy
export function proxy(req: NextRequest) {
  const userRole = req.cookies.get('user_role')?.value
  const url = req.nextUrl.pathname

  // 1. PROTEKSI DASHBOARD (Admin & Pemantau)
  if (url.startsWith('/dashboard')) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Jika Pelaksana mencoba masuk Dashboard -> Tendang ke Mobile
    if (userRole === 'Pelaksana') {
      return NextResponse.redirect(new URL('/mobile', req.url)) 
    }
  }

  // 2. PROTEKSI MOBILE (Pelaksana)
  if (url.startsWith('/mobile')) { 
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Jika Admin iseng masuk tampilan HP -> Balikin ke Dashboard
    if (userRole === 'Admin' || userRole === 'Pemantau') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // 3. PROTEKSI HALAMAN LOGIN
  if (url.startsWith('/login') && userRole) {
    if (userRole === 'Pelaksana') {
      return NextResponse.redirect(new URL('/mobile', req.url)) // Update disini juga
    }
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next() 
}

// Update Config Matcher agar proxy jalan di route baru
export const config = {
  matcher: ['/dashboard/:path*', '/mobile/:path*', '/login'] // Ganti /app jadi /mobile
}