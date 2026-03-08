"use client"

import Image from "next/image"

export function DashboardBanner() {
  return (
    // CONTAINER UTAMA
    // h-[149px] : Tinggi fix sesuai Figma
    // w-full    : Lebar fleksibel
    // relative  : Agar gambar di dalamnya bisa 'fill' container ini
    <div className="relative w-full h-[120px] overflow-hidden rounded-xl shadow-sm">
      
      {/* 1. BACKGROUND IMAGE */}
      {/* Menggunakan Next.js Image agar optimasi performa bagus */}
      <Image
        src="/banner.png"      // Pastikan file banner.png ada di folder 'public'
        alt="Dashboard Banner"
        fill                   // Membuat gambar memenuhi container (absolute inset-0)
        priority               // Dimuat duluan karena ini elemen utama (LCP)
        className="object-cover object-center" // Style CSS: Cover & Rata Tengah
      />

      {/* 2. OVERLAY (Opsional tapi Penting) */}
      {/* Layer hitam transparan tipis agar tulisan putih tetap terbaca walau gambarnya terang */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 3. KONTEN TEKS */}
      {/* relative z-10: Agar muncul di atas gambar */}
      {/* flex-col justify-center: Agar teks berada di tengah secara vertikal */}
      <div className="relative z-10 flex h-full flex-col justify-center px-8 text-left text-white">
        
        {/* JUDUL */}
        <h2 className="text-2xl font-bold tracking-tight drop-shadow-md">
          Welcome, Admin ARDEN! 👋
        </h2>
        
        {/* SUBTEXT */}
        <p className="mt-1 text-sm font-medium text-white/90 drop-shadow-sm">
          Laporan aktivitas sistem dan absensi hari ini siap untuk diperiksa.
        </p>
        
      </div>
    </div>
  )
}