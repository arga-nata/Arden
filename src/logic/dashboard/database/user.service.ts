// src/logic/dashboard/database/user.service.ts
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export class UserService {
  // --- 1. GET ALL USERS ---
  static async getAllUsers() {
    const users = await prisma.tbl_users.findMany({
      select: {
        id_user: true,
        nama_lengkap: true,
        username: true,
        role: true,
        status_akun: true,
        foto_url: true,
        last_login: true
      },
      orderBy: { id_user: 'asc' }
    });

    return users.map(u => ({ ...u, id_user: Number(u.id_user) }));
  }

  // --- 2. GET CURRENT USER (ME) ---
  static async getMe(username: string) {
    const user = await prisma.tbl_users.findUnique({
      where: { username },
      select: {
        id_user: true,
        nama_lengkap: true,
        username: true,
        role: true,
        status_akun: true,
        last_login: true,
        foto_url: true
      }
    });

    if (!user) throw new Error("User tidak ditemukan");
    return { ...user, id_user: Number(user.id_user) };
  }

  // --- 3. CREATE USER ---
  static async createUser(data: any) {
    // Cek username duplikat manual agar error message-nya lebih rapi
    const existing = await prisma.tbl_users.findUnique({ where: { username: data.username } });
    if (existing) throw new Error("Username sudah terdaftar!");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.tbl_users.create({
      data: {
        nama_lengkap: data.nama_lengkap,
        username: data.username,
        password: hashedPassword,
        role: data.role || 'Pelaksana',
        status_akun: 'Aktif'
      }
    });

    // Jangan kembalikan password ke frontend!
    const { password, ...safeUser } = newUser;
    return { ...safeUser, id_user: Number(safeUser.id_user) };
  }

  // --- 4. UPDATE USER ---
  static async updateUser(id: number, data: any) {
    const payload: any = {};
    if (data.nama_lengkap) payload.nama_lengkap = data.nama_lengkap;
    if (data.role) payload.role = data.role;
    if (data.status_akun) payload.status_akun = data.status_akun;

    const updated = await prisma.tbl_users.update({
      where: { id_user: id },
      data: payload
    });

    const { password, ...safeUser } = updated;
    return { ...safeUser, id_user: Number(safeUser.id_user) };
  }

  // --- 5. DELETE USER ---
  static async deleteUser(id: number) {
    await prisma.tbl_users.delete({ where: { id_user: id } });
    return true;
  }

  // --- 6. RESET PASSWORD ---
  static async resetPassword(id: number, newPasswordPlain: string) {
    if (newPasswordPlain.length < 6) throw new Error("Password minimal 6 karakter");
    
    const hashedPassword = await bcrypt.hash(newPasswordPlain, 10);
    
    await prisma.tbl_users.update({
      where: { id_user: id },
      data: { password: hashedPassword }
    });
    
    return true;
  }
}