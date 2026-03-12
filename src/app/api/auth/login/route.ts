// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AuthService } from '@/logic/auth/service'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ status: 'fail', message: 'Input tidak lengkap' }, { status: 400 })
    }

    // 1. Panggil Service Logika
    const user = await AuthService.verifyCredentials(username, password)
    const token = await AuthService.generateToken({
      id: Number(user.id_user), // Prisma BigInt perlu di-cast jika dikirim via JSON
      username: user.username,
      role: user.role || 'Pelaksana'
    })

    // 2. Set Cookies Langsung dari Server (Lebih Aman)
    const cookieStore = await cookies()
    const cookieOptions = { 
      path: '/', 
      maxAge: 86400, // 24 jam
      sameSite: 'lax' as const
    }

    cookieStore.set('auth_token', token, { ...cookieOptions, httpOnly: true }) // httpOnly = Aman dari XSS
    cookieStore.set('user_role', user.role || 'Pelaksana', cookieOptions)
    cookieStore.set('user_name', user.nama_lengkap, cookieOptions)
    if (user.foto_url) {
      cookieStore.set('user_photo', user.foto_url, cookieOptions)
    }

    return NextResponse.json({
      status: 'success',
      message: 'Login berhasil',
      data: { role: user.role } // Frontend cuma butuh role untuk nentukan rute redirect
    })

  } catch (err) {
    return NextResponse.json({
      status: 'fail',
      message: err instanceof Error ? err.message : 'Kesalahan server'
    }, { status: 401 })
  }
}