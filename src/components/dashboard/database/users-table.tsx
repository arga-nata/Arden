"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { ShieldCheck, Circle, Pencil, Trash2, KeyRound, UserCog } from "lucide-react"
import { cn } from "@/lib/utils"
import { User } from "@/types/api"

// --- GLOBAL ENGINE ---
import { DataTable } from "@/components/data-table/data-table"

// --- SMART DIALOGS ---
import { GenericCreateDialog, FieldConfig } from "./ui/create-dialog"
import { GenericEditDialog } from "./ui/edit-dialog"
import { GenericDeleteDialog } from "./ui/delete-dialog"
import { ResetPasswordDialog } from "./ui/reset-dialog" 

export function UsersDataTable({ data }: { data: User[] }) {
  const [openCreate, setOpenCreate] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [resetUser, setResetUser] = useState<User | null>(null)
  
  // State untuk menyimpan data user yang sedang login
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    // Fetch data "Who am I?"
    fetch("/api/user/me", { cache: "no-store" })
      .then(res => res.json())
      .then(res => { 
        if (res.status === 'success') setCurrentUser(res.data) 
      })
      .catch(err => console.error("Error fetching me:", err))
  }, [])

  // --- CONFIG FIELDS ---
  const createFields: FieldConfig[] = [
    { name: "nama_lengkap", label: "Full Name", type: "text", required: true },
    { name: "username", label: "Username", type: "text", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    { 
      name: "role", label: "Role", type: "select", 
      options: [{label:"Admin", value:"Admin"}, {label:"Pemantau", value:"Pemantau"}, {label:"Pelaksana", value:"Pelaksana"}] 
    }
  ]

  const editFields: FieldConfig[] = [
    { name: "nama_lengkap", label: "Full Name", type: "text" },
    { name: "username", label: "Username", type: "text", readOnly: true },
    { 
      name: "role", label: "Role", type: "select", 
      options: [{label:"Admin", value:"Admin"}, {label:"Pemantau", value:"Pemantau"}, {label:"Pelaksana", value:"Pelaksana"}] 
    },
    {
      name: "status_akun", label: "Status", type: "select",
      options: [{label:"Aktif", value:"Aktif"}, {label:"Nonaktif", value:"Nonaktif"}]
    }
  ]

  // --- COLUMNS ---
  const columns: ColumnDef<User>[] = [
    {
      id: "profile",
      meta: { className: "w-[50px] pr-0 pl-6" },
      header: () => null,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Avatar className="h-9 w-9 border border-white/10 rounded-lg bg-transparent">
            <AvatarImage src={row.original.foto_url || ""} />
            <AvatarFallback className="bg-transparent text-[10px] font-bold text-gray-500">
              {row.original.nama_lengkap.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      id: "Name",
      header: "Name",
      meta: { className: "pl-3 text-left" },
      cell: ({ row }) => (
        <span className="text-sm text-white tracking-tight font-medium">{row.original.nama_lengkap}</span>
      ),
    },
    {
      accessorKey: "Username",
      header: "Username",
      meta: { className: "text-left px-4" },
      cell: ({ row }) => (
        <span className="text-xs text-gray-500 font-mono font-bold tracking-tight">@{row.original.username}</span>
      ),
    },
    {
      accessorKey: "Role",
      header: "Role",
      meta: { className: "text-center px-4" },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline" className="gap-1.5 border-white/5 bg-white/5 text-[10px] font-bold text-gray-400">
            <ShieldCheck className="h-3 w-3 text-indigo-400" />
            {row.original.role}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "Status",
      header: "Status",
      meta: { className: "text-center px-4" },
      cell: ({ row }) => {
        const isOnline = row.original.status_akun === "Online"
        return (
          <div className="flex justify-center">
            <Badge className={cn("rounded-md border-none text-[10px] font-bold pl-1.5 pr-2 py-0.5", isOnline ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-500/10 text-zinc-500")}>
              <Circle className={cn("h-1.5 w-1.5 mr-1.5 fill-current", isOnline ? "animate-pulse" : "")} />
              {row.original.status_akun || "OFFLINE"}
            </Badge>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Action",
      meta: { className: "text-center px-4" },
      cell: ({ row }) => {
        const targetUser = row.original;
        
        // 1. Cek apakah ini diri sendiri?
        // Kita bandingkan username karena ID kadang number/string beda
        const isSelf = currentUser?.username === targetUser.username;

        // 2. Cek apakah ini sesama Admin?
        const isPeerAdmin = currentUser?.role === 'Admin' && targetUser.role === 'Admin';

        // LOGIKA TAMPILAN
        if (isSelf) {
          return (
            <div className="flex justify-center">
               <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] px-2 py-1 gap-1">
                  <UserCog className="w-3 h-3" /> YOUR ACCOUNT
               </Badge>
            </div>
          )
        }

        // Logic disable tombol
        // Reset password tetap boleh untuk sesama admin (opsional, set true jika mau disable juga)
        const disableEditDelete = isPeerAdmin; 

        return (
          <TooltipProvider delayDuration={0}>
            <div className="flex justify-center gap-1">
              
              {/* EDIT BUTTON */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={disableEditDelete}
                    onClick={() => setEditUser(targetUser)} 
                    className={cn("h-7 w-7", disableEditDelete ? "opacity-30 cursor-not-allowed text-gray-600" : "hover:bg-blue-500/10 hover:text-blue-400")}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#0a0a0a] border-white/10 text-white text-[10px]">
                  {disableEditDelete ? "Cannot edit fellow Admin" : "Edit User"}
                </TooltipContent>
              </Tooltip>

              {/* RESET PASSWORD (Bisa diedit logicnya kalau mau disable juga) */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setResetUser(targetUser)} 
                    className="h-7 w-7 hover:bg-amber-500/10 hover:text-amber-400"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#0a0a0a] border-white/10 text-white text-[10px]">Reset Password</TooltipContent>
              </Tooltip>

              {/* DELETE BUTTON */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={disableEditDelete}
                    onClick={() => setDeleteUser(targetUser)} 
                    className={cn("h-7 w-7", disableEditDelete ? "opacity-30 cursor-not-allowed text-gray-600" : "hover:bg-red-500/10 hover:text-red-400")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#0a0a0a] border-white/10 text-white text-[10px]">
                  {disableEditDelete ? "Cannot delete fellow Admin" : "Delete User"}
                </TooltipContent>
              </Tooltip>

            </div>
          </TooltipProvider>
        )
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        title="User Management"
        description="Kelola akun, role, dan hak akses pengguna sistem."
        searchPlaceholder="Cari nama atau username..."
        onCreate={() => setOpenCreate(true)}
      />

      <GenericCreateDialog 
        open={openCreate} 
        onOpenChange={setOpenCreate}
        title="Register New User"
        endpoint="/api/user"
        fields={createFields}
      />

      {editUser && (
        <GenericEditDialog 
          open={!!editUser} 
          onOpenChange={(open) => !open && setEditUser(null)} 
          title="Edit User Data"
          endpoint="/api/user" // Pastikan endpoint ini mengarah ke file yang punya method PATCH
          initialData={editUser as unknown as Record<string, unknown>}
          idField="id_user"
          fields={editFields}
        />
      )}
      
      {resetUser && (
        <ResetPasswordDialog 
          open={!!resetUser} 
          user={resetUser} 
          onOpenChange={(open) => !open && setResetUser(null)} 
        />
      )}
      
      {deleteUser && (
        <GenericDeleteDialog 
          open={!!deleteUser}
          onOpenChange={(open) => !open && setDeleteUser(null)}
          title="Delete User"
          itemName={deleteUser.nama_lengkap} 
          description={<span>Are you sure? This will permanently delete <b>{deleteUser.nama_lengkap}</b>.</span>}
          // 🔥 PERHATIKAN: GenericDeleteDialog defaultnya kirim ?id=... ke endpoint
          // Tapi routemu pakai dynamic [id]. 
          // SOLUSI SEMENTARA: Kita ubah di delete-dialog.tsx agar support /api/user/[id]
          // ATAU, karena kita pakai Generic, kita set endpoint API khusus di bawah ini
          endpoint="/api/user" 
          id={deleteUser.id_user}
        />
      )}
    </>
  )
}