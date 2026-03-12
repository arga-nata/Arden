"use client"

import dynamic from "next/dynamic" // 1. Import dynamic
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft, Lock, User, Monitor, Smartphone, Eye, EyeOff, ArrowRight, AlertTriangle, Loader2
} from "lucide-react"
import { Logo } from "@/components/logo"
import { useLogin } from "@/hooks/use-login"

const VantaBackground = dynamic(() => import("@/components/vanta-background"), { ssr: false })
const ParticlesBackground = dynamic(() => import("@/components/particles"), { ssr: false })

export default function LoginPage() {

  const {
    username, setUsername,
    password, setPassword,
    showPassword, setShowPassword,
    isLoading,
    errorMsg,
    handleLogin
  } = useLogin()


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] p-4 selection:bg-indigo-500/30 relative overflow-hidden">
      
     {/* Background otomatis hanya jalan di client, aman dari Hydration & Lint Error */}
      <div className="absolute inset-0 z-0">
        <VantaBackground />
      </div>
      <div className="absolute inset-0 z-1">
        <ParticlesBackground />
      </div>

      {/* Konten Utama */}
      <div className="relative z-10 w-full max-w-187.5 min-h-112.5 grid grid-cols-1 md:grid-cols-2 bg-[#0A0A0A]/90 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-500">

        {/* --- BAGIAN KIRI (Banner) --- */}
        <div className="hidden md:flex relative flex-col justify-center p-8 bg-[#0f0f11]/50 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-950/30 via-transparent to-black z-0" />
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="mb-8 scale-110">
              <Logo />
            </div>
            <div className="w-full space-y-8">
              <p className="text-xs font-jakarta text-gray-300 font-medium text-center leading-relaxed px-2 drop-shadow-md">
                Platform usage is strictly segregated by device environment to ensure data integrity.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start p-3 rounded-lg bg-black/40 border border-white/10 hover:border-indigo-500/50 transition-colors backdrop-blur-sm">
                  <Monitor className="w-4 h-4 text-indigo-300 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[11px] font-jakarta font-bold text-indigo-100 uppercase tracking-wide">Desktop Environment</h4>
                    <p className="text-[10px] font-jakarta text-gray-400 mt-0.5 leading-tight font-medium">
                      Restricted for Dashboard & Management.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 items-start p-3 rounded-lg bg-black/40 border border-white/10 hover:border-emerald-500/50 transition-colors backdrop-blur-sm">
                  <Smartphone className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[11px] font-jakarta font-bold text-emerald-100 uppercase tracking-wide">Mobile Environment</h4>
                    <p className="text-[10px] font-jakarta text-gray-400 mt-0.5 leading-tight font-medium">
                      Optimized for Field App & QR Scanning.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- BAGIAN KANAN (Form) --- */}
        <div className="flex flex-col justify-center p-8 bg-[#0A0A0A]/90 relative">
          <div className="absolute top-4 right-4 hidden md:block z-20">
            <Link href="/"><Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white rounded-full"><ArrowLeft className="w-4 h-4" /></Button></Link>
          </div>

          <div className="w-full max-w-70 mx-auto space-y-6 relative z-10">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white font-space tracking-tight">Login Portal</h3>
              <p className="text-gray-500 text-xs font-jakarta mt-1 font-medium">Authenticate to access the ecosystem.</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-red-300 font-medium leading-tight">{errorMsg}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-jakarta uppercase font-bold text-gray-500 tracking-wider">Identity ID</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="bg-[#121212] border-white/10 h-10 pl-9 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-jakarta uppercase font-bold text-gray-500 tracking-wider">Passkey</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-[#121212] border-white/10 h-10 pl-9 pr-9 text-xs text-white tracking-widest"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12  bg-indigo-950/30 hover:bg-indigo-600 text-white font-bold text-xs rounded-lg border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                ) : (
                  <><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Authenticate Access</>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}