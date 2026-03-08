// Jalur File: src/lib/server.ts
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Fungsi ini berjalan di sisi SERVER (API Route).
 * Menggunakan 'supabaseAdmin' untuk bypass RLS (Row Level Security).
 */
export const addAbsensiBulan = async (
  id: number,
  tgl: string,
  waktu: string,
  ctn?: string,
) => {
  try {
    // 1. Cek apakah data absensi bulan ini sudah ada?
    const { data: ab, error: eab } = await supabaseAdmin
      .from('tbl_absensibulan')
      .select('id, absenwaktu')
      .eq('id_siswi', id)
      .eq('tanggal', tgl)
      .maybeSingle();

    // Abaikan error jika datanya cuma "tidak ditemukan" (PGRST116)
    if (eab && eab.code !== 'PGRST116') {
      throw new Error(eab.message);
    }

    const isAlreadyExists = !!ab;
    let result;

    if (!isAlreadyExists) {
      // 2. Jika belum ada, Insert Baru
      const { data, error } = await supabaseAdmin
        .from('tbl_absensibulan')
        .insert({
          id_siswi: id,
          status: 'haid',
          absenwaktu: 1,
          tanggal: tgl,
          catatan: ctn,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      result = data;
    } else {
      // 3. Jika sudah ada, Update counternya (absenwaktu + 1)
      const { data, error } = await supabaseAdmin
        .from('tbl_absensibulan')
        .update({
          absenwaktu: Number(ab.absenwaktu) + 1,
          catatan: ctn,
        })
        .eq('id', ab.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      result = data;
    }

    return {
      message: isAlreadyExists
        ? 'Absensi bulan berhasil diperbarui'
        : 'Absensi bulan baru berhasil ditambahkan',
      data: result,
      error: null,
    };
  } catch (err) {
    return {
      message: 'Gagal memproses absensi bulanan',
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
};