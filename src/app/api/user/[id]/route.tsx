
import { NextResponse } from "next/server"
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabaseAdmin
    .from("tbl_users")
    .delete()
    .eq("id_user", params.id)

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
