import type { Metadata } from "next";
import { Toaster } from 'sonner'; // 1. Import Toaster

export const metadata: Metadata = {
  title: "ARDEN Mobile",
  description: "Absensi Siswi Mobile",
};

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Wrapper luar (Background gelap besar di desktop)
    <div className="min-h-dvh w-full flex items-center justify-center bg-black/90 lg:bg-zinc-900 overflow-hidden">
      
      {/* Container HP (Lebar 350px) */}
      <div className="w-full max-w-87.5 h-dvh lg:h-[95vh] bg-[#151419] text-white relative shadow-xl lg:rounded-3xl lg:border-2 lg:border-zinc-800 overflow-hidden flex flex-col">
        
        {/* 2. PASANG TOASTER DISINI */}
        {/* theme="dark" -> Agar text putih & background hitam */}
        {/* position="top-center" -> Agar muncul di atas layar HP */}
        {/* richColors -> Agar sukses warna hijau, error warna merah */}
        <Toaster 
          position="top-center" 
          theme="dark" 
          richColors 
          closeButton
          // Trik agar notifikasi tidak tertutup oleh header/elemen lain
          className="absolute mt-4" 
        />

        <main className="flex-1 w-full h-full relative overflow-hidden">
            {children}
        </main>
        
      </div>
    </div>
  );
}