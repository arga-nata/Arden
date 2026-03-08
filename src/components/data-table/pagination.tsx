"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min(startRow + pageSize - 1, totalRows)

  return (
    // REVISI LAYOUT: Flex Column di Mobile (Center), Flex Row di Desktop (Between)
    <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row sm:justify-between">
      
      {/* Text Info */}
      <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground text-center sm:text-left">
        Showing <span className="text-white">{totalRows === 0 ? 0 : startRow}</span> –{" "}
        <span className="text-white">{endRow}</span> of{" "}
        <span className="text-white">{totalRows}</span> entries
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-white/5 bg-transparent hover:bg-white/5 hover:text-white"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-white/5 bg-transparent hover:bg-white/5 hover:text-white"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="mx-2 h-4 bg-white/10" />
        
        <div className="px-2 text-xs font-bold text-white min-w-12 text-center">
          Page {pageIndex + 1}
        </div>
        
        <Separator orientation="vertical" className="mx-2 h-4 bg-white/10" />

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-white/5 bg-transparent hover:bg-white/5 hover:text-white"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-white/5 bg-transparent hover:bg-white/5 hover:text-white"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}