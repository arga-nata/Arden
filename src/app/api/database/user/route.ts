import { NextResponse } from 'next/server';
import { UserService } from '@/logic/dashboard/database/user.service';

export async function GET() {
  try {
    const data = await UserService.getAllUsers();
    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await UserService.createUser(body);
    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: err.message.includes('terdaftar') ? 400 : 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id_user) return NextResponse.json({ status: 'fail', message: 'ID User diperlukan' }, { status: 400 });
    
    const data = await UserService.updateUser(Number(body.id_user), body);
    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'fail', message: 'ID diperlukan' }, { status: 400 });

    await UserService.deleteUser(Number(id));
    return NextResponse.json({ status: 'success', message: 'User berhasil dihapus' });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}