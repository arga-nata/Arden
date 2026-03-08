//src/component/mobile/features/AbsensiManager.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserSearch, ScanLine } from 'lucide-react'; 

import QRAbsensi from './QRAbsensi';
import { ManualAbsensi } from './ManualAbsensi';
import { NotifAbsen } from './NontifAbsen';
import { AbsensiForm } from './AbsensiForm'; 
import { Sholat, AbsensiStatus } from '@/types/api';

interface AbsensiManagerProps {
  className?: string;
  sholatTime: Sholat;
}

export const AbsensiManager = ({ className = '', sholatTime }: AbsensiManagerProps) => {
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  
  const [manualResult, setManualResult] = useState<AbsensiStatus | undefined>(undefined);
  const [notifOpen, setNotifOpen] = useState(false);
  const [inputFormOpen, setInputFormOpen] = useState(false);
  const [isCamActive, setIsCamActive] = useState(false);

  const toggleMode = () => {
    setMode(mode === 'scan' ? 'manual' : 'scan');
    setIsCamActive(false); 
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-[#27272A] z-0 flex flex-col">
        
        {mode === 'scan' ? (
          <div className="flex-1 w-full h-full relative">
             <QRAbsensi 
                sholat={sholatTime} 
                onCamActive={(isActive: boolean) => setIsCamActive(isActive)}
             />
          </div>
        ) : (
          <div className="flex-1 w-full h-full relative overflow-hidden bg-[#151419]">
             {/* PERBAIKAN: Hapus sholatTime={sholatTime} dari sini */}
             <ManualAbsensi 
                setPick={setManualResult}     
                setOpenForm={setInputFormOpen} 
            />
          </div>
        )}

        <div 
            className={`
                absolute bottom-8 left-6 z-50 font-sans transition-all duration-500 ease-in-out
                ${isCamActive ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
            `}
        >
            <Button 
                variant="secondary"
                size="sm" 
                onClick={toggleMode}
                className="h-10 px-3 pr-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-2 transition-all active:scale-95 group"
            >
                {mode === 'scan' ? (
                    <>
                        <UserSearch size={18} className="text-white/80 group-hover:text-white transition-colors" />
                        <span className="text-xs font-semibold tracking-wide hidden xs:inline">Manual</span>
                    </>
                ) : (
                    <>
                        <ScanLine size={18} className="text-white/80 group-hover:text-white transition-colors" />
                        <span className="text-xs font-semibold tracking-wide hidden xs:inline">Scan QR</span>
                    </>
                )}
            </Button>
        </div>

      </div>

      <AbsensiForm 
        isOpen={inputFormOpen}
        setIsOpen={setInputFormOpen}
        dataSiswi={manualResult}
        sholat={sholatTime} // Di sini sholatTime TETAP DIPAKAI (karena Form butuh buat submit)
        setSuccessPopup={setNotifOpen} 
      />

      <NotifAbsen 
        isOpen={notifOpen} 
        absensiStatus={manualResult} 
        setOpen={setNotifOpen} 
        sholatTime={sholatTime as unknown as string}
      />
    </div>
  );
};