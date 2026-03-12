import { NextResponse } from 'next/server';
import { SiswiService } from '@/logic/dashboard/database/siswi.service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const icode = searchParams.get('icode');

    if (icode) {
      const data = await SiswiService.getSiswiByCode(icode);
      return NextResponse.json({ status: 'success', data });
    } else {
      const data = await SiswiService.getAllSiswi();
      return NextResponse.json({ status: 'success', data });
    }
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: err.message.includes('ditemukan') ? 404 : 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await SiswiService.createSiswi(body);
    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id_siswi) return NextResponse.json({ status: 'fail', message: 'ID diperlukan' }, { status: 400 });
    
    const data = await SiswiService.updateSiswi(Number(body.id_siswi), body);
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

    await SiswiService.deleteSiswi(Number(id));
    return NextResponse.json({ status: 'success', message: 'Data berhasil dihapus' });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}