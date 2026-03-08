// src/app/api/siswi/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { randomUUID } from 'crypto';
export const dynamic = 'force-dynamic';

// Helper: Title Case
const toTitleCase = (str: string) => {
  if (!str) return "";
  return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
}

// [BARU] Helper: Generate ICODE
const generateIcode = () => {
  const uniquePart = randomUUID().split('-')[0].toUpperCase();
  return `ARD-${uniquePart}`;
}

// --- GET: Ambil Data (Smart Mode) ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const icode = searchParams.get('icode');

    // SKENARIO 1: Jika ada ICODE (Untuk Scanner Mobile)
    if (icode) {
      const { data, error } = await supabaseAdmin
        .from('tbl_siswi')
        .select(`*, tbl_kelas ( nama_kelas )`)
        .or(`icode.eq.${icode},nis.eq.${icode}`)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { status: 'fail', message: 'Data siswa tidak ditemukan' }, 
          { status: 404 }
        );
      }
      return NextResponse.json({ status: 'success', data });
    } 
    
    // SKENARIO 2: Jika TIDAK ADA ICODE (Untuk Table Dashboard)
    else {
      const { data, error } = await supabaseAdmin
        .from('tbl_siswi')
        .select(`*, tbl_kelas ( nama_kelas )`)
        // Opsional: Urutkan berdasarkan kelas, lalu nama
        .order('id_kelas', { ascending: true })
        .order('nama_lengkap', { ascending: true });

      if (error) throw error;

      return NextResponse.json({ 
        status: 'success', 
        data: data 
      });
    }

  } catch (err: unknown) { 
    return NextResponse.json(
      { status: 'fail', message: err instanceof Error ? err.message : 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// --- POST: Create Data (Dashboard) ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama_lengkap, nis, id_kelas } = body;

    // [BARU] Generate Icode Otomatis
    const newIcode = generateIcode();

    const { data, error } = await supabaseAdmin
      .from('tbl_siswi')
      .insert({
        icode: newIcode, // 🔥 Auto Generate
        nama_lengkap: toTitleCase(nama_lengkap),
        nis,
        id_kelas: id_kelas ? parseInt(id_kelas) : null,
        status_aktif: 'Aktif',
        gender: 'Perempuan'
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ status: 'success', data });
  } catch (err: unknown) {
    return NextResponse.json({ status: 'fail', message: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}

// --- PATCH: Update Data (Dashboard) ---
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id_siswi, nama_lengkap, nis, id_kelas, status_aktif } = body;

    const updatePayload: Record<string, unknown> = {};
    if (nama_lengkap) updatePayload.nama_lengkap = toTitleCase(nama_lengkap);
    if (nis) updatePayload.nis = nis;
    if (id_kelas) updatePayload.id_kelas = parseInt(id_kelas);
    if (status_aktif) updatePayload.status_aktif = status_aktif;

    const { data, error } = await supabaseAdmin
      .from('tbl_siswi')
      .update(updatePayload)
      .eq('id_siswi', id_siswi)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ status: 'success', data });
  } catch (err: unknown) {
    return NextResponse.json({ status: 'fail', message: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}

// --- DELETE: Hapus Data (Dashboard) ---
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ status: 'fail', message: 'ID diperlukan' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('tbl_siswi')
      .delete()
      .eq('id_siswi', id);

    if (error) throw error;
    return NextResponse.json({ status: 'success', message: 'Data berhasil dihapus' });
  } catch (err: unknown) {
    return NextResponse.json({ status: 'fail', message: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}