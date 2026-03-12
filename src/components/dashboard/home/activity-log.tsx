"use client"

import { useMemo, useState } from "react"
import { User, QrCode, Edit3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

// FIX: id menerima string | number untuk mencocokkan data dummy
interface ActivityLogItem {
  id: string | number;
  studentName: string;
  time: string;
  method: 'Scan QR' | 'Manual';
  className: string;
  executor: string;
  category: 'Zuhur' | 'Ashar';
}

export function ActivityLog({ logs }: { logs: ActivityLogItem[] }) {
  const [filter, setFilter] = useState("all")

  const filteredLogs = useMemo(() => {
    let result = [...logs]
    if (filter !== "all") result = result.filter(log => log.category === filter)
    return result.sort((a, b) => b.time.localeCompare(a.time))
  }, [logs, filter])

  return (
    <Card className="h-full flex flex-col bg-[#151419] border-white/5 shadow-none font-inter outline-none ring-0 overflow-hidden gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b border-white/5 shrink-0 space-y-0">
        <CardTitle className="text-xs font-bold text-white/50 uppercase tracking-widest">Riwayat Presensi</CardTitle>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-7 w-23.75 text-[10px] bg-white/5 border-white/10 text-white/80 outline-none px-2">
            <SelectValue placeholder="Waktu" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a191f] border-white/10 text-white">
            <SelectItem value="all" className="text-xs">Semua</SelectItem>
            <SelectItem value="Zuhur" className="text-xs">Zuhur</SelectItem>
            <SelectItem value="Ashar" className="text-xs">Ashar</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex">
        <ScrollArea className="flex-1 w-full h-222.25"> 
          <div className="flex flex-col px-5 py-2">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex flex-wrap items-center justify-between py-4 border-b border-white/5 last:border-0 gap-3 group">
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-white/95 truncate max-w-37.5">{log.studentName}</span>
                    <span className="text-[10px] text-white/30 shrink-0">• {log.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
                    {log.method === 'Scan QR' ? <QrCode size={12} className="text-emerald-500/80" /> : <Edit3 size={12} className="text-blue-500/80" />}
                    <span className="truncate">Input {log.method} — {log.className}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
                  <User size={12} className="text-white/40" />
                  <span className="text-[10px] font-bold text-white/70 truncate max-w-24">{log.executor}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}