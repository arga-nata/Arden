'use client';

import { useEffect, useState } from 'react';
import { AbsensiStatus } from '@/types/api';
import { ScanLine, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface NontifAbsenPopup {
  isOpen: boolean;
  absensiStatus: AbsensiStatus | undefined;
  setOpen: (value: boolean) => void;
  onScanUlang?: () => void; 
  sholatTime?: string;
}

// Helper time
const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const mapSholat = (s: string) => {
    if (s === 'Dhuhr') return 'Zhuhur';
    if (s === 'Asr') return 'Ashar';
    return s;
};

export function NotifAbsen({ 
  isOpen, 
  absensiStatus, 
  setOpen, 
  onScanUlang, 
  sholatTime = 'Dhuhr' 
}: NontifAbsenPopup) {
  const [show, setShow] = useState(isOpen);
  const [loading, setLoading] = useState(false);
  const [processStatus, setProcessStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [scanTime, setScanTime] = useState('');

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setShow(true), 0);
      setScanTime(getCurrentTime());
      setProcessStatus('idle'); 
      setErrorMessage('');
      return () => clearTimeout(t);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleProcess = async () => {
    if (!absensiStatus?.id) return;

    setLoading(true);
    setErrorMessage('');

    try {
        // 🔥 [FIX LOGIKA SCANNER] 
        // Status: 'Haid' (Karena ini scanner pencatatan haid)
        // Metode: 'SCAN'
        // Keterangan: Kosong
        const payload = {
            id_siswi: parseInt(absensiStatus.id),
            waktu: mapSholat(sholatTime).toLowerCase(), 
            status: 'Haid', 
            metode: 'SCAN',
            keterangan: '', 
            tanggal: new Date() 
        };

        const res = await fetch('/api/absensi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const json = await res.json();

        if (json.status === 'success') {
            setProcessStatus('success');
        } else {
            setProcessStatus('error');
            setErrorMessage(json.message || 'Gagal memproses data.');
        }

    } catch { 
        setProcessStatus('error');
        setErrorMessage('Terjadi kesalahan koneksi.');
    } finally {
        setLoading(false);
    }
  };

  const handleCloseAndResume = () => {
      if (processStatus === 'success') {
          toast.success("Data Berhasil Disimpan", {
            description: `${absensiStatus?.nama_lengkap} - ${mapSholat(sholatTime)}`,
            duration: 3000,
            position: 'top-center' 
          });
      }
      setOpen(false);
      onScanUlang?.(); 
  };

  if (!show) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      
      <div className={`w-[85%] max-w-sm rounded-[2rem] p-6 bg-[#151419] border border-[#27272A] shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center gap-4 mb-6">
            <div className={`p-4 rounded-full border-2 transition-all duration-500 ${
                processStatus === 'success' 
                ? 'bg-green-500/10 border-green-500 text-green-500' 
                : processStatus === 'error'
                ? 'bg-red-500/10 border-red-500 text-red-500'
                : 'bg-white/5 border-white/10 text-white'
            }`}>
                {processStatus === 'success' ? <CheckCircle2 size={32} /> : processStatus === 'error' ? <XCircle size={32} /> : <ScanLine size={32} />}
            </div>
            <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                    {processStatus === 'success' ? 'Data Tersimpan' : 'Konfirmasi Data'}
                </h2>
                <p className="text-xs text-white/40 mt-1">
                    {processStatus === 'success' ? 'Absensi berhasil dicatat.' : 'Pastikan data siswi sesuai.'}
                </p>
            </div>
        </div>

        {/* BODY */}
        <div className="space-y-4 mb-8">
            <div className="bg-[#1F1E23] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full -mr-4 -mt-4"></div>
                <div className="relative z-10">
                    <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-1">Nama Siswi</p>
                    <p className="text-white font-bold text-lg leading-tight mb-4">{absensiStatus?.nama_lengkap}</p>
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-0.5">Kelas</p>
                            <p className="text-white font-mono text-sm">{absensiStatus?.kelas}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-0.5">NIS</p>
                            <p className="text-white font-mono text-sm tracking-wide">{absensiStatus?.nis}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Info Waktu */}
            <div className="flex gap-3">
                <div className="flex-1 bg-[#1F1E23] p-3 rounded-xl border border-white/5 flex items-center justify-center gap-2">
                    <Clock size={14} className="text-indigo-400" />
                    <span className="text-white font-mono text-sm">{scanTime} WIB</span>
                </div>
                <div className="flex-1 bg-[#1F1E23] p-3 rounded-xl border border-white/5 flex items-center justify-center">
                    <span className="text-white font-bold text-sm tracking-wide uppercase">{mapSholat(sholatTime || '')}</span>
                </div>
            </div>
            
            {/* Error Message */}
            {processStatus === 'error' && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">{errorMessage}</div>
            )}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex flex-col gap-3">
            {processStatus === 'success' ? (
                <Button 
                    className="w-full bg-white hover:bg-gray-200 text-black font-bold h-12 rounded-xl transition-all"
                    onClick={handleCloseAndResume}
                >
                    Tutup
                </Button>
            ) : (
                <>
                    <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleProcess}
                        disabled={loading}
                    >
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses Data...</> : 'Proses Absensi'}
                    </Button>
                    
                    {!loading && (
                        <button 
                            className="w-full py-3 text-xs text-white/40 hover:text-white transition-colors"
                            onClick={handleCloseAndResume}
                        >
                            Batal & Scan Ulang
                        </button>
                    )}
                </>
            )}
        </div>

      </div>
    </div>
  );
}