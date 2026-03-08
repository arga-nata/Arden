"use client"

import * as React from "react" // Tambahkan import React
import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useLogout } from "@/hooks/use-logout"

export function NavUser({
  user,
}: {
  user: { name: string; role: string; avatar: string } // Tetap pakai role (asli)
}) {
  const { isMobile } = useSidebar()
  const { handleLogout } = useLogout()

  // 1. STATE UNTUK HYDRATION FIX
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "AU"

  // 2. SKELETON LOADING SAAT DI SERVER (Mencegah Error)
  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="opacity-50 cursor-default">
            <div className="h-8 w-8 rounded-lg bg-white/10 animate-pulse" />
            <div className="grid flex-1 gap-1.5 text-left text-sm leading-tight">
              <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
              <div className="h-2 w-16 rounded bg-white/10 animate-pulse" />
            </div>
            <ChevronsUpDown className="ml-auto size-4 opacity-30" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // 3. RENDER DATA ASLI (Sama persis dengan file aslimu)
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-(--logo-fg) font-bold text-(--logo-bg)">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-white">
                  {user.name}
                </span>
                <span className="truncate text-[10px] tracking-widest text-gray-500 font-jakarta">
                  Role {user.role}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-gray-500" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-white/10 bg-[#0a0a0a]"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-(--logo-fg) font-bold text-(--logo-bg)">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-white">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-gray-500">
                    {user.role}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-500 focus:bg-red-50/10 focus:text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}