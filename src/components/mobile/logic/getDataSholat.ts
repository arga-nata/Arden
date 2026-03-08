// File: src/components/mobile/logic/getDataSholat.ts
import { PrayerTimes } from "@/types/api";

// 1. Ambil URL dari Environment Variable
const API_URL = process.env.NEXT_PUBLIC_API_TIME_SHOLAT || 'https://api.aladhan.com';

export const getDataSholat = async (date: Date): Promise<PrayerTimes | null> => {
  try {
    // Koordinat (Bisa disesuaikan lewat ENV juga kalau mau dinamis)
    const lat = -8.0954; 
    const long = 112.1609; 
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Gunakan variable API_URL disini
    const res = await fetch(`${API_URL}/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${long}&method=20`);
    const json = await res.json();

    if (json.code === 200 && json.data) {
        return json.data.timings;
    }
    return null;
  } catch (error) {
    console.error("Gagal ambil jadwal sholat:", error);
    return null;
  }
}