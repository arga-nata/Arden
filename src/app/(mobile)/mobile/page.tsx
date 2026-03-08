'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

import { HeaderMobile } from '@/components/mobile/ui/HeaderMobile';
import { CardSholat } from '@/components/mobile/ui/CardSholat';
import { AbsensiManager } from '@/components/mobile/features/AbsensiManager';
import HistoryAbsen from '@/components/mobile/features/HistoryAbsen';
import { Sholat } from '@/types/api';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MobilePage() {
  const router = useRouter();
  
  const [sholat, setSholat] = useState<Sholat>('Dhuhr'); 
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      localStorage.clear(); 
      document.cookie = "user_role=; path=/; max-age=0;";
      document.cookie = "auth_token=; path=/; max-age=0;";

      toast.success("Sampai jumpa!");
      
      router.push('/login'); 
      router.refresh(); 
      
    } catch {
      // FIX: Hapus variabel 'error' jika tidak dipakai
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="h-dvh w-full flex items-center justify-center bg-[#151419]">
        <div className="flex flex-col items-center gap-2">
            <Icon icon="line-md:loading-twotone-loop" width="40" className="text-white/50" />
            <span className="text-white/50 text-sm font-mono">Loading ARDEN...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full bg-[#151419] flex flex-col p-5 font-sans overflow-hidden">
      
      {/* Header */}
      <div className="flex-none">
        <HeaderMobile>
          {/* FIX: Menggunakan DropdownMenu agar variabelnya tidak error 'unused' */}
          <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                  <div className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                      <Icon icon="material-symbols:menu" width={24} className="text-white" />
                  </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#1f1e23] border-[#27272A] text-white">
                  <DropdownMenuItem onClick={() => setShowHistory(true)} className="cursor-pointer hover:bg-[#27272A] focus:bg-[#27272A] focus:text-white">
                      <Icon icon="material-symbols:history" className="mr-2 h-4 w-4" />
                      <span>History</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Fitur Setting belum tersedia")} className="cursor-pointer hover:bg-[#27272A] focus:bg-[#27272A] focus:text-white">
                      <Icon icon="uil:setting" className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                  </DropdownMenuItem>
                  
                  {/* FIX: handleLogout dipanggil disini */}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500 hover:bg-[#27272A] focus:bg-[#27272A]">
                      <Icon icon="material-symbols:logout" className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
        </HeaderMobile>

        <div className="mb-4 mt-2">
            <CardSholat sholatTime={sholat} setSholatTime={setSholat} />
        </div>
      </div>

      <div className="flex-1 min-h-0 relative w-full">
         <AbsensiManager className="h-full w-full" sholatTime={sholat} />
      </div>

      <HistoryAbsen isOpen={showHistory} setIsOpen={setShowHistory} sholat={sholat} />
      
    </div>
  );
}