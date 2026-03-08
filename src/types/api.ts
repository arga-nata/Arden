// src/types/api.ts

// ==========================================
// 1. TYPE DEFINITIONS UTAMA (DASHBOARD & CORE)
// ==========================================

// Role sesuai Database Utama
export type Role = 'Admin' | 'Pemantau' | 'Pelaksana';

// Status API standar
export type Status = 'success' | 'fail';

export interface LoginData {
    token: string;
    name: string;
    role: Role;
    foto_url: string | null;
    last_login: string; 
}

export interface ApiResponse<T> {
    code: number;
    status: Status;
    message: string;
    data: T | null;
    error: string | null;
}

// Class Helper untuk Response API
export class ApiSuccess<T> implements ApiResponse<T> {
    readonly code: number;
    readonly status = 'success' as const; 
    readonly message: string;
    readonly data: T;
    readonly error = null; 

    constructor(message: string, data: T, code: number = 200) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

export class ApiFail<T> implements ApiResponse<T> {
    readonly code: number;
    readonly status = 'fail' as const; 
    readonly message: string;
    readonly data = null; 
    readonly error: string;

    constructor(message: string, error: string, code: number = 400) {
        this.code = code;
        this.message = message;
        this.error = error;
    }
}

// Tipe Data Siswi untuk Dashboard (Lengkap)
export interface Siswi {
  id_siswi: number;
  icode: string;
  nis: string;
  nama_lengkap: string;
  id_kelas: number | null;
  gender: 'Perempuan';
  tanggal_lahir: string | null;
  status_aktif: 'Aktif' | 'Lulus';
  catatan: string | null;
  tbl_kelas?: {
    nama_kelas: string;
  };
}

export interface User {
  id_user: number;
  nama_lengkap: string;
  username: string;
  role: Role;
  last_login: string | null;
  foto_url: string | null;
  status_akun: string;
}

export interface Class {
  id_kelas: number;
  nama_kelas: string;
  wali_kelas: string | null;
}


// ==========================================
// 2. TYPE DEFINITIONS INTEGRASI MOBILE
// ==========================================

// Jadwal Sholat
export type SholatTimes = 'dzuhur' | 'ashar';
export type Sholat = 'Asr' | 'Dhuhr' | 'Isya' | 'Maghrib' | 'Fajr';

export interface PrayerTimes {
  Asr: string;
  Dhuhr: string;
  Isha: string;
  Maghrib: string;
  Fajr: string;
}

// [FIX] Status Khusus Absensi (Sesuai Logika Baru)
export type StatusPlayer = 'Haid' | 'Sholat';

// [INTEGRASI] Siswi versi Mobile (Sederhana)
export interface SiswiMobile {
  id: string | number;
  icode: string;
  nama_lengkap: string;
  nis: string;
  kelas: string;
}

// Struktur Data untuk QR Code / Status Absensi
export interface AbsensiStatus {
  id: string;
  nama_lengkap: string;
  nis: string;
  kelas: string;
  status: Status; 
  message: string;
}

// Payload untuk Input Absensi Baru (Mobile)
export interface NewAbsensiPayload {
  id_siswi?: number;
  nis?: string;
  tanggal: Date | string;
  waktu: string;
  status: StatusPlayer;
  // [FIX] Tambahkan metode agar tidak error di AbsensiForm
  metode?: 'SCAN' | 'MANUAL'; 
  keterangan: string;
  waktu_input: Date | string;
}

// Data Absensi yang ditampilkan di History Mobile
export interface DataAbsensiMobile {
  id: number;
  tanggal: Date | string;
  waktu: SholatTimes;
  status: Status;
  keterangan: string | null;
  waktu_input: string;
  tbl_siswi: {
      nama_lengkap: string;
      kelas: string;
      nis: string;
  };
}