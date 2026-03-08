
"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export type FieldConfig = {
  name: string
  label: string
  type: "text" | "number" | "password" | "select"
  placeholder?: string
  options?: { label: string; value: string }[]
  required?: boolean
  description?: string
  readOnly?: boolean
}

interface GenericCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  endpoint: string
  fields: FieldConfig[]
  onSuccess?: () => void
}

export function GenericCreateDialog({
  open,
  onOpenChange,
  title,
  description = "Isi formulir berikut untuk menambahkan data baru.",
  endpoint,
  fields,
  onSuccess
}: GenericCreateDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, string | number | undefined>>({})

  // Helper: Auto Title Case
  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
  }

  const handleInputChange = (key: string, value: string | number) => {
    let finalValue = value;
    if (typeof value === "string") {
      if (key === "nama_lengkap") finalValue = toTitleCase(value);
      else if (key === "nama_kelas") finalValue = value.toUpperCase();
    }
    setFormData((prev) => ({ ...prev, [key]: finalValue }))
  }

  // 🔥 VALIDASI: Cek apakah semua field required sudah terisi?
  const isFormValid = useMemo(() => {
    return fields.every((field) => {
      if (!field.required) return true;
      const val = formData[field.name];
      return val !== undefined && val !== "" && val !== null;
    });
  }, [formData, fields]);

  // 🔥 HELPER: Cari nama untuk pesan Toast (agar spesifik)
  const getIdentifierName = () => {
    return formData.nama_lengkap || formData.nama_kelas || formData.username || "Item baru";
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const json = await res.json()
      
      if (!res.ok || json.status === 'fail') {
        throw new Error(json.message || "Gagal menyimpan data")
      }

      // 🔥 TOAST SPESIFIK: Sebutkan namanya!
      toast.success(`${getIdentifierName()} berhasil ditambahkan`)

      onOpenChange(false)
      setFormData({}) 
      router.refresh()
      if (onSuccess) onSuccess()
    } catch (err: unknown) {
      // 🔥 TOAST ERROR DETAIL
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan sistem")
    } finally {
      setLoading(false)
    }
  }

  // Style Inputs
  const inputClass = "bg-[#050505] border border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-white/50 hover:border-white/30 transition-colors"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#0a0a0a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-gray-400">{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          {fields.map((field) => (
            <div key={field.name} className="grid gap-2">
              <Label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              {field.type === "select" ? (
                <Select onValueChange={(val) => handleInputChange(field.name, val)}>
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder={field.placeholder || "Pilih..."} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="focus:bg-white/10 focus:text-white cursor-pointer">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  className={`${inputClass} ${field.readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
                  readOnly={field.readOnly}
                  value={formData[field.name]?.toString() || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 bg-transparent text-gray-300 hover:bg-white/5">
            Batal
          </Button>
          
          {/* 🔥 TOMBOL MATI JIKA FORM BELUM VALID */}
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !isFormValid} 
            className={`
              border-0 font-medium transition-all
              ${(!isFormValid) ? "bg-white/10 text-gray-500 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200"}
            `}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}