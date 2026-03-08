import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { corsHeaders } from '@/lib/cors';

interface AbsensiRow {
  id_absen: number;
  tanggal: string;
  waktu: string;
  status: string;
  keterangan: string | null;
  waktu_input: string;
  tbl_siswi: {
    nama_lengkap: string;
    nis: string;
    kelas: {
      nama_kelas: string;
    } | null;
  } | null;
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// --- GET: AMBIL DATA (Untuk Dashboard) ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const tanggal = searchParams.get('tanggal');
    const bulan = searchParams.get('bulan');
    const tahun = searchParams.get('tahun');
    const prm = searchParams.get('prm');

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from('tbl_absensi')
      .select(`
        id_absen,
        tanggal,
        waktu,
        status,
        keterangan,
        waktu_input,
        tbl_siswi!inner (
            nama_lengkap,
            kelas:tbl_kelas(nama_kelas),
            nis
        )
      `, { count: 'exact' })
      .order('waktu_input', { ascending: false });

    if (tanggal) query = query.eq('tanggal', tanggal);
    
    if (bulan && tahun) {
       const startOfMonth = `${tahun}-${bulan.toString().padStart(2, '0')}-01`;
       const nextMonth = parseInt(bulan) === 12 ? 1 : parseInt(bulan) + 1;
       const nextYear = parseInt(bulan) === 12 ? parseInt(tahun) + 1 : parseInt(tahun);
       const endOfMonth = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`;
       
       query = query.gte('tanggal', startOfMonth).lt('tanggal', endOfMonth);
    }

    if (prm) {
        query = query.or(`nama_lengkap.ilike.%${prm}%,nis.ilike.%${prm}%`, { foreignTable: 'tbl_siswi' });
    }

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    const typedData = (data as unknown) as AbsensiRow[];

    const formattedData = typedData?.map((item) => ({
        ...item,
        nama_kelas: item.tbl_siswi?.kelas?.nama_kelas || '-', 
        nama_lengkap: item.tbl_siswi?.nama_lengkap || '-',
        nis: item.tbl_siswi?.nis || '-'
    }));

    return NextResponse.json({
        status: 'success',
        data: {
            absensi: formattedData,
            pagination: {
                page,
                limit,
                total_items: count ?? 0,
                total_pages: Math.ceil((count ?? 0) / limit),
            },
        }
    }, { headers: corsHeaders });

  } catch (err: unknown) {
    return NextResponse.json({ 
        status: 'fail', 
        message: err instanceof Error ? err.message : 'Error fetching data' 
    }, { status: 500, headers: corsHeaders });
  }
}

// --- POST: INPUT ABSENSI (SCANNER & MANUAL) ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Support payload langsung atau nested di 'dtnew'
    const payload = body.dtnew || body; 
    const { id_siswi, waktu, status, keterangan, metode, tanggal } = payload;

    if (!id_siswi || !waktu) {
        return NextResponse.json({ status: 'fail', message: 'Data tidak lengkap (ID/Waktu)' }, { status: 400 });
    }

    // [VALIDASI WAKTU]
    // Mencegah error database constraint jika testing di malam hari (Isya/Maghrib)
    const validWaktu = ['zhuhur', 'ashar'];
    if (!validWaktu.includes(waktu.toLowerCase())) {
        return NextResponse.json({ 
            status: 'fail', 
            message: `Sistem hanya menerima absen Zhuhur/Ashar. Data '${waktu}' ditolak.` 
        }, { status: 400 });
    }

    // Gunakan tanggal dari payload (untuk backdate manual) atau hari ini jika kosong
    const tglInput = tanggal ? new Date(tanggal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    // 1. Cek Duplikasi (Hari & Sesi yang sama)
    const { data: existing } = await supabaseAdmin
      .from('tbl_absensi')
      .select('id_absen, status')
      .eq('id_siswi', id_siswi)
      .eq('tanggal', tglInput)
      .eq('waktu', waktu)
      .single();

    if (existing) {
        return NextResponse.json({ 
            status: 'fail', 
            message: `Siswi ini sudah absen ${waktu} pada tanggal tersebut.` 
        });
    }

    // 2. Logika Status & Metode (FINAL FIX)
    const metodeFix = metode || 'SCAN';
    
    let statusFix = status;
    let ketFix = keterangan;

    // 🔥 LOGIKA SAKLEK: Kalau SCAN, Status PASTI 'Haid', Keterangan NULL
    if (metodeFix === 'SCAN') {
        statusFix = 'Haid';
        ketFix = null; 
    }

    // 3. Insert Data
    const { data, error } = await supabaseAdmin
      .from('tbl_absensi')
      .insert({
        id_siswi: parseInt(id_siswi),
        tanggal: tglInput,
        waktu: waktu,
        status: statusFix,    // Haid (Scan), atau Haid/Sholat (Manual)
        metode: metodeFix,    // SCAN atau MANUAL
        keterangan: ketFix,   // NULL (Scan), atau Alasan (Manual)
        waktu_input: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
        status: 'success', 
        message: 'Absensi berhasil disimpan', 
        data 
    }, { headers: corsHeaders });

  } catch (err: unknown) {
    console.error("POST Error:", err);
    return NextResponse.json({ 
        status: 'fail', 
        message: err instanceof Error ? err.message : 'Server Error' 
    }, { status: 500, headers: corsHeaders });
  }
}

// --- PUT: UPDATE DATA ---
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, keterangan } = body; 

    if (!id) return NextResponse.json({ status: 'fail', message: 'ID required' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('tbl_absensi')
      .update({ status, keterangan })
      .eq('id_absen', id) 
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ status: 'success', data }, { headers: corsHeaders });
  } catch (err: unknown) {
    return NextResponse.json({ status: 'fail', message: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}

// --- DELETE: HAPUS DATA ---
export async function DELETE(req: Request) {
  try {
    const { ids } = await req.json(); 
    
    if (!ids || !Array.isArray(ids)) {
        return NextResponse.json({ status: 'fail', message: 'Invalid IDs' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('tbl_absensi')
      .delete()
      .in('id_absen', ids); 

    if (error) throw error;

    return NextResponse.json({ status: 'success', message: 'Data deleted' }, { headers: corsHeaders });
  } catch (err: unknown) {
    return NextResponse.json({ status: 'fail', message: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}