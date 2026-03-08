"use client"

import { useState } from "react";
import Image from "next/image";
import React from "react";
import { Icon } from "@iconify/react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

// Data Dummy Kelas
const classesData = [
  { id: 1, name: "X MIPA 1", wali: "Bapak Mulyono S.Pd.", batch: "X", total: 32 },
  { id: 2, name: "X MIPA 2", wali: "Ibu Susi S.Pd.", batch: "X", total: 31 },
  { id: 3, name: "XI MIPA 1", wali: "Bapak Budi S.Pd.", batch: "XI", total: 30 },
  { id: 4, name: "XI IPS 1", wali: "Ibu Ani S.Pd.", batch: "XI", total: 29 },
  { id: 5, name: "XII MIPA 1", wali: "Bapak Joko S.Pd.", batch: "XII", total: 34 },
  { id: 6, name: "XII MIPA 2", wali: "Ibu Rina S.Pd.", batch: "XII", total: 33 },
  { id: 7, name: "XII IPS 1", wali: "Bapak Tono S.Pd.", batch: "XII", total: 32 },
  { id: 8, name: "XII IPS 2", wali: "Ibu Sari S.Pd.", batch: "XII", total: 31 },
  // Tambahan 15 Data Baru
  { id: 9, name: "X MIPA 3", wali: "Bapak Ahmad S.Pd.", batch: "X", total: 32 },
  { id: 10, name: "X IPS 1", wali: "Ibu Linda S.Pd.", batch: "X", total: 30 },
  { id: 11, name: "X IPS 2", wali: "Bapak Eko S.Pd.", batch: "X", total: 31 },
  { id: 12, name: "X IPS 3", wali: "Ibu Maya S.Pd.", batch: "X", total: 28 },
  { id: 13, name: "XI MIPA 2", wali: "Bapak Gunawan S.Pd.", batch: "XI", total: 33 },
  { id: 14, name: "XI MIPA 3", wali: "Ibu Dewi S.Pd.", batch: "XI", total: 32 },
  { id: 15, name: "XI IPS 2", wali: "Bapak Rahman S.Pd.", batch: "XI", total: 30 },
  { id: 16, name: "XI IPS 3", wali: "Ibu Siti S.Pd.", batch: "XI", total: 29 },
  { id: 17, name: "XII MIPA 3", wali: "Bapak Yusuf S.Pd.", batch: "XII", total: 35 },
  { id: 18, name: "XII IPS 3", wali: "Ibu Mega S.Pd.", batch: "XII", total: 31 },
  { id: 19, name: "XII IPS 4", wali: "Bapak Andi S.Pd.", batch: "XII", total: 30 },
  { id: 20, name: "X MIPA 4", wali: "Ibu Ratna S.Pd.", batch: "X", total: 32 },
  { id: 21, name: "XI MIPA 4", wali: "Bapak Surya S.Pd.", batch: "XI", total: 31 },
  { id: 22, name: "XII MIPA 4", wali: "Ibu Lilis S.Pd.", batch: "XII", total: 33 },
  { id: 23, name: "XII IPS 5", wali: "Bapak Farhan S.Pd.", batch: "XII", total: 29 },
];

export default function ClassPage() {
  const [keyword, setKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Handler Sinkron untuk Filter (Menghindari Cascading Render)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const filteredClasses = classesData.filter((kelas) => {
    const matchTab = activeTab === "all" ? true : kelas.batch === activeTab;
    const matchSearch =
      kelas.name.toLowerCase().includes(keyword.toLowerCase()) ||
      kelas.wali.toLowerCase().includes(keyword.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col h-full min-h-screen bg-background selection:bg-primary/20">
      <header className="px-8 pt-10 pb-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">
              Class Management
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Pantau dan kelola data kelas beserta wali kelas ARDEN secara terpusat.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="bg-card border border-border h-11">
                <TabsTrigger value="all" className="font-bold px-4">ALL</TabsTrigger>
                <TabsTrigger value="X" className="font-bold px-4">X</TabsTrigger>
                <TabsTrigger value="XI" className="font-bold px-4">XI</TabsTrigger>
                <TabsTrigger value="XII" className="font-bold px-4">XII</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-64">
              <Icon icon="ph:magnifying-glass-bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari kelas..."
                className="pl-10 h-11 bg-card border-border"
                value={keyword}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-linear-to-r from-border via-border to-transparent" />
      </header>

      {/* --- GRID CLASS CARDS (Layout yang Anda inginkan) --- */}
      <main className="container mx-auto p-8 lg:p-10">
        {paginatedClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedClasses.map((kelas) => (
              <div
                key={kelas.id}
                className="group bg-card border border-border rounded-xl p-4 flex flex-col gap-4 transition-all hover:border-primary/40 shadow-sm"
              >
                {/* Banner di dalam Card menggunakan bg-banner.jpeg */}
                <div className="relative w-full h-20 overflow-hidden rounded-lg">
                  <Image
                    src="/bg-banner.jpeg"
                    alt="Class Banner"
                    fill
                    className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Info Kelas */}
                <div>
                  <h3 className="font-bold text-[16px] text-foreground uppercase tracking-tight leading-none mb-1">
                    {kelas.name}
                  </h3>
                  <p className="text-[14px] text-muted-foreground truncate font-medium">
                    {kelas.wali}
                  </p>
                </div>

                {/* Tombol Action */}
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1 h-10 bg-white text-black hover:bg-white/90 font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <Icon icon="ph:arrow-square-out-bold" width={18} className="mr-2" />
                    Masuk
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 border-border bg-background/50 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all active:scale-95"
                    onClick={() => setIsQRModalOpen(true)}
                  >
                    <Icon icon="ph:qr-code-bold" width={20} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center opacity-30">
            <Icon icon="ph:magnifying-glass-minus-bold" width={64} />
            <p className="mt-4 font-bold tracking-widest uppercase text-xs text-center">Kelas tidak ditemukan</p>
          </div>
        )}

        {/* --- PAGINATION (CLEAN & AESTHETIC) --- */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center pb-10">
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="bg-card border border-border rounded-full p-1 shadow-sm">

                {/* Tombol Sebelumnya */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={cn(
                      "h-9 w-9 md:w-auto md:px-4 rounded-full border-none transition-colors",
                      currentPage === 1
                        ? "pointer-events-none opacity-20"
                        : "hover:bg-primary/10 hover:text-primary"
                    )}
                  />
                </PaginationItem>

                {/* Daftar Angka Halaman */}
                <div className="flex items-center gap-1 px-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === pageNumber}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNumber);
                          }}
                          className={cn(
                            "h-9 w-9 font-bold text-xs rounded-full border-none transition-all",
                            currentPage === pageNumber
                              ? "bg-primary text-background hover:bg-primary/90 shadow-md scale-105"
                              : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          )}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                </div>

                {/* Tombol Selanjutnya */}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={cn(
                      "h-9 w-9 md:w-auto md:px-4 rounded-full border-none transition-colors",
                      currentPage === totalPages
                        ? "pointer-events-none opacity-20"
                        : "hover:bg-primary/10 hover:text-primary"
                    )}
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>
          </div>
        )}

      </main>

      {/* --- QR MODAL --- */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-2xl border-border sm:max-w-xs p-0 overflow-hidden rounded-4xl shadow-2xl">
          <div className="p-8 flex flex-col items-center gap-6 text-center">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tighter uppercase leading-none">Class QR</DialogTitle>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Absensi Kolektif</p>
            </div>

            <div className="relative p-6 bg-white rounded-4xl">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-75 animate-pulse" />
              <div className="relative w-40 h-40">
                <Icon icon="ic:baseline-qr-code-2" width="100%" height="100%" className="text-black" />
              </div>
            </div>

            <p className="text-[11px] font-bold text-muted-foreground/60 leading-relaxed px-6 italic">
              &quot;Gunakan pemindai mobile ARDEN untuk memproses kehadiran seluruh siswi secara otomatis.&quot;
            </p>

            <Button className="w-full rounded-xl h-12 font-black tracking-widest text-[10px]" variant="secondary">
              GENERATE NEW CODE
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}