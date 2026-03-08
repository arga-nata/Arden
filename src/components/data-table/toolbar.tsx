"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, SlidersHorizontal, Upload } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
  onCreate?: () => void
  onImport?: () => void
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  onCreate,
  onImport,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-2 pb-5">
      {/* ===== SEARCH (Flexible Width) ===== */}
      <div className="relative flex-1 sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="h-10 pl-10 bg-[#0a0a0a] border-white/5 text-white rounded-lg shadow-none focus-visible:ring-0 focus-visible:border-indigo-500 hover:border-white/20 transition-colors"
        />
      </div>

      {/* ===== ACTIONS (Icons on Mobile, Text on Desktop) ===== */}
      <div className="flex items-center gap-2">
        {/* Column Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              // Mobile: w-10 p-0 (kotak ikon), Desktop: w-auto px-3 (normal)
              className="h-10 w-10 p-0 sm:w-auto sm:px-3 gap-2 border-white/5 bg-transparent"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#0a0a0a] border-white/10 text-white">
            {table.getAllColumns().filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id.replace(/_/g, " ")}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Import Button */}
        {onImport && (
          <Button
            variant="outline"
            onClick={onImport}
            className="h-10 w-10 p-0 sm:w-auto sm:px-3 gap-2 border-white/5 bg-transparent"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </Button>
        )}

        {/* New Button */}
        {onCreate && (
          <Button
            onClick={onCreate}
            className="h-10 w-10 p-0 sm:w-auto sm:px-3 gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New</span>
          </Button>
        )}
      </div>
    </div>
  )
}