'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';

import QRAbsensi from './QRAbsensi';
import { ManualAbsensi } from './ManualAbsensi';
import { NotifAbsen } from './NontifAbsen';
import { Sholat, AbsensiStatus } from '@/types/api';

interface SectionTabProps {
  className?: string;
  sholatTime: Sholat;
}

export const SectionTab = ({ className = '', sholatTime }: SectionTabProps) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
  const [notifOpen, setNotifOpen] = useState(false);
  const [absensiResult, setAbsensiResult] = useState<AbsensiStatus | undefined>(undefined);

  return (
    <div className={`flex flex-col flex-1 w-full h-full overflow-hidden ${className}`}>
      
      {/* Switcher Buttons */}
      <div className="flex w-full gap-2 p-1 bg-[#151419] mb-2">
        <Button
          variant={activeTab === 'scan' ? 'default' : 'outline'}
          className={`flex-1 gap-2 ${activeTab === 'scan' ? 'bg-white text-black' : 'bg-[#27272A] text-white border-none'}`}
          onClick={() => setActiveTab('scan')}
        >
          <Icon icon="bx:scan" width={20} />
          Scan QR
        </Button>
        <Button
          variant={activeTab === 'manual' ? 'default' : 'outline'}
          className={`flex-1 gap-2 ${activeTab === 'manual' ? 'bg-white text-black' : 'bg-[#27272A] text-white border-none'}`}
          onClick={() => setActiveTab('manual')}
        >
          <Icon icon="material-symbols:person-search" width={20} />
          Manual
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 rounded-[10px] overflow-hidden relative">
        {activeTab === 'scan' ? (
          <QRAbsensi 
            setPick={setAbsensiResult} 
            setNAbsen={setNotifOpen} 
            sholat={sholatTime} 
          />
        ) : (
          <ManualAbsensi 
            setPick={setAbsensiResult} 
            setNAbsen={setNotifOpen} 
            sholatTime={sholatTime} 
          />
        )}
      </div>

      {/* Popup Notifikasi */}
      <NotifAbsen 
        isOpen={notifOpen} 
        absensiStatus={absensiResult} 
        setOpen={setNotifOpen} 
      />
    </div>
  );
};