"use client"

import * as React from "react"
import { useState } from "react"
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

// --- DATA MENU ---
const menuData = {
  Dashboard: [
    { title: "Home", url: "/dashboard", icon: LayoutDashboard },
    { title: "Classes", url: "/dashboard/class", icon: School },
    { title: "Database", url: "/dashboard/database", icon: Database },
    { title: "Recapitulation", url: "/dashboard/rekapitulasi", icon: FileText },
  ],
  system: [
    { title: "Settings", url: "/dashboard/settings", icon: Settings2 },
    { title: "Documentation", url: "/dashboard/docs", icon: BookOpen },
  ],
}

// Fungsi pembantu cookie
const getCookie = (name: string) => {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || "");
  return "";
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // SOLUSI ESLINT: Gunakan fungsi di dalam useState (Lazy Initializer)
  // Ini akan dijalankan tepat saat komponen dibuat di browser.
  const [userData] = useState(() => {
    // Jika di Server (SSR), gunakan data default
    if (typeof document === "undefined") {
      return { name: "User ARDEN", role: "Authenticated", avatar: "" };
    }
    
    // Jika di Browser (Client), langsung ambil dari Cookie
    return {
      name: getCookie("user_name") || "User ARDEN",
      role: getCookie("user_role") || "Authenticated",
      avatar: getCookie("user_photo") || "",
    };
  });

  // useEffect DIHAPUS agar tidak memicu cascading renders dan error ESLint.

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/10 text-black">
                <Image 
                  src="/favicon.ico" 
                  alt="ARDEN Logo" 
                  width={32} 
                  height={32} 
                  className="size-5 object-contain" 
                />
              </div>
              <div className="text-left text-sm leading-tight ml-2">
                <span className="truncate font-bold text-white tracking-tight">ARDEN</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain label="Management" items={menuData.Dashboard} />
        <NavMain label="System" items={menuData.system} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}