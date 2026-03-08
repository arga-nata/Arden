import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { supabaseAdmin } from '@/lib/supabase-admin'; // ✅ Pakai Admin (Bypass RLS)
import bcrypt from "bcrypt";

// Konfigurasi Secret Key untuk Token
const SECRET_KEY = process.env.JWT_SECRET || 'rahasia-kita';
const secret = new TextEncoder().encode(SECRET_KEY);

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // 1. Validasi Input Dasar
    if (!username || !password) {
      return NextResponse.json({
        code: 400,
        status: 'fail',
        message: 'Username dan password wajib diisi',
        data: null
      }, { status: 400 });
    }

    // 2. Cari User di Database (Menggunakan Admin Client untuk menembus RLS)
    const { data: userData, error: userError } = await supabaseAdmin
      .from('tbl_users')
      .select('id_user, nama_lengkap, role, username, password, foto_url')
      .eq('username', username)
      .limit(1)
      .maybeSingle();

    if (userError) throw new Error(userError.message);

    // Jika user tidak ditemukan
    if (!userData) {
      return NextResponse.json({
        code: 401,
        status: 'fail',
        message: 'Username tidak ditemukan',
        data: null
      }, { status: 401 });
    }

    // 3. Verifikasi Password (Hash vs Plain)
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return NextResponse.json({
        code: 401,
        status: 'fail',
        message: 'Password salah',
        data: null
      }, { status: 401 });
    }

    // 4. Generate Token JWT
    const token = await new SignJWT({
      id: userData.id_user,
      username: userData.username,
      role: userData.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h') // Token berlaku 24 jam
      .sign(secret);

    // 5. Update Waktu Login Terakhir
    // Kita simpan dalam UTC (Standar Internasional).
    // Frontend nanti yang akan mengubahnya jadi "WIB" saat ditampilkan.
    await supabaseAdmin
      .from('tbl_users')
      .update({ last_login: new Date().toISOString() }) 
      .eq('id_user', userData.id_user);

    // 6. Kirim Response Sukses
    return NextResponse.json({
      code: 200,
      status: 'success',
      message: 'Login berhasil',
      data: {
        token,
        id_user: userData.id_user,
        role: userData.role,
        nama_lengkap: userData.nama_lengkap,
        foto_url: userData.foto_url
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({
      code: 500,
      status: 'fail',
      message: err instanceof Error ? err.message : 'Terjadi kesalahan sistem',
      data: null
    }, { status: 500 });
  }
}