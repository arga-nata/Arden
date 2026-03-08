"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { KeyRound, Loader2 } from "lucide-react"
import { User } from "@/types/api"

interface ResetPasswordDialogProps {
  open: boolean
  user: User
  onOpenChange: (open: boolean) => void
}

export function ResetPasswordDialog({
  open,
  user,
  onOpenChange,
}: ResetPasswordDialogProps) {
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setPassword("")
      setConfirm("")
      setLoading(false)
    }
  }, [open])

  // 🔥 VALIDASI: Pass minimal 6 char & Harus Sama
  const isValid = password.length >= 6 && password === confirm;

  async function handleReset() {
    if (!isValid) return;

    try {
      setLoading(true)
      // Simulasi API delay (Ganti dengan API call kamu nanti)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("RESET:", { id: user.id_user, new_pass: password })

      // 🔥 TOAST SPESIFIK
      toast.success(`Password ${user.username} berhasil direset`)

      onOpenChange(false)
    } catch {
      toast.error("Gagal mereset password")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "bg-[#050505] border border-white/10 text-white placeholder:text-gray-600 shadow-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-white/50 focus-visible:border-white/50 hover:border-white/30 transition-colors"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0a0a0a] border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-amber-500" />
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Reset password untuk akun berikut.
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/10" />

        <div className="rounded-md border border-white/10 bg-white/5 p-3">
          <div className="text-sm">
            <div className="font-medium text-white">{user.nama_lengkap}</div>
            <div className="text-xs text-gray-400 mt-1">
              @{user.username} — {user.role}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password Baru</Label>
            <Input
              id="password"
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Konfirmasi Password</Label>
            <Input
              id="confirm"
              type="password"
              className={inputClass}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi password baru"
            />
          </div>

          {/* Helper Text jika password belum valid */}
          {!isValid && password.length > 0 && (
            <p className="text-[10px] text-red-400 italic transition-all">
              * Password minimal 6 karakter & wajib sama
            </p>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            className="border-white/10 bg-transparent text-gray-300 hover:bg-white/5"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>

          {/* 🔥 TOMBOL MATI JIKA PASSWORD BELUM VALID */}
          <Button
            onClick={handleReset}
            disabled={loading || !isValid}
            className={`
               border-0 font-medium transition-all
               ${(!isValid) ? "bg-white/10 text-gray-500 cursor-not-allowed" : "bg-amber-500 text-black hover:bg-amber-600"}
            `}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}