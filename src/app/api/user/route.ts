// src/app/api/user/route.ts
// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from "bcrypt";

// GET ALL USERS
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('tbl_users')
      .select('id_user, nama_lengkap, username, role, status_akun, foto_url, last_login')
      .order('id_user', { ascending: true });

    if (error) throw new Error(error.message);

    return NextResponse.json({
      code: 200, status: 'success', message: 'Data user berhasil diambil',
      data: data,
    });
  } catch (err) {
    return NextResponse.json({
      code: 500, status: 'fail', message: err instanceof Error ? err.message : 'Error',
    }, { status: 500 });
  }
}

// CREATE USER (REGISTER)
export async function POST(req: Request) {
  try {
    const { username, password, nama_lengkap, role } = await req.json();
    
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseAdmin
      .from('tbl_users')
      .insert({
        nama_lengkap,
        username,
        password: hashedPassword,
        role: role || 'Pelaksana',
        status_akun: 'Aktif'
      })
      .select()
      .single();

    if (error) {
       if (error.code === '23505') throw new Error('Username sudah terdaftar!');
       throw new Error(error.message);
    }

    return NextResponse.json({
      code: 200, status: 'success', message: 'User berhasil dibuat',
      data: data,
    });
  } catch (err) {
    return NextResponse.json({
      code: 500, status: 'fail', message: err instanceof Error ? err.message : 'Error',
    }, { status: 500 });
  }
}

// PATCH USER (EDIT)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id_user, nama_lengkap, role, status_akun } = body;

    if (!id_user) return NextResponse.json({ status: 'fail', message: 'ID User diperlukan' }, { status: 400 });

    // 🔥 FIX: Gunakan Record, bukan 'any' agar ESLint senang
    const payload: Record<string, string | number> = {};
    
    if (nama_lengkap) payload.nama_lengkap = nama_lengkap;
    if (role) payload.role = role;
    if (status_akun) payload.status_akun = status_akun;

    const { data, error } = await supabaseAdmin
      .from('tbl_users')
      .update(payload)
      .eq('id_user', id_user)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ status: 'success', data });
  } catch (err) {
    return NextResponse.json({ 
      status: 'fail', 
      message: err instanceof Error ? err.message : 'Error' 
    }, { status: 500 });
  }
}

// DELETE USER (Support Query Params untuk Generic Dialog)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ status: 'fail', message: 'ID diperlukan' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('tbl_users')
      .delete()
      .eq('id_user', id);

    if (error) throw error;

    return NextResponse.json({ status: 'success', message: 'User berhasil dihapus' });
  } catch (err) {
    return NextResponse.json({ status: 'fail', message: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}