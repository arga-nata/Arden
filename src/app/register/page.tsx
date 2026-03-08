"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    username: "",
    password: "",
    role: "Admin" // Default Admin karena ini buat akun pertama
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.message || "Gagal mendaftar")
      }

      toast.success("Akun berhasil dibuat! Silakan login.")
      router.push("/login") // Pastikan arahkan ke halaman login
      
    } catch (error: unknown) { // UBAH DISINI: 'any' jadi 'unknown'
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat mendaftar";
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4 text-white">
      <Card className="w-full max-w-md border-white/10 bg-[#0d0d0d] text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">System Setup</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Buat akun Admin pertama untuk sistem ini.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
              <Input 
                id="nama_lengkap" 
                name="nama_lengkap" 
                placeholder="Ex: Super Admin" 
                className="bg-[#1a1a1a] border-white/10"
                required
                onChange={handleChange}
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                name="username" 
                placeholder="Ex: admin" 
                className="bg-[#1a1a1a] border-white/10"
                required
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="******" 
                className="bg-[#1a1a1a] border-white/10"
                required
                onChange={handleChange}
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Role Access</Label>
              <Select 
                defaultValue="Admin" 
                onValueChange={(val) => setFormData({...formData, role: val})}
              >
                <SelectTrigger className="bg-[#1a1a1a] border-white/10">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                  <SelectItem value="Admin">Admin (Full Access)</SelectItem>
                  <SelectItem value="Pemantau">Pemantau</SelectItem>
                  <SelectItem value="Pelaksana">Pelaksana</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-gray-500">
                *Pilih Admin untuk akun pertama.
              </p>
            </div>

          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create First Account
            </Button>
            
            <p className="text-xs text-center text-gray-500">
              Sudah punya akun? <Link href="/login" className="text-indigo-400 hover:underline">Login disini</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}