import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // PERBAIKAN: Tambahkan 'await' di sini
  const cookieStore = await cookies();

  // Hapus semua cookie
  cookieStore.delete('user_role');
  cookieStore.delete('auth_token');
  cookieStore.delete('user_name');
  cookieStore.delete('user_photo');

  return NextResponse.json({
    status: 'success',
    message: 'Berhasil logout'
  });
}