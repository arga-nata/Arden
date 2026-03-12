import { NextResponse } from 'next/server';
import { SiswiService } from '@/logic/dashboard/database/siswi.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!Array.isArray(body)) {
      return NextResponse.json({ status: 'fail', message: 'Data harus berupa array' }, { status: 400 });
    }

    // Panggil Service Import
    const count = await SiswiService.importSiswi(body);

    return NextResponse.json({ status: 'success', count });
  } catch (err: any) {
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 });
  }
}