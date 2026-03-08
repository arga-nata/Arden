'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loading } from './Loading';

import { DataAbsensiMobile, Sholat } from '@/types/api';

interface HistoryAbsenProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  sholat: Sholat;
}

interface RawAbsensiItem {
  id: number;
  tanggal: string;
  waktu: 'dzuhur' | 'ashar';
  status: 'success' | 'fail';
  catatan: string | null;
  created_at: string;
  tbl_siswi?: {
    nama_lengkap: string;
    nis: string;
    tbl_kelas?: {
      nama_kelas: string;
    };
  };
}

// PERBAIKAN: Langsung export default function
export default function HistoryAbsen({ isOpen, setIsOpen }: HistoryAbsenProps) {
  const [activeTab, setActiveTab] = useState<string>('dzuhur');
  const [data, setData] = useState<DataAbsensiMobile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const res = await fetch(`/api/absensi?tanggal=${today}&waktu=${activeTab}`);
            const json = await res.json();
            
            if (json.status === 'success' && json.data) {
                const mapped: DataAbsensiMobile[] = json.data.absensi.map((a: RawAbsensiItem) => ({
                    id: a.id,
                    tanggal: a.tanggal,
                    waktu: a.waktu,
                    status: a.status,
                    keterangan: a.catatan,
                    waktu_input: a.created_at,
                    tbl_siswi: {
                        nama_lengkap: a.tbl_siswi?.nama_lengkap || 'Unknown',
                        kelas: a.tbl_siswi?.tbl_kelas?.nama_kelas || '-',
                        nis: a.tbl_siswi?.nis || '-'
                    }
                }));
                setData(mapped);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error(error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, [isOpen, activeTab]);

  const formatTime = (isoString: string) => {
    if(!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  };

  const ListContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center gap-2 p-2 mb-2 bg-yellow-500/10 rounded-md">
        <Icon icon="material-symbols:info-outline" className="text-yellow-500 text-xs" />
        <p className="text-[10px] text-yellow-500/80">Data hari ini. Reset jam 00:00.</p>
      </div>

      <ScrollArea className="h-[40vh] w-full pr-4">
        <ul className="flex flex-col gap-2">
          {isLoading ? (
            <Loading />
          ) : data.length > 0 ? (
            data.map((item, idx) => (
                <li key={idx} className="bg-[#27272A]/40 border border-[#3F3F3F] rounded-lg p-3 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-white">{item.tbl_siswi.nama_lengkap}</p>
                        <p className="text-xs text-white/50">{item.tbl_siswi.kelas} ({item.tbl_siswi.nis})</p>
                    </div>
                    <div className="text-xs font-mono text-white/70 bg-[#151419] px-2 py-1 rounded">
                        {formatTime(item.waktu_input)}
                    </div>
                </li>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-white/30">
              <Icon icon="material-symbols:inbox-customize-outline" width={32} />
              <p className="text-xs mt-2">Belum ada data</p>
            </div>
          )}
        </ul>
      </ScrollArea>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[90%] max-w-md rounded-[12px] bg-[#151419] border-[#27272A] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon="mingcute:time-line" width={24} /> History Hari Ini
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="dzuhur" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-[#27272A]">
            <TabsTrigger value="dzuhur">Dzuhur</TabsTrigger>
            <TabsTrigger value="ashar">Ashar</TabsTrigger>
          </TabsList>
          <TabsContent value="dzuhur" className="mt-2"><ListContent /></TabsContent>
          <TabsContent value="ashar" className="mt-2"><ListContent /></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}