// src/lib/dummy-data.ts
import { ClassData } from "@/components/dashboard/home/overview-chart"

// 1. DATA KARTU STATISTIK
export const statsData = {
  totalSiswi: { value: 1250, trend: 2 },
  sedangHaid: { value: 245, trend: -5 },
  wajibSholat: { value: 980, trend: 7 },
  izinSakit: { value: 15, trend: 0 },
  alpha: { value: 10, trend: 1 },
}

// 2. DATA GRAFIK KELAS
export const chartData: ClassData[] = [
  // KELAS X
  { angkatan: "X", namaKelas: "X-RPL 1", sholat: 28, haid: 5},
  { angkatan: "X", namaKelas: "X-RPL 2", sholat: 30, haid: 2},
  { angkatan: "X", namaKelas: "X-TKJ 1", sholat: 25, haid: 8},
  { angkatan: "X", namaKelas: "X-TKJ 2", sholat: 20, haid: 1},
  
  // KELAS XI
  { angkatan: "XI", namaKelas: "XI-RPL", sholat: 32, haid: 0},
  { angkatan: "XI", namaKelas: "XI-TKJ", sholat: 15, haid: 15},
  
  // KELAS XII
  { angkatan: "XII", namaKelas: "XII-DKV", sholat: 28, haid: 4},
  { angkatan: "XII", namaKelas: "XII-AKL", sholat: 30, haid: 5},
  { angkatan: "XII", namaKelas: "XII-LPU", sholat: 25, haid: 2},
]

// 3. DATA KUALITAS SIKLUS (Donut Chart)
export const cycleQualityData = [
  { status: "minimal", count: 45, fill: "var(--color-minimal)" },
  { status: "standard", count: 150, fill: "var(--color-standard)" },
  { status: "maximal", count: 35, fill: "var(--color-maximal)" },
  { status: "over", count: 15, fill: "var(--color-over)" },
  { status: "sholat", count: 555, fill: "var(--color-sholat)" },
]

// 4. DATA ACTIVITY LOG (15 Data Siswi)
// Pastikan nama variabel ini 'activityLogs' (pakai s) agar cocok dengan import di dashboard/page.tsx
export const activityLogs = [
  { 
    id: 1, 
    studentName: "Nadia Putri Kirana", 
    method: "Scan QR" as const, 
    className: "XII-RPL 1", 
    executor: "Sistem", 
    category: "Ashar" as const, 
    time: "16:15" 
  },
  { 
    id: 2, 
    studentName: "Laila Maghfirah", 
    method: "Manual" as const, 
    className: "XI-TKJ 2", 
    executor: "Bu Aminah", 
    category: "Ashar" as const, 
    time: "16:05" 
  },
  { 
    id: 3, 
    studentName: "Fatimah Azzahra", 
    method: "Scan QR" as const, 
    className: "X-DKV 3", 
    executor: "Sistem", 
    category: "Ashar" as const, 
    time: "15:55" 
  },
  { 
    id: 4, 
    studentName: "Zahra Safira", 
    method: "Manual" as const, 
    className: "XII-AKL", 
    executor: "Pak Yusuf", 
    category: "Ashar" as const, 
    time: "15:40" 
  },
  { 
    id: 5, 
    studentName: "Putri Rahayu", 
    method: "Scan QR" as const, 
    className: "X-RPL 2", 
    executor: "Sistem", 
    category: "Ashar" as const, 
    time: "15:30" 
  },
  { 
    id: 6, 
    studentName: "Siti Aminah", 
    method: "Manual" as const, 
    className: "XI-RPL", 
    executor: "Bu Siti", 
    category: "Zuhur" as const, 
    time: "13:10" 
  },
  { 
    id: 7, 
    studentName: "Fitri Handayani", 
    method: "Scan QR" as const, 
    className: "XII-LPU", 
    executor: "Sistem", 
    category: "Zuhur" as const, 
    time: "12:55" 
  },
  { 
    id: 8, 
    studentName: "Nurul Hidayah", 
    method: "Manual" as const, 
    className: "X-TKJ 1", 
    executor: "Pak Ahmad", 
    category: "Zuhur" as const, 
    time: "12:45" 
  },
  { 
    id: 9, 
    studentName: "Anisa Rahmawati", 
    method: "Scan QR" as const, 
    className: "XI-TKJ", 
    executor: "Sistem", 
    category: "Zuhur" as const, 
    time: "12:35" 
  },
  { 
    id: 10, 
    studentName: "Indah Permata", 
    method: "Manual" as const, 
    className: "XII-DKV", 
    executor: "Bu Ratna", 
    category: "Zuhur" as const, 
    time: "12:30" 
  },
  { 
    id: 11, 
    studentName: "Rina Amalia", 
    method: "Scan QR" as const, 
    className: "X-RPL 1", 
    executor: "Sistem", 
    category: "Zuhur" as const, 
    time: "12:25" 
  },
  { 
    id: 12, 
    studentName: "Desi Ratnasari", 
    method: "Manual" as const, 
    className: "XI-AKL", 
    executor: "Pak Budi", 
    category: "Zuhur" as const, 
    time: "12:20" 
  },
  { 
    id: 13, 
    studentName: "Mega Utami", 
    method: "Scan QR" as const, 
    className: "XII-RPL 2", 
    executor: "Sistem", 
    category: "Zuhur" as const, 
    time: "12:15" 
  },
  { 
    id: 14, 
    studentName: "Bella Safira", 
    method: "Manual" as const, 
    className: "X-TKJ 2", 
    executor: "Bu Maya", 
    category: "Zuhur" as const, 
    time: "12:10" 
  },
  { 
    id: 15, 
    studentName: "Kartika Sari", 
    method: "Scan QR" as const, 
    className: "XI-DKV", 
    executor: "Sistem", 
    category: "Zuhur" as const, 
    time: "12:05" 
  },
];