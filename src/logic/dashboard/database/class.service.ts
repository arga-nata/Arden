// src/logic/dashboard/class.service.ts
import { prisma } from "@/lib/prisma"

export class ClassService {
  // Ambil semua kelas + jumlah siswinya
  static async getAllClasses() {
    const classes = await prisma.tbl_kelas.findMany({
      include: {
        _count: {
          select: { tbl_siswi: true }
        }
      },
      orderBy: { nama_kelas: 'asc' }
    });

    // Format output & ubah BigInt Prisma menjadi Number agar aman saat di-JSON-kan
    return classes.map(cls => ({
      id_kelas: Number(cls.id_kelas),
      nama_kelas: cls.nama_kelas,
      wali_kelas: cls.wali_kelas,
      total_students: cls._count.tbl_siswi
    }));
  }

  static async createClass(data: { nama_kelas: string; wali_kelas: string }) {
    const newClass = await prisma.tbl_kelas.create({
      data: {
        nama_kelas: data.nama_kelas.toUpperCase(),
        wali_kelas: data.wali_kelas
      }
    });
    return { ...newClass, id_kelas: Number(newClass.id_kelas) };
  }

  static async updateClass(id: number, data: { nama_kelas?: string; wali_kelas?: string }) {
    const payload: any = {};
    if (data.nama_kelas) payload.nama_kelas = data.nama_kelas.toUpperCase();
    if (data.wali_kelas) payload.wali_kelas = data.wali_kelas;

    const updated = await prisma.tbl_kelas.update({
      where: { id_kelas: id },
      data: payload
    });
    return { ...updated, id_kelas: Number(updated.id_kelas) };
  }

  static async deleteClassWithStudents(id: number) {
    // Prisma Transaction: Hapus siswi dulu, baru hapus kelasnya (Aman & Atomik)
    await prisma.$transaction([
      prisma.tbl_siswi.deleteMany({ where: { id_kelas: id } }),
      prisma.tbl_kelas.delete({ where: { id_kelas: id } })
    ]);
    return true;
  }
}