// src/app/api/user/me/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const cookieStore = await cookies() // ✅ Harus diawait fungsinya
  const username = cookieStore.get("username")?.value

  if (!username) {
    return NextResponse.json({ status: "fail", data: null }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from("tbl_users")
    .select("id_user, nama_lengkap, username, role, status_akun, last_login, foto_url")
    .eq("username", username)
    .single()

  if (error || !data) {
    return NextResponse.json({ status: "fail", data: null }, { status: 404 })
  }

  return NextResponse.json({ status: "success", data })
}