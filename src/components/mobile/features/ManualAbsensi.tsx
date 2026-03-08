//src/components/mobile/features/ManualAbsensi.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, User, Loader2, UserCheck, AlertCircle } from 'lucide-react';
import { AbsensiStatus, SiswiMobile } from '@/types/api';

interface ManualAbsensiProps {
  setPick: (status: AbsensiStatus) => void;
  setOpenForm: (value: boolean) => void; 
  // HAPUS sholatTime dari sini
}

interface RawSiswiSearch {
  id_siswi: number;
  nama_lengkap: string;
  nis: string;
  tbl_kelas?: {
    nama_kelas: string;
  } | null;
}

// Hapus props sholatTime di parameter bawah ini
export const ManualAbsensi = ({ setPick, setOpenForm }: ManualAbsensiProps) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState<SiswiMobile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
        if (!search.trim()) {
            setData([]);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/siswi?prm=${search}&limit=5`);
            const json = await res.json();
            
            if (json.status === 'success' && json.data) {
                const mappedData: SiswiMobile[] = json.data.siswi.map((s: RawSiswiSearch) => ({
                    id: s.id_siswi,
                    nama_lengkap: s.nama_lengkap,
                    nis: s.nis,
                    kelas: s.tbl_kelas?.nama_kelas || 'Unknown',
                    icode: '' 
                }));
                setData(mappedData);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSelect = (siswi: SiswiMobile) => {
    setPick({
        id: String(siswi.id),
        nama_lengkap: siswi.nama_lengkap,
        nis: siswi.nis,
        kelas: siswi.kelas,
        status: 'success', 
        message: 'Manual Entry'
    });
    setOpenForm(true); 
  };

  return (
    <div className="w-full h-full flex flex-col p-5 bg-[#151419]">
      <div className="relative mb-6 flex-none">
        <div className={`relative h-12 w-full bg-[#1F1E23] rounded-full border flex items-center pr-1 transition-all group ${search ? 'border-white/20' : 'border-white/5'}`}>
            <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari Siswa atau NIS..."
                className="flex-1 bg-transparent border-none outline-none text-white px-5 font-medium placeholder:text-white/20 text-sm h-full rounded-l-full"
            />
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                {isLoading ? ( <Loader2 size={18} className="text-green-500 animate-spin" /> ) : ( <Search size={18} className={`${search ? 'text-white' : 'text-white/20'} transition-colors`} /> )}
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 relative">
        {!search && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pb-10 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-center -space-x-3 mb-4">
                    <div className="w-9 h-9 rounded-full border-[1.5px] border-[#151419] bg-zinc-800 flex items-center justify-center z-10"> <User size={14} className="text-white/20" /> </div>
                    <div className="w-9 h-9 rounded-full border-[1.5px] border-[#151419] bg-zinc-700 flex items-center justify-center z-20 scale-110 shadow-lg"> <Search size={14} className="text-white/30" /> </div>
                    <div className="w-9 h-9 rounded-full border-[1.5px] border-[#151419] bg-zinc-800 flex items-center justify-center z-10"> <User size={14} className="text-white/20" /> </div>
                </div>
                <h3 className="text-white font-medium text-base mb-1 tracking-tight"> Pencarian Manual </h3>
                <p className="text-white/30 text-xs max-w-[180px] leading-relaxed"> Ketik nama atau NIS untuk memulai pencarian. </p>
            </div>
        )}

        {search && data.length > 0 && (
            <ul className="flex flex-col gap-2 pb-4">
                {data.map((item) => (
                    <li key={item.id} className="animate-in slide-in-from-bottom-2 duration-300">
                        <button onClick={() => handleSelect(item)} className="w-full text-left bg-[#1F1E23] hover:bg-[#27272A] border border-white/5 rounded-2xl p-3.5 flex items-center gap-3.5 transition-all active:scale-[0.98] group">
                            <div className="w-9 h-9 rounded-full bg-white/5 text-white/70 font-bold text-xs flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors"> {item.nama_lengkap.charAt(0)} </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate group-hover:text-green-400 transition-colors"> {item.nama_lengkap} </p>
                                <div className="flex items-center gap-2 text-[10px] text-white/40 mt-0.5">
                                    <span className="bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-wider"> {item.kelas} </span>
                                    <span>•</span>
                                    <span className="font-mono tracking-wide">{item.nis}</span>
                                </div>
                            </div>
                            <div className="text-white/10 group-hover:text-white/60 group-hover:translate-x-1 transition-all"> <UserCheck size={16} /> </div>
                        </button>
                    </li>
                ))}
            </ul>
        )}

        {search && !isLoading && data.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-10 text-white/20 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3"> <AlertCircle size={24} /> </div>
                <p className="text-xs">Siswa tidak ditemukan</p>
            </div>
        )}
      </div>
    </div>
  );
};