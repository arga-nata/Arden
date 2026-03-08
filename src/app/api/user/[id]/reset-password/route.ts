import { NextResponse } from "next/server"
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { password } = await req.json()

  if (!password || password.length < 6) {
    return NextResponse.json(
      { message: "Invalid password" },
      { status: 400 }
    )
  }

  const { error } = await supabaseAdmin
    .from("tbl_users")
    .update({ password })
    .eq("id_user", params.id)

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
