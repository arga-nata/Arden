"use client"

import {
  CheckCircle2,
  Info,
  Loader2,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right" // Tetap di Kanan Atas
      
      toastOptions={{
        classNames: {
          toast:
            // 🔥 KUNCI MINIMALIS:
            // 1. rounded-full (Bentuk Kapsul)
            // 2. bg-black/80 + backdrop-blur (Transparan Glassy)
            // 3. items-center (Ikon & Teks sejajar tengah)
            // 4. px-6 py-3 (Padding pas, ngga kegedean)
            "group toast group-[.toaster]:bg-black/80 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl font-sans flex items-center gap-3 px-5 py-3 rounded-full w-fit ml-auto",
          
          description: "hidden", // Sembunyikan description terpisah (kita gabung aja)
          
          title: "text-[13px] font-medium text-gray-200 tracking-wide", // Teks utama kecil & rapi
          
          actionButton: "bg-white text-black text-xs px-3 py-1 rounded-full font-medium ml-4",
          cancelButton: "bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full ml-2",
        },
      }}

      // 🔥 IKON SIMPEL (Tanpa Background Aneh-aneh)
      icons={{
        success: <CheckCircle2 className="size-4 text-emerald-400" />,
        info: <Info className="size-4 text-blue-400" />,
        warning: <AlertTriangle className="size-4 text-amber-400" />,
        error: <XCircle className="size-4 text-red-400" />,
        loading: <Loader2 className="size-4 text-gray-400 animate-spin" />,
      }}

      // Override style default biar ngga kaku
      style={
        {
          "--normal-bg": "transparent",
          "--normal-border": "rgba(255,255,255,0.05)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }