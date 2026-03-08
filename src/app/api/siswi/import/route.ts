// src/app/api/siswi/import/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { randomUUID } from 'crypto';

interface ExcelSiswi {
  'Nama Lengkap': string;
  'NIS': string | number;
  'Nama Kelas': string | number;
}

const toTitleCase = (str: string) => {
  if (!str) return "";
  return str.toString().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// 🔥 HELPER SAKTI: CANONICAL KEY (TETAP DIPERTAHANKAN)
const toCanonicalKey = (str: string) => {
  if (!str) return "";
  return str.toString().toUpperCase().replace(/[^A-Z0-9]/g, ''); 
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); 
    
    if (!Array.isArray(body)) {
      return NextResponse.json({ status: 'fail', message: 'Data harus berupa array' }, { status: 400 });
    }

    // 1. AMBIL REFERENSI KELAS
    const { data: classData, error: classError } = await supabaseAdmin
      .from('tbl_kelas')
      .select('id_kelas, nama_kelas');

    if (classError) throw new Error("Gagal mengambil data referensi kelas.");

    const classMap = new Map<string, number>();
    const validClassIds = new Set<number>();

    classData?.forEach(cls => {
      validClassIds.add(cls.id_kelas); 
      
      if (cls.nama_kelas) {
        const canonicalName = toCanonicalKey(cls.nama_kelas);
        classMap.set(canonicalName, cls.id_kelas);
      }
    });

    // 2. PROSES DATA
    const studentsToInsert = [];
    
    for (let i = 0; i < body.length; i++) {
      const item = body[i] as ExcelSiswi; 
      const rowNum = i + 1; 

      if (!item['Nama Lengkap'] || !item['NIS']) {
        throw new Error(`Baris ke-${rowNum}: Nama Lengkap dan NIS wajib diisi.`);
      }

      // --- LOGIKA PENCARIAN SUPER FLEKSIBEL ---
      let finalClassId: number | null = null;
      const rawInput = item['Nama Kelas'] ? item['Nama Kelas'].toString() : "";

      if (/^\d+$/.test(rawInput)) {
        const parsedId = parseInt(rawInput);
        if (validClassIds.has(parsedId)) {
          finalClassId = parsedId;
        }
      } 
      
      if (!finalClassId && rawInput) {
        const normalizedInput = toCanonicalKey(rawInput);
        finalClassId = classMap.get(normalizedInput) || null;
      }

      if (!finalClassId) {
        throw new Error(
          `Gagal pada Baris ${rowNum}: Kelas '${item['Nama Kelas']}' tidak ditemukan di database.\n` +
          `Sistem mencoba mencari format: '${toCanonicalKey(rawInput)}' tapi tidak ada yang cocok.`
        );
      }

      // [BARU] Generate ICODE unik untuk setiap baris
      const generatedIcode = `ARD-${randomUUID().split('-')[0].toUpperCase()}`;

      studentsToInsert.push({
        icode: generatedIcode, // 🔥 Auto Icode
        nama_lengkap: toTitleCase(item['Nama Lengkap']), 
        nis: item['NIS']?.toString(), 
        id_kelas: finalClassId, 
        gender: 'Perempuan', 
        status_aktif: 'Aktif'
      });
    }

    // 3. EKSEKUSI INSERT
    const { data, error } = await supabaseAdmin
      .from('tbl_siswi')
      .insert(studentsToInsert)
      .select();

    if (error) {
      // Kita tidak lagi perlu cek duplicate key NIS, tapi tetap handle error generic
      if (error.message.includes('duplicate key') && error.message.includes('icode')) {
          throw new Error("Terjadi duplikasi Kode Sistem (ICODE). Silakan coba lagi.");
      }
      throw new Error(error.message);
    }

    return NextResponse.json({ status: 'success', count: data ? data.length : 0 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat import';
    return NextResponse.json({ status: 'fail', message }, { status: 500 });
  }
}