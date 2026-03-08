"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTablePagination } from "./pagination"
import { DataTableToolbar } from "./toolbar"
import { DataTableShell } from "./shell"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title: string
  description?: string
  searchPlaceholder?: string
  onCreate?: () => void
  onImport?: () => void
  children?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
  searchPlaceholder,
  onCreate,
  onImport,
  children
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <DataTableShell title={title} description={description}>
      {/* CSS Manual untuk Scrollbar agar pasti muncul */}
      <style jsx global>{`
        /* Scrollbar Horizontal & Vertical */
        .custom-scrollbar::-webkit-scrollbar {
          height: 10px;
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f0f0f;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #262626;
          border-radius: 4px;
          border: 2px solid #0f0f0f;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #404040;
        }
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #262626 #0f0f0f;
        }
      `}</style>

      <DataTableToolbar 
        table={table} 
        searchPlaceholder={searchPlaceholder} 
        onCreate={onCreate}
        onImport={onImport}
      />
      
      {/* Container Tabel */}
      <div className="rounded-xl border border-white/5 bg-[#0a0a0a]/50 overflow-hidden">
        {/* Scroll Wrapper */}
        <div className="w-full overflow-x-auto custom-scrollbar pb-3">
          <Table className="w-full whitespace-nowrap"> 
            <TableHeader className="bg-white/3">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-white/5 hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as { className?: string } | undefined
                    const customClass = meta?.className || "px-6"
                    
                    return (
                      <TableHead 
                        key={header.id} 
                        className={cn(
                          "py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500",
                          customClass
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-white/5 hover:bg-white/2 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as { className?: string } | undefined
                      const customClass = meta?.className || "px-6"

                      return (
                        <TableCell key={cell.id} className={cn("py-3 text-sm", customClass)}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-48 text-center text-gray-500 font-bold uppercase text-xs tracking-widest">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination table={table} />
      
      {children}
    </DataTableShell>
  )
}