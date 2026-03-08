"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, User as UserIcon, Droplets, CheckCircle2 } from "lucide-react" // Tambah Icon QR
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Siswi, Class } from "@/types/api"

// --- GLOBAL ENGINE ---
import { DataTable } from "@/components/data-table/data-table"

// --- SMART DIALOGS (GENERIC) ---
import { GenericCreateDialog, FieldConfig } from "./ui/create-dialog"
import { GenericEditDialog } from "./ui/edit-dialog"
import { GenericDeleteDialog } from "./ui/delete-dialog"
import { ImportDialog } from "./ui/import-dialog"

interface SiswiWithStatus extends Siswi {
  is_haid?: boolean
  haid_day?: number
}

export function SiswiDataTable({ data }: { data: Siswi[] }) {
  const [openCreate, setOpenCreate] = useState(false)
  const [openImport, setOpenImport] = useState(false)

  const [editData, setEditData] = useState<Siswi | null>(null)
  const [deleteData, setDeleteData] = useState<Siswi | null>(null)

  // --- STATE KELAS (Untuk Dropdown) ---
  const [classOptions, setClassOptions] = useState<{ label: string, value: string }[]>([])

  // 🔥 FETCH DATA KELAS SAAT LOAD
  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch('/api/class')
        const json = await res.json()
        if (json.status === 'success') {
          const options = json.data.map((cls: Class) => ({
            label: cls.nama_kelas,
            value: cls.id_kelas.toString()
          }))
          setClassOptions(options)
        }
      } catch (err) {
        console.error("Gagal mengambil data kelas", err)
      }
    }
    fetchClasses()
  }, [])

  // --- CONFIG FIELDS (ICODE TIDAK DIMASUKKAN DISINI) ---
  // Backend akan otomatis generate ICODE saat create
  const createFields: FieldConfig[] = React.useMemo(() => [
    { name: "nama_lengkap", label: "Nama Lengkap", type: "text", required: true },
    { name: "nis", label: "NIS", type: "number", required: true },
    {
      name: "id_kelas",
      label: "Kelas",
      type: "select",
      placeholder: "Pilih Kelas Siswi",
      options: classOptions,
      required: true
    }
  ], [classOptions])

  // Backend akan mengabaikan update ICODE, jadi tidak perlu ditampilkan
  const editFields: FieldConfig[] = React.useMemo(() => [
    { name: "nama_lengkap", label: "Nama Lengkap", type: "text" },
    { name: "nis", label: "NIS", type: "number" },
    {
      name: "id_kelas",
      label: "Kelas",
      type: "select",
      placeholder: "Pilih Kelas",
      options: classOptions
    },
  ], [classOptions])

  // --- COLUMNS (UPDATE: MENAMPILKAN ICODE) ---
  const columns: ColumnDef<SiswiWithStatus>[] = [
    {
      id: "profile",
      meta: { className: "w-[50px] pr-0 pl-6" },
      header: () => null,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Avatar className="h-9 w-9 border border-white/10 rounded-lg overflow-hidden bg-transparent shrink-0">
            <AvatarImage src="" />
            <AvatarFallback className="bg-transparent text-[10px] font-bold text-pink-400">{row.original.nama_lengkap.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      )
    },
    {
      id: "Students Name",
      header: "Students Name",
      meta: { className: "pl-3 text-left min-w-[150px]" },
      cell: ({ row }) => <span className="text-sm text-white tracking-tight">{row.original.nama_lengkap}</span>
    },
    {
      accessorKey: "ID Code",
      header: "ID Code",
      meta: { className: "text-center px-2" },
      cell: ({ row }) => (
        <div className="flex justify-center">
             {/* Tampilan seperti Chip/Code agar terlihat beda dengan NIS */}
            <Badge variant="outline" className="font-mono text-[10px] tracking-wider text-white/50 border-white/10 ">
                {row.original.icode || "-"} 
            </Badge>
        </div>
      )
    },
   {
      accessorKey: "Nis",
      header: "NIS",
      meta: { className: "text-center px-2" },
      cell: ({ row }) => (
        <div className="flex justify-center">
            <Badge variant="outline" className="font-mono text-[10px] text-gray-400 border-white/10 bg-white/5">
                {row.original.nis || "-"}
            </Badge>
        </div>
      )
    },
    {
      accessorKey: "Class",
      header: "Class",
      meta: { className: "text-center px-2" },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline" className="border-white/10 bg-white/5 text-[10px] font-bold text-gray-400 tracking-tight">
            {row.original.tbl_kelas?.nama_kelas || "No Class"}
          </Badge>
        </div>
      )
    },
    {
      id: "status",
      header: "Status",
      meta: { className: "text-center px-2" },
      cell: ({ row }) => {
        const isHaid = row.original.is_haid;
        return (
          <div className="flex justify-center">
            {isHaid ? (
              <Badge className="bg-pink-500/10 text-pink-500 border-pink-500/20 hover:bg-pink-500/20 gap-1.5 pl-1.5 pr-2.5 h-6 transition-colors">
                <Droplets className="w-3 h-3 fill-pink-500/20" /><span className="text-[10px] font-bold uppercase tracking-wider">Haid: Day {row.original.haid_day}</span>
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 gap-1.5 pl-1.5 pr-2.5 h-6 transition-colors">
                <CheckCircle2 className="w-3 h-3" /><span className="text-[10px] font-bold uppercase tracking-wider">Sholat</span>
              </Badge>
            )}
          </div>
        )
      }
    },
    {
      id: "actions",
      header: "Action",
      meta: { className: "text-center px-4 w-[120px]" },
      cell: ({ row }) => (
        <TooltipProvider delayDuration={0}>
          <div className="flex justify-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-indigo-400" onClick={() => console.log("Profile", row.original.nama_lengkap)}><UserIcon className="h-4 w-4" /></Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black border-white/10 text-[10px] text-indigo-400">View Profile</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-400" onClick={() => setEditData(row.original)}><Pencil className="h-4 w-4" /></Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black border-white/10 text-[10px] text-blue-400">Edit Data</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400" onClick={() => setDeleteData(row.original)}><Trash2 className="h-4 w-4" /></Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black border-white/10 text-[10px] text-red-400">Delete</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )
    }
  ]

  const hybridData = React.useMemo(() => {
    return data.map((siswi) => {
      return {
        ...siswi,
        is_haid: false, // Default Sholat
        haid_day: 0
      } as SiswiWithStatus;
    });
  }, [data]);

  return (
    <>
      <DataTable
        columns={columns}
        data={hybridData}
        title="Student Database"
        description="Manage student profiles and academic statuses."
        searchPlaceholder="Search students..."
        onCreate={() => setOpenCreate(true)}
        onImport={() => setOpenImport(true)} 
      />

      <GenericCreateDialog open={openCreate} onOpenChange={setOpenCreate} title="Add New Student" endpoint="/api/siswi" fields={createFields} />

      <ImportDialog open={openImport} onOpenChangeAction={setOpenImport} />

      {editData && (
        <GenericEditDialog
          open={!!editData}
          onOpenChange={(open) => !open && setEditData(null)}
          title="Edit Student Data"
          description="Perbarui informasi profil, kelas, atau status akademik siswi."
          endpoint="/api/siswi"
          initialData={editData as unknown as Record<string, unknown>}
          idField="id_siswi"
          fields={editFields}
        />
      )}

      {deleteData && (
        <GenericDeleteDialog 
        open={!!deleteData} 
        onOpenChange={(open) => !open && setDeleteData(null)} 
        title="Delete Student" 
        description={<span>Are you sure? <b className="text-white">{deleteData.nama_lengkap}</b> will be deleted.</span>} 
        endpoint="/api/siswi" 
        id={deleteData.id_siswi} 
        itemName={deleteData.nama_lengkap}
      />
      )}
    </>
  )
}