// src/app/api/class/route.ts
import { NextResponse } from 'next/server';
import { ClassService } from '@/logic/dashboard/database/class.service';

export async function GET() {
  try {
    const data = await ClassService.getAllClasses();
    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.nama_kelas || !body.wali_kelas) {
      return NextResponse.json({ status: 'fail', message: 'Nama dan Wali Kelas wajib diisi' }, { status: 400 });
    }
    
    const data = await ClassService.createClass(body);
    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id_kelas) {
      return NextResponse.json({ status: 'fail', message: 'ID Kelas dibutuhkan' }, { status: 400 });
    }

    const data = await ClassService.updateClass(Number(body.id_kelas), body);
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

    await ClassService.deleteClassWithStudents(Number(id));
    return NextResponse.json({ status: 'success', message: 'Kelas dan seluruh siswanya berhasil dihapus' });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}