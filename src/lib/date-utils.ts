export function formatTanggalIndonesia(isoString: string | Date | null) {
  if (!isoString) return "-";

  return new Date(isoString).toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta", // KUNCI UTAMA: Paksa ke WIB
    day: "numeric",
    month: "long", // "Januari"
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit", // Buka komen jika butuh detik
    hour12: false, // Format 24 jam
  });
}

export function formatJamSaja(isoString: string | Date | null) {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleTimeString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}