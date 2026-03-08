"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { CheckCircle2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface CycleQualityItem {
  status: string
  count: number
  fill: string
}

const chartConfig = {
  count: { label: "Jumlah" },
  minimal: { label: "Minimal", color: "var(--minimal)" },
  standard: { label: "Standard", color: "var(--standard)" },
  maximal: { label: "Maximal", color: "var(--maximal)" },
  over: { label: "Over", color: "var(--over)" },
  sholat: { label: "Sholat", color: "var(--sholat)" },
} satisfies ChartConfig

export function CycleQualityChart({ data }: { data: CycleQualityItem[] }) {
  // Hanya menghitung jumlah yang HAID untuk angka di tengah
  const totalHaid = React.useMemo(() => {
    return data
      .filter((item) => item.status !== "sholat")
      .reduce((acc, curr) => acc + curr.count, 0)
  }, [data])

  return (
    <Card className="flex flex-col bg-[#151419] border-white/5 shadow-none font-inter h-full outline-none ring-0 overflow-hidden">
      <CardHeader className="py-2 px-5 pb-0">
        <CardTitle className="text-[11px] font-bold text-white/70 uppercase tracking-widest">
          Monthly Cycle Quality
        </CardTitle>
        <CardDescription className="text-[10px] font-jakarta text-muted-foreground opacity-80">
          Kualitas siklus siswi bulan ini
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0 flex flex-col items-center justify-center min-h-[150px]">
        {/* CHART CONTAINER: Dibuat lebih kecil & fleksibel */}
        <ChartContainer
          id="cycle-quality"
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[140px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel className="font-jakarta" />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={4}     /* Jarak antar segmen */
              cornerRadius={8}      /* Ujung melingkar */
              stroke="none"        /* Menghilangkan garis putih/hitam di pinggir */
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-white text-2xl font-bold font-inter">
                          {totalHaid}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 16} className="fill-muted-foreground text-[8px] font-jakarta uppercase font-bold tracking-tighter">
                          Siswi
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* LEGEND HORIZONTAL: Ringkas di bawah grafik */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 px-4">
          {(["minimal", "standard", "maximal", "over", "sholat"] as const).map((key) => {
            const config = chartConfig[key]
            return (
              <div key={key} className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.color }} />
                <span className="text-[8px] font-jakarta text-muted-foreground uppercase font-bold">
                  {config.label}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start px-5 pb-3 pt-3 gap-1 border-t border-white/5 bg-white/1">
        <div className="flex items-center gap-1.5 text-emerald-400 font-inter font-bold text-[10px]">
          <CheckCircle2 size={12} />
          <span>Normal Range</span>
        </div>
        <p className="text-[9px] font-jakarta text-muted-foreground leading-snug">
          Rata-rata untuk periode <span className="text-white font-bold">Desember 2025</span> masih dalam batas wajar kesehatan reproduksi.
        </p>
      </CardFooter>
    </Card>
  )
}