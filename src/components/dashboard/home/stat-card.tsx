"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon, Info, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  subtext: string
  icon: LucideIcon
  color: string
  trend?: number
}

export function StatCard({ label, value, subtext, icon: Icon, color, trend }: StatCardProps) {
  const [displayValue, setDisplayValue] = React.useState(typeof value === 'number' ? value.toString() : value)

  React.useEffect(() => {
    if (typeof value === 'number') setDisplayValue(value.toLocaleString('id-ID'))
  }, [value])

  return (
    <div className="relative w-full overflow-hidden rounded-[20px] border border-white/5 bg-[#151419] p-4 shadow-lg transition-all duration-300 hover:border-white/10 hover:bg-[#1a191f] group outline-none ring-0">
      <div className="relative z-10 flex flex-col justify-between h-full gap-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#C9C9C9]/80">{label}</p>
            <div className={cn("p-2 rounded-lg bg-white/5 border border-white/5 shadow-[0_0_15px_-3px_rgba(255,255,255,0.1)]", color)}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-white font-space tracking-tight">{displayValue}</h3>
            {trend !== undefined && (
              <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium mb-1.5", trend > 0 ? "text-emerald-400 bg-emerald-400/10" : trend < 0 ? "text-red-400 bg-red-400/10" : "text-gray-400 bg-gray-400/10")}>
                {trend > 0 ? <TrendingUp size={10} /> : trend < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
                <span>{trend > 0 ? "+" : ""}{trend}</span>
              </div>
            )}
          </div>
        </div>
        <div className="pt-3 border-t border-white/5 text-xs text-muted-foreground/70 flex items-center gap-2">
          <Info size={14} className="text-blue-400/70" />
          <span className="truncate">{subtext}</span>
        </div>
      </div>
    </div>
  )
}