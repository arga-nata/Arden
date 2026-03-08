import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// ✅ FIX: Definisi Interface untuk Data Kelas dari Database
interface ClassWithRelation {
  id_kelas: number;
  nama_kelas: string;
  wali_kelas: string | null;
  tbl_siswi: { count: number }[]; // Array karena hasil join relation
}

// --- GET: Ambil Data Kelas + Jumlah Siswa ---
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('tbl_kelas')
      .select(`
        *,
        tbl_siswi ( count )
      `)
      .order('nama_kelas', { ascending: true });

    if (error) throw new Error(error.message);

    // ✅ FIX: Gunakan interface ClassWithRelation, bukan 'any'
    const formattedData = data.map((item) => {
      // Casting aman ke tipe yang kita definisikan
      const cls = item as unknown as ClassWithRelation;
      
      return {
        ...cls,
        // Ambil count dari array relasi (index 0)
        total_students: cls.tbl_siswi?.[0]?.count || 0
      };
    });

    return NextResponse.json({
      status: 'success',
      data: formattedData,
    });
  } catch (err) {
    return NextResponse.json({
      status: 'fail', message: err instanceof Error ? err.message : 'Error',
    }, { status: 500 });
  }
}

// --- POST: Buat Kelas (Force Uppercase) ---
export async function POST(req: Request) {
  try {
    const { nama_kelas, wali_kelas } = await req.json();

    if (!nama_kelas || !wali_kelas) {
      return NextResponse.json({ status: 'fail', message: 'Nama Kelas dan Wali Kelas wajib diisi' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('tbl_kelas')
      .insert({ 
        nama_kelas: nama_kelas.toString().toUpperCase(), // 🔥 Force Uppercase
        wali_kelas 
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ status: 'success', data });
  } catch (err) {
    return NextResponse.json({ status: 'fail', message: err instanceof Error ? err.message : 'Error',
    }, { status: 500 });
  }
}

// --- PATCH: Edit Kelas (Force Uppercase) ---
export async function PATCH(req: Request) {
  try {
    const { id_kelas, nama_kelas, wali_kelas } = await req.json();

    // ✅ FIX: Gunakan Record<string, ...> sebagai pengganti 'any'
    const payload: Record<string, string | number> = {};
    
    if (nama_kelas) payload.nama_kelas = nama_kelas.toString().toUpperCase(); // 🔥 Force Uppercase
    if (wali_kelas) payload.wali_kelas = wali_kelas;

    const { data, error } = await supabaseAdmin
      .from('tbl_kelas')
      .update(payload)
      .eq('id_kelas', id_kelas)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ status: 'success', data });
  } catch (err) {
    return NextResponse.json({ status: 'fail', message: err instanceof Error ? err.message : 'Error',
    }, { status: 500 });
  }
}

// --- DELETE: Hapus Kelas & Semua Siswinya (Cascading) ---
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ status: 'fail', message: 'ID diperlukan' }, { status: 400 });

    // 1. Hapus SEMUA SISWI di kelas ini dulu (Manual Cascade)
    const { error: deleteSiswiError } = await supabaseAdmin
      .from('tbl_siswi')
      .delete()
      .eq('id_kelas', id);

    if (deleteSiswiError) throw new Error("Gagal menghapus data siswi terkait");

    // 2. Baru hapus KELASNYA
    const { error: deleteKelasError } = await supabaseAdmin
      .from('tbl_kelas')
      .delete()
      .eq('id_kelas', id);

    if (deleteKelasError) throw deleteKelasError;

    return NextResponse.json({ status: 'success', message: 'Kelas dan seluruh siswanya berhasil dihapus' });
  } catch (err) {
    return NextResponse.json({ status: 'fail', message: err instanceof Error ? err.message : 'Error',
    }, { status: 500 });
  }
}