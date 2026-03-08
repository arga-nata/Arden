"use client"

import { 
  Users, 
  Droplets, 
  CheckCircle2, 
  FileClock, 
  AlertTriangle 
} from "lucide-react"
import { StatCard } from "@/components/dashboard/home/stat-card"

// Update Interface agar menerima object { value, trend }
interface StatItem {
  value: number
  trend: number
}

interface StatsProps {
  totalSiswi: StatItem
  sedangHaid: StatItem
  wajibSholat: StatItem
  izinSakit: StatItem
  alpha: StatItem
}

export function SectionCards({ stats }: { stats: StatsProps }) {
  
  const cards = [
    {
      label: "Total Siswi",
      value: stats.totalSiswi.value,
      trend: stats.totalSiswi.trend,
      subtext: "Terdaftar aktif",
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Sedang Haid",
      value: stats.sedangHaid.value,
      trend: stats.sedangHaid.trend,
      subtext: "Laporan masuk hari ini",
      icon: Droplets,
      color: "text-pink-400",
    },
    {
      label: "Wajib Sholat",
      value: stats.wajibSholat.value,
      trend: stats.wajibSholat.trend,
      subtext: "Target jamaah dzuhur",
      icon: CheckCircle2,
      color: "text-emerald-400",
    },
    {
      label: "Izin / Sakit",
      value: stats.izinSakit.value,
      trend: stats.izinSakit.trend,
      subtext: "Absensi dengan keterangan",
      icon: FileClock,
      color: "text-amber-400",
    },
    {
      label: "Alpha / Bolos",
      value: stats.alpha.value,
      trend: stats.alpha.trend,
      subtext: "Perlu tindak lanjut BK",
      icon: AlertTriangle,
      color: "text-red-400",
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((item, index) => (
        <div key={index} className="w-full">
          <StatCard 
            label={item.label}
            value={item.value}
            trend={item.trend}
            subtext={item.subtext}
            icon={item.icon}
            color={item.color}
          />
        </div>
      ))}
    </div>
  )
}