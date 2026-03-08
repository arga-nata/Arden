"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { FieldConfig } from "./create-dialog"

interface GenericEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  endpoint: string
  initialData: Record<string, unknown>
  idField: string 
  fields: FieldConfig[]
  onSuccess?: () => void
}

export function GenericEditDialog({
  open,
  onOpenChange,
  title,
  description = "Lakukan perubahan data pada formulir di bawah ini.",
  endpoint,
  initialData,
  idField,
  fields,
  onSuccess
}: GenericEditDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  useEffect(() => {
    if (initialData) setFormData({ ...initialData })
  }, [initialData, open])

  const toTitleCase = (str: string) => str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());

  const handleInputChange = (key: string, value: string | number | boolean) => {
    let finalValue = value;
    if (typeof value === "string") {
      if (key === "nama_lengkap") finalValue = toTitleCase(value);
      else if (key === "nama_kelas") finalValue = value.toUpperCase();
    }
    setFormData((prev) => ({ ...prev, [key]: finalValue }))
  }

  // 🔥 VALIDASI: Apakah ada perubahan? (Dirty Check)
  const isChanged = useMemo(() => {
    if (!initialData || !formData) return false;
    return fields.some((field) => {
      const initialVal = initialData[field.name];
      const currentVal = formData[field.name];
      // Bandingkan sebagai string untuk keamanan
      return String(initialVal ?? "").trim() !== String(currentVal ?? "").trim();
    });
  }, [formData, initialData, fields]);

  // 🔥 VALIDASI: Apakah ada field required yang dikosongkan?
  const isValid = useMemo(() => {
    return fields.every(field => {
        if(!field.required) return true;
        const val = formData[field.name];
        return val !== "" && val !== null && val !== undefined;
    });
  }, [formData, fields]);

  const getName = () => formData.nama_lengkap || formData.nama_kelas || formData.username || "Data";

  async function handleSubmit() {
    setLoading(true)
    try {
      const payload = { ...formData, [idField]: initialData[idField] }
      
      const res = await fetch(endpoint, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || json.status === 'fail') throw new Error(json.message || "Gagal update data")

      // 🔥 TOAST SPESIFIK
      toast.success(`Data ${getName()} berhasil diperbarui`)

      onOpenChange(false)
      router.refresh()
      if (onSuccess) onSuccess()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "bg-[#050505] border border-white/10 text-white placeholder:text-gray-600 shadow-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-white/50 focus-visible:border-white/50 hover:border-white/30 transition-colors"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-[#0a0a0a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-gray-400">{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          {fields.map((field) => (
            <div key={field.name} className="grid gap-2">
              <Label className="text-gray-400 text-xs uppercase tracking-wide font-medium">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              {field.type === "select" ? (
                <Select 
                  value={formData[field.name]?.toString() || ""} 
                  onValueChange={(val) => handleInputChange(field.name, val)}
                >
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
                  className={`${inputClass} ${field.readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
                  placeholder={field.placeholder}
                  value={(formData[field.name] as string | number) || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  readOnly={field.readOnly}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 bg-transparent text-gray-300 hover:bg-white/5">
            Batal
          </Button>
          
          {/* 🔥 BUTTON INTELEGEN: Mati jika loading, tidak berubah, atau tidak valid */}
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !isChanged || !isValid} 
            className={`
              border-0 font-medium transition-all
              ${(!isChanged || !isValid) ? "bg-white/10 text-gray-500 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200"}
            `}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}