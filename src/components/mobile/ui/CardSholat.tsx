'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image'; 
import { Clock, Hourglass } from 'lucide-react'; 
import { Sholat, PrayerTimes } from '@/types/api';
import { getDataSholat } from '@/components/mobile/logic/getDataSholat';

interface ExtendedPrayerTimes extends PrayerTimes {
  Sunrise: string;
}

interface CardSholatProps {
  sholatTime: Sholat;
  setSholatTime: (value: Sholat) => void;
  className?: string;
}

// Tambahkan 'Isya' (bukan Isha) agar sesuai dengan api.ts
type DisplayWaktu = Sholat | 'Sunrise';

export const CardSholat = ({ sholatTime, setSholatTime, className = '' }: CardSholatProps) => {
  const [schedule, setSchedule] = useState<ExtendedPrayerTimes | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. Fetch Jadwal (Sekali saja saat mount)
  useEffect(() => {
    const fetchJadwal = async () => {
      const now = new Date();
      const data = await getDataSholat(now);
      if (data) setSchedule(data as ExtendedPrayerTimes);
    };
    fetchJadwal();
  }, []);

  // 2. Timer Detik (Berjalan tiap detik)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. LOGIKA HITUNGAN (Derived State)
  // Kita hitung langsung di sini, JANGAN pakai useState/useEffect untuk logika ini.
  // Gunakan useMemo agar tidak dihitung ulang jika schedule/waktu tidak berubah drastis
  const { displayStatus, timeRange, activeScanner } = useMemo(() => {
    if (!schedule) {
      return { 
        displayStatus: 'Dhuhr' as DisplayWaktu, 
        timeRange: '00:00 - 00:00',
        activeScanner: 'Dhuhr' as Sholat
      };
    }

    const getMinutes = (timeStr: string) => {
      if(!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    
    const subuh = getMinutes(schedule.Fajr);
    const terbit = getMinutes(schedule.Sunrise);
    const dzuhur = getMinutes(schedule.Dhuhr);
    const ashar = getMinutes(schedule.Asr);
    const maghrib = getMinutes(schedule.Maghrib);
    const isya = getMinutes(schedule.Isha);

    let stat: DisplayWaktu = 'Dhuhr';
    let range = '-';
    let active: Sholat = 'Dhuhr';

    // LOGIKA RANGE
    if (nowMinutes >= subuh && nowMinutes < terbit) {
        stat = 'Fajr';
        active = 'Fajr';
        range = `${schedule.Fajr} - ${schedule.Sunrise}`;
    } 
    else if (nowMinutes >= terbit && nowMinutes < dzuhur) {
        stat = 'Sunrise'; 
        active = 'Dhuhr'; 
        range = `${schedule.Sunrise} - ${schedule.Dhuhr}`;
    } 
    else if (nowMinutes >= dzuhur && nowMinutes < ashar) {
        stat = 'Dhuhr';
        active = 'Dhuhr';
        range = `${schedule.Dhuhr} - ${schedule.Asr}`;
    } 
    else if (nowMinutes >= ashar && nowMinutes < maghrib) {
        stat = 'Asr';
        active = 'Asr';
        range = `${schedule.Asr} - ${schedule.Maghrib}`;
    } 
    else if (nowMinutes >= maghrib && nowMinutes < isya) {
        stat = 'Maghrib';
        active = 'Maghrib';
        range = `${schedule.Maghrib} - ${schedule.Isha}`;
    } 
    else {
        // FIX TYPE: Gunakan 'Isya' (sesuai api.ts), jangan 'Isha'
        stat = 'Isya'; 
        active = 'Isya';
        // Tapi untuk ambil jam, tetap pakai schedule.Isha (sesuai properti API)
        range = `${schedule.Isha} - ${schedule.Fajr}`; 
    }

    return { displayStatus: stat, timeRange: range, activeScanner: active };

  }, [currentTime, schedule]); // Dihitung ulang tiap currentTime berubah

  // 4. Update Parent State (setSholatTime)
  // Pisahkan ini ke useEffect tersendiri. Hanya jalan jika 'activeScanner' benar-benar berubah.
  useEffect(() => {
    if (activeScanner && activeScanner !== sholatTime) {
        setSholatTime(activeScanner);
    }
  }, [activeScanner, sholatTime, setSholatTime]);

  const getLabel = (s: DisplayWaktu) => {
    switch(s) {
        case 'Fajr': return 'SHUBUH';
        case 'Sunrise': return 'DHUHA';
        case 'Dhuhr': return 'ZHUHUR';
        case 'Asr': return 'ASHAR';
        case 'Maghrib': return 'MAGHRIB';
        // FIX TYPE: Case-nya 'Isya' (sesuai api.ts)
        case 'Isya': return 'ISYA'; 
        default: return '...';
    }
  };

  return (
    <div className={`w-full bg-[#1F1E23] border border-[#27272A] rounded-2xl p-4 shadow-lg flex items-center gap-5 ${className}`}>
      
      {/* BAGIAN KIRI: LOGO */}
      <div className="flex-none">
        <div className="w-14 h-14 relative flex items-center justify-center">
            <Image 
                src="/arden.svg" 
                alt="Logo Arden" 
                width={50} 
                height={52} 
                className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
            />
        </div>
      </div>

      {/* BAGIAN KANAN: INFORMASI */}
      <div className="flex flex-col flex-1 justify-center gap-0.5">
        
        {/* JUDUL */}
        <h2 className="text-sm font-medium text-white uppercase tracking-wider mb-1">
            JADWAL SHOLAT {getLabel(displayStatus)}
        </h2>

        {/* RANGE WAKTU */}
        <div className="flex items-center gap-2 text-white/50">
            <Hourglass size={12} className="shrink-0" />
            <p className="text-xs font-mono tracking-wide">
                {timeRange}
            </p>
        </div>

        {/* JAM REALTIME */}
        <div className="flex items-center gap-2 text-green-400 mt-0.5">
            <Clock size={12} className="shrink-0 animate-pulse" />
            <p className="text-xs font-mono font-bold tracking-wide">
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
            </p>
        </div>

      </div>

    </div>
  );
};