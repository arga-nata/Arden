//src/components/mobile/features/AbsensiForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { AbsensiStatus, Sholat, NewAbsensiPayload } from '@/types/api';

const formSchema = z.object({
  status: z.enum(['Haid', 'Sholat']),
  keterangan: z.string().min(1, 'Wajib memilih keterangan'),
});

interface AbsensiFormProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  dataSiswi: AbsensiStatus | undefined; // Pakai type AbsensiStatus agar kompatibel dengan ManualResult
  setSuccessPopup: (value: boolean) => void; // Trigger popup sukses
  sholat: Sholat;
}

export function AbsensiForm({
  isOpen, setIsOpen, dataSiswi, setSuccessPopup, sholat
}: AbsensiFormProps) {
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
        status: 'Haid', 
        keterangan: '' 
    },
  });

  if (!dataSiswi) return null;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Mapping waktu sholat
    const waktuMap: Record<string, string> = { 'Dhuhr': 'zhuhur', 'Asr': 'ashar' };
    const waktuFix = waktuMap[sholat];

    if (!waktuFix) {
        toast.error('Waktu sholat tidak valid');
        return;
    }

    // Logic Payload Baru
    const payload: NewAbsensiPayload = {
        id_siswi: Number(dataSiswi.id),
        tanggal: new Date(),
        waktu: waktuFix,
        status: values.status,     // Haid / Sholat
        metode: 'MANUAL',          // Hardcode Manual
        keterangan: values.keterangan, // Alasan
        waktu_input: new Date()
    };

    try {
        const res = await fetch('/api/absensi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dtnew: payload })
        });
        const json = await res.json();

        setIsOpen(false); // Tutup Form Input
        form.reset();

        if (json.status === 'success') {
            setSuccessPopup(true); // Buka Popup Sukses (NotifAbsen)
        } else {
            toast.error(json.message || "Gagal menyimpan data");
        }

    } catch (error) {
        console.error(error);
        toast.error('Gagal mengirim data');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-[90%] rounded-[16px] bg-[#151419] border-[#27272A] text-white p-6">
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Icon icon="mdi:clipboard-text-outline" width={24} className="text-white/70" /> 
            Konfirmasi Manual
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            {/* 1. Readonly Inputs (Placeholder Otomatis) */}
            <div className="bg-[#1F1E23] p-4 rounded-xl border border-white/5 space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Nama Lengkap</label>
                    <div className="font-medium text-white text-base truncate">{dataSiswi.nama_lengkap}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold">NIS</label>
                        <div className="font-mono text-white/80 text-sm">{dataSiswi.nis}</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Kelas</label>
                        <div className="text-white/80 text-sm">{dataSiswi.kelas}</div>
                    </div>
                </div>
            </div>

            {/* 2. Status Radio Group */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold">Status Kehadiran</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-3"
                    >
                      {/* Item HAID */}
                      <FormItem className="flex items-center justify-center space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Haid" id="r-haid" className="peer sr-only" />
                        </FormControl>
                        <label
                          htmlFor="r-haid"
                          className="flex flex-col items-center justify-center w-full p-3 rounded-xl border border-white/10 bg-[#1F1E23] peer-data-[state=checked]:border-red-500/50 peer-data-[state=checked]:bg-red-500/10 transition-all cursor-pointer hover:bg-white/5"
                        >
                          <Icon icon="mdi:blood-drop" width={24} className="mb-1 text-red-400" />
                          <span className="text-xs font-medium text-white/80">Haid</span>
                        </label>
                      </FormItem>

                      {/* Item SHOLAT */}
                      <FormItem className="flex items-center justify-center space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Sholat" id="r-sholat" className="peer sr-only" />
                        </FormControl>
                        <label
                          htmlFor="r-sholat"
                          className="flex flex-col items-center justify-center w-full p-3 rounded-xl border border-white/10 bg-[#1F1E23] peer-data-[state=checked]:border-green-500/50 peer-data-[state=checked]:bg-green-500/10 transition-all cursor-pointer hover:bg-white/5"
                        >
                          <Icon icon="mdi:praying-hands" width={24} className="mb-1 text-green-400" />
                          <span className="text-xs font-medium text-white/80">Sholat (Suci)</span>
                        </label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 3. Keterangan Select */}
            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Keterangan / Alasan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#1F1E23] border-white/10 text-white h-12 rounded-xl">
                        <SelectValue placeholder="Pilih alasan manual..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1F1E23] border-[#3F3F3F] text-white">
                      <SelectItem value="Lupa Bawa Kartu">Lupa Bawa Kartu</SelectItem>
                      <SelectItem value="Kartu Hilang">Kartu Hilang</SelectItem>
                      <SelectItem value="Kartu Rusak">Kartu Rusak</SelectItem>
                      <SelectItem value="Sakit">Sakit (UKS/Rumah)</SelectItem>
                      <SelectItem value="Dispen/Izin">Dispen / Izin Pulang</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons: Ulangi & Proses */}
            <div className="flex gap-3 pt-2">
                <AlertDialogCancel className="flex-1 bg-transparent border border-white/10 text-white hover:bg-white/5 hover:text-white rounded-xl h-12 mt-0">
                    Ulangi
                </AlertDialogCancel>
                <Button type="submit" className="flex-1 bg-white text-black hover:bg-gray-200 font-bold rounded-xl h-12">
                    Proses
                </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}