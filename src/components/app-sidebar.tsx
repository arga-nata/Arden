"use client"

import * as React from "react"
import Image from "next/image"
import {
  LayoutDashboard,
  Database,
  School,
  FileText,
  Settings2,
  BookOpen,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

// --- DATA MENU (ENGLISH VERSION) ---
const data = {
  user: {
    name: "Admin ARDEN",
    email: "admin@man-blitar.sch.id",
    avatar: "", 
  },
  Dashboard: [
    {
      title: "Home",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Classes", // Kelas -> Classes
      url: "/dashboard/class",
      icon: School,
    },
    {
      title: "Database",
      url: "/dashboard/database",
      icon: Database,
    },
    {
      title: "Recapitulation", // Rekapitulasi -> Summary (Lebih pendek & pas di UI)
      url: "/dashboard/rekapitulasi",
      icon: FileText,
    },
  ],
  system: [
    {
      title: "Settings", // Pengaturan -> Settings
      url: "/dashboard/settings",
      icon: Settings2,
    },
    {
      title: "Documentation", // Dokumentasi -> Documentation
      url: "/dashboard/docs",
      icon: BookOpen,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar  collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* LOGO: Menggunakan variabel global (Putih/Hitam) */}
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-(--logo-fg) text-(--logo-bg)">
                {/* Gunakan Image component pointing ke file di folder public */}
                <Image 
                  src="/icon.ico"  // Pastikan file icon.ico ada di folder public
                  alt="ARDEN Logo" 
                  width={32} 
                  height={32} 
                  className="size-5 object-contain" // object-contain agar gambar tidak gepeng
                />
              </div>
              <div className="text-left text-sm leading-tight">
                <span className="truncate font-bold text-gray-200">ARDEN</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Panggil NavMain dengan Label Bahasa Inggris */}
        <NavMain label="Dashboard" items={data.Dashboard} />
        <NavMain label="System" items={data.system} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}