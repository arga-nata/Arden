"use client"

import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Filter, X, ChevronDown } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

type FilterType = "all" | "X" | "XI" | "XII"

export interface ClassData {
  angkatan: "X" | "XI" | "XII"
  namaKelas: string
  sholat: number
  haid: number
}

const chartConfig = {
  sholat: {
    label: "Sholat",
    color: "#10b981",
  },
  haid: {
    label: "Haid",
    color: "#ec4899",
  },
} satisfies ChartConfig

export function OverviewChart({ data }: { data: ClassData[] }) {
  const [filter, setFilter] = useState<FilterType>("all")

  const processedData = useMemo(() => {
    if (filter === "all") {
      return ["X", "XI", "XII"].map((angkatan) => {
        const items = data.filter((d) => d.angkatan === angkatan)
        return {
          label: `Kelas ${angkatan}`,
          sholat: items.reduce((a, b) => a + b.sholat, 0),
          haid: items.reduce((a, b) => a + b.haid, 0),
        }
      })
    }

    return data
      .filter((d) => d.angkatan === filter)
      .map((d) => ({
        label: d.namaKelas,
        sholat: d.sholat,
        haid: d.haid,
      }))
  }, [data, filter])

  const isSummary = filter === "all"

  /**
   * LOGIKA LEBAR DINAMIS
   * Jika Summary (hanya 3 bar), gunakan 100%.
   * Jika detail kelas, beri ruang minimal 70px per grup bar.
   * Scroll akan muncul otomatis jika total lebar melebihi kontainer.
   */
  const chartWidth = useMemo(() => {
    if (isSummary) return "100%"
    const minWidthNeeded = processedData.length * 70
    return minWidthNeeded > 500 ? `${minWidthNeeded}px` : "100%"
  }, [processedData.length, isSummary])

  // Bar size dibuat lebih konsisten agar enak dilihat saat di-scroll
  const barSize = isSummary ? 40 : 20

  return (
    <Card className="col-span-4 bg-[#151419] border-white/5 text-white shadow-none outline-none ring-0 font-inter overflow-hidden">
      
      <CardHeader className="flex flex-row items-center justify-between py-0 px-5 border-white/5 space-y-0">
        <div className="flex flex-col gap-0">
          <CardTitle className="text-base font-bold text-white/90">
            Statistik Kehadiran
          </CardTitle>
          <CardDescription className="text-xs font-plus-jakarta text-muted-foreground opacity-80">
            {isSummary ? "Ringkasan per angkatan" : `Detail data: kelas ${filter}`}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {isSummary ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 h-7 px-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-plus-jakarta font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all outline-none focus:ring-0">
                <Filter size={12} className="opacity-70" />
                Filter Tingkat
                <ChevronDown size={12} className="opacity-40" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1a191f] border-white/10 text-white font-plus-jakarta shadow-2xl">
                <DropdownMenuItem onClick={() => setFilter("X")} className="text-xs py-2 cursor-pointer focus:bg-white/5">Kelas X</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("XI")} className="text-xs py-2 cursor-pointer focus:bg-white/5">Kelas XI</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("XII")} className="text-xs py-2 cursor-pointer focus:bg-white/5">Kelas XII</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 h-7 pl-3 pr-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in zoom-in duration-300">
              <span className="text-[10px] font-bold font-plus-jakarta text-emerald-400 uppercase tracking-tight">
                Kelas {filter}
              </span>
              <button 
                onClick={() => setFilter("all")}
                className="hover:bg-emerald-500/20 p-0.5 rounded-full transition-colors text-emerald-400 outline-none"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* ScrollArea diatur agar tidak bisa scroll vertikal (overflow-y-hidden) */}
        <ScrollArea className="w-full whitespace-nowrap overflow-y-hidden">
          <div
            className="px-4 pt-6"
            style={{ 
              width: chartWidth, 
              height: "220px", // Tinggi fix agar tidak ada scroll vertikal
              minWidth: "100%" 
            }}
          >
            <ChartContainer id="attendance-overview" config={chartConfig} className="h-full w-full">
              <BarChart data={processedData} barGap={4}>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.03)"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={12}
                  fontSize={10}
                  stroke="#6b7280"
                  className="font-plus-jakarta"
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  stroke="#6b7280"
                  allowDecimals={false}
                  tickMargin={8}
                  className="font-plus-jakarta"
                />

                <ChartTooltip
                  cursor={false} 
                  content={
                    <ChartTooltipContent 
                      indicator="dashed" 
                      className="bg-[#1a191f]/95 backdrop-blur-md border-white/10 text-white text-xs font-plus-jakarta" 
                    />
                  }
                />

                <Bar
                  dataKey="sholat"
                  fill={chartConfig.sholat.color}
                  radius={[4, 4, 0, 0]}
                  barSize={barSize}
                />
                <Bar
                  dataKey="haid"
                  fill={chartConfig.haid.color}
                  radius={[4, 4, 0, 0]}
                  barSize={barSize}
                />
              </BarChart>
            </ChartContainer>
          </div>
          
          {/* ScrollBar hanya untuk horizontal */}
          <ScrollBar orientation="horizontal" className="h-2 bg-white/5" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}