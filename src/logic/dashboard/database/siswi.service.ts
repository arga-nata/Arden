// src/logic/dashboard/database/siswi.service.ts
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"

export class SiswiService {
  // Helpers
  private static toTitleCase = (str: string) => {
    if (!str) return "";
    return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
  }

  private static toCanonicalKey = (str: string) => {
    if (!str) return "";
    return str.toString().toUpperCase().replace(/[^A-Z0-9]/g, ''); 
  }

  private static generateIcode = () => {
    return `ARD-${randomUUID().split('-')[0].toUpperCase()}`;
  }

  // --- 1. AMBIL SEMUA DATA (DASHBOARD) ---
  static async getAllSiswi() {
    const siswi = await prisma.tbl_siswi.findMany({
      include: {
        tbl_kelas: { select: { nama_kelas: true } }
      },
      orderBy: [
        { id_kelas: 'asc' },
        { nama_lengkap: 'asc' }
      ]
    });

    // Prisma BigInt harus diubah ke Number agar tidak error saat di-JSON-kan
    return siswi.map(s => ({
      ...s,
      id_siswi: Number(s.id_siswi),
      id_kelas: s.id_kelas ? Number(s.id_kelas) : null,
    }));
  }

  // --- 2. AMBIL 1 DATA BERDASARKAN ICODE/NIS (MOBILE SCANNER) ---
  static async getSiswiByCode(kode: string) {
    const siswi = await prisma.tbl_siswi.findFirst({
      where: {
        OR: [ { icode: kode }, { nis: kode } ]
      },
      include: {
        tbl_kelas: { select: { nama_kelas: true } }
      }
    });

    if (!siswi) throw new Error("Data siswa tidak ditemukan");

    return {
      ...siswi,
      id_siswi: Number(siswi.id_siswi),
      id_kelas: siswi.id_kelas ? Number(siswi.id_kelas) : null,
    };
  }

  // --- 3. CREATE DATA MANUAL ---
  static async createSiswi(data: { nama_lengkap: string; nis: string; id_kelas?: number | string }) {
    const newSiswi = await prisma.tbl_siswi.create({
      data: {
        icode: this.generateIcode(),
        nama_lengkap: this.toTitleCase(data.nama_lengkap),
        nis: data.nis,
        id_kelas: data.id_kelas ? Number(data.id_kelas) : null,
        status_aktif: 'Aktif',
        gender: 'Perempuan' // Database memaksa ini dengan Check Constraint
      }
    });
    return { ...newSiswi, id_siswi: Number(newSiswi.id_siswi) };
  }

  // --- 4. UPDATE DATA ---
  static async updateSiswi(id: number, data: any) {
    const payload: any = {};
    if (data.nama_lengkap) payload.nama_lengkap = this.toTitleCase(data.nama_lengkap);
    if (data.nis) payload.nis = data.nis;
    if (data.id_kelas) payload.id_kelas = Number(data.id_kelas);
    if (data.status_aktif) payload.status_aktif = data.status_aktif;

    const updated = await prisma.tbl_siswi.update({
      where: { id_siswi: id },
      data: payload
    });
    return { ...updated, id_siswi: Number(updated.id_siswi) };
  }

  // --- 5. DELETE DATA ---
  static async deleteSiswi(id: number) {
    await prisma.tbl_siswi.delete({ where: { id_siswi: id } });
    return true;
  }

  // --- 6. IMPORT BULK EXCEL ---
  static async importSiswi(dataArray: any[]) {
    // Ambil data referensi kelas untuk pencocokan ID
    const classes = await prisma.tbl_kelas.findMany({
      select: { id_kelas: true, nama_kelas: true }
    });

    const classMap = new Map<string, number>();
    const validClassIds = new Set<number>();

    classes.forEach(cls => {
      const classIdNum = Number(cls.id_kelas);
      validClassIds.add(classIdNum);
      if (cls.nama_kelas) {
        classMap.set(this.toCanonicalKey(cls.nama_kelas), classIdNum);
      }
    });

    // Susun data yang mau di-insert
    const studentsToInsert = dataArray.map((item, index) => {
      const rowNum = index + 1;
      if (!item['Nama Lengkap'] || !item['NIS']) {
        throw new Error(`Baris ke-${rowNum}: Nama Lengkap dan NIS wajib diisi.`);
      }

      let finalClassId: number | null = null;
      const rawInput = item['Nama Kelas'] ? item['Nama Kelas'].toString() : "";

      if (/^\d+$/.test(rawInput)) {
        const parsedId = parseInt(rawInput);
        if (validClassIds.has(parsedId)) finalClassId = parsedId;
      } 
      if (!finalClassId && rawInput) {
        finalClassId = classMap.get(this.toCanonicalKey(rawInput)) || null;
      }

      if (!finalClassId) {
        throw new Error(`Gagal pada Baris ${rowNum}: Kelas '${item['Nama Kelas']}' tidak terdaftar di sistem.`);
      }

      return {
        icode: this.generateIcode(),
        nama_lengkap: this.toTitleCase(item['Nama Lengkap']),
        nis: item['NIS'].toString(),
        id_kelas: finalClassId,
        gender: 'Perempuan',
        status_aktif: 'Aktif'
      };
    });

    // Insert sekaligus (Sangat cepat di Prisma)
    const result = await prisma.tbl_siswi.createMany({
      data: studentsToInsert,
      skipDuplicates: true // Otomatis mengabaikan jika ada icode duplikat (walau kemungkinannya 0.0001%)
    });

    return result.count;
  }
}