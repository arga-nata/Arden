"use client"

import * as React from "react"
import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Users, AlertTriangle, Activity } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Class } from "@/types/api"

// --- GLOBAL ENGINE ---
import { DataTable } from "@/components/data-table/data-table"

// --- SMART DIALOGS ---
import { GenericCreateDialog, FieldConfig } from "./ui/create-dialog"
import { GenericEditDialog } from "./ui/edit-dialog"
import { GenericDeleteDialog } from "./ui/delete-dialog"

interface ClassWithMetrics extends Class {
  total_students?: number // Data ini sekarang Real dari backend
  active_period?: number 
  permissions?: number   
  warnings?: number      
  health_status?: "Excellent" | "Good" | "Attention" | "Critical"
}

export function ClassDataTable({ data }: { data: ClassWithMetrics[] }) {
  const [openCreate, setOpenCreate] = useState(false)
  const [editData, setEditData] = useState<ClassWithMetrics | null>(null)
  const [deleteData, setDeleteData] = useState<ClassWithMetrics | null>(null)

  // --- FIELDS CONFIG ---
  const classFields: FieldConfig[] = [
    // 🔥 Nama kelas auto UPPERCASE (dihandle di dialog)
    { name: "nama_kelas", label: "Nama Kelas", type: "text", placeholder: "Contoh: X RPL 1", required: true },
    // 🔥 Wali kelas sekarang WAJIB (Required)
    { name: "wali_kelas", label: "Wali Kelas", type: "text", placeholder: "Nama Guru Wali", required: true }
  ]

  // --- COLUMNS ---
  const columns: ColumnDef<ClassWithMetrics>[] = [
    {
      id: "profile",
      meta: { className: "w-[50px] pr-0 pl-6" }, 
      header: () => null,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Avatar className="h-9 w-9 border border-white/10 rounded-lg overflow-hidden bg-transparent shrink-0">
            <AvatarImage src="" /> 
            <AvatarFallback className="bg-transparent text-[10px] font-bold text-gray-500">{row.original.nama_kelas.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      )
    },
    {
      id: "Class Name",
      header: "Class Name",
      meta: { className: "pl-3 text-left min-w-[120px]" },
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm text-white tracking-tight font-medium">{row.original.nama_kelas}</span>
          <span className="text-[10px] text-gray-500">{row.original.wali_kelas || "No Teacher"}</span>
        </div>
      )
    },
    {
      accessorKey: "students",
      header: "Students",
      meta: { className: "text-center px-2" },
      cell: ({ row }) => (
        <div className="flex justify-center items-center gap-1.5 text-gray-300">
          <Users className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-bold font-mono">{row.original.total_students || 0}</span>
        </div>
      )
    },
    {
      accessorKey: "period", // Mock data untuk visualisasi
      header: "Period",
      meta: { className: "text-center px-2" },
      cell: ({ row }) => {
        const val = row.original.active_period || 0;
        return (
          <div className="flex justify-center">
            <Badge variant="outline" className={cn("border-pink-500/20 bg-pink-500/10 text-pink-400 text-[10px] h-6 px-2 gap-1", val === 0 && "opacity-30 grayscale border-white/10")}>
              <Activity className="w-3 h-3" />{val}
            </Badge>
          </div>
        )
      }
    },
    {
      accessorKey: "Discipline", // Mock data untuk visualisasi
      header: "Discipline",
      meta: { className: "text-center px-4" },
      cell: ({ row }) => {
        const status = row.original.health_status || "Excellent";
        let color = "bg-green-500/10 text-green-500 border-green-500/20"; 
        if (status === "Good") color = "bg-blue-500/10 text-blue-500 border-blue-500/20";
        if (status === "Attention") color = "bg-amber-500/10 text-amber-500 border-amber-500/20";
        if (status === "Critical") color = "bg-red-500/10 text-red-500 border-red-500/20";
        return (
          <div className="flex justify-center">
            <Badge className={cn("rounded-md border text-[10px] font-bold uppercase tracking-wider", color)}>{status}</Badge>
          </div>
        )
      }
    },
    {
      id: "actions",
      header: "Action",
      meta: { className: "text-center px-4 w-[100px]" },
      cell: ({ row }) => (
        <TooltipProvider delayDuration={0}>
          <div className="flex justify-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-400" onClick={() => setEditData(row.original)}><Pencil className="h-4 w-4" /></Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black border-white/10 text-[10px] text-blue-400">Edit Class</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400" onClick={() => setDeleteData(row.original)}><Trash2 className="h-4 w-4" /></Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black border-white/10 text-[10px] text-red-400">Delete</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )
    }
  ]

  // Simulasi data tambahan (health, period) karena backend hanya kirim data dasar + total students
  const hybridData = React.useMemo(() => {
    return data.map((realClass) => {
      const seed = realClass.id_kelas ? Number(realClass.id_kelas) : realClass.nama_kelas.length;
      const warn = (seed * 5) % 4;
      let status: "Excellent" | "Good" | "Attention" | "Critical" = "Excellent";
      if (warn === 1) status = "Good"; if (warn === 2) status = "Attention"; if (warn > 2) status = "Critical";
      return {
        ...realClass,
        active_period: (seed * 3) % 9,
        warnings: warn,
        health_status: status
      } as ClassWithMetrics;
    });
  }, [data]);

  return (
    <>
      <DataTable 
        columns={columns} 
        data={hybridData} 
        title="Class Management" 
        description="Overview of classroom health, discipline cycles, and student statistics."
        searchPlaceholder="Search classes..."
        onCreate={() => setOpenCreate(true)} 
      />

      <GenericCreateDialog 
        open={openCreate} 
        onOpenChange={setOpenCreate} 
        title="Buat Kelas Baru" 
        description="Pastikan format nama kelas baku (Contoh: X RPL 1)."
        endpoint="/api/database/class" 
        fields={classFields} 
      />

      {editData && (
        <GenericEditDialog 
          open={!!editData} 
          onOpenChange={(open) => !open && setEditData(null)} 
          title="Edit Data Kelas"
          description="Ubah nama atau wali kelas."
          endpoint="/api/database/class" 
          initialData={editData as unknown as Record<string, unknown>} 
          idField="id_kelas" 
          fields={classFields} 
        />
      )}

      {/* 🔥 PESAN PERINGATAN HAPUS SISWA OTOMATIS */}
      {deleteData && (
        <GenericDeleteDialog 
          open={!!deleteData} 
          onOpenChange={(open) => !open && setDeleteData(null)} 
          title="Hapus Kelas & Siswa" 
          description={
            <div className="space-y-2">
              <p>Apakah Anda yakin ingin menghapus kelas <b className="text-white">{deleteData.nama_kelas}</b>?</p>
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-md text-xs text-red-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <b>PERHATIAN:</b> Tindakan ini juga akan menghapus secara permanen 
                  <b className="text-white underline mx-1">{deleteData.total_students || 0} data siswi</b> 
                  yang terdaftar di kelas ini. Data yang dihapus tidak dapat dikembalikan.
                </span>
              </div>
            </div>
          } 
          endpoint="/api/database/class" 
          itemName={deleteData.nama_kelas}
          id={deleteData.id_kelas || 0} 
        />
      )}
    </>
  )
}