import { NextResponse } from "next/server"
import { UserService } from "@/logic/dashboard/database/user.service"

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_user, new_password } = body;

    if (!id_user || !new_password) {
      return NextResponse.json({ status: 'fail', message: 'ID dan Password Baru wajib diisi' }, { status: 400 });
    }

    await UserService.resetPassword(Number(id_user), new_password);
    return NextResponse.json({ status: 'success', message: 'Password berhasil direset' });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}