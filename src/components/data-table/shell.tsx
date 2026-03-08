"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DataTableShellProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  children: React.ReactNode
}

export function DataTableShell({
  title,
  description,
  children,
  className,
  ...props
}: DataTableShellProps) {
  return (
    <section
      className={cn(
        // HAPUS: shadow-2xl
        // UBAH: border static jadi transparan, muncul saat hover
        "space-y-6 rounded-2xl border border-transparent bg-[#0d0d0d]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/10",
        className
      )}
      {...props}
    >
      <header className="flex flex-col gap-1">
        <h2 className="font-plus-jakarta text-xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </header>

      <div className="relative -mx-6 overflow-x-auto">
        <div className="min-w-full px-6">
          {children}
        </div>
      </div>
    </section>
  )
}