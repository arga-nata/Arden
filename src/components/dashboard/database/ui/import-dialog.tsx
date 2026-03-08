"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { FileSpreadsheet, Download, UploadCloud, Loader2, Database, Eye, Pencil, Check, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"

// Helper: Title Case
const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

export function ImportDialog({
  open,
  onOpenChangeAction
}: {
  open: boolean,
  onOpenChangeAction: (v: boolean) => void
}) {
  const [activeTab, setActiveTab] = useState("excel")
  const [file, setFile] = useState<File | null>(null)
  const [jsonData, setJsonData] = useState<Record<string, unknown>[]>([])

  // SQL State
  const [sqlMode, setSqlMode] = useState<"edit" | "preview">("edit")

  // ✅ FIX: Definisi placeholderSql ditambahkan kembali
  const placeholderSql = "-- Paste your SQL INSERT statement here..."

  const simpleTemplateSql = `INSERT INTO tbl_siswi (nama_lengkap, nis, nama_kelas) VALUES
('Siti Aminah', '12345', 'X MIPA 1'),
('Dewi Sartika', '67890', 'XI IPS 2');`

  const [sqlCode, setSqlCode] = useState("")

  // State Status
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Reset state saat dialog dibuka/tutup
  useEffect(() => {
    if (!open) {
      resetState()
    }
  }, [open])

  const resetState = () => {
    setFile(null)
    setJsonData([])
    setSqlCode("")
    setSqlMode("edit")
    setIsSuccess(false)
    setProgress(0)
    setErrorMsg(null)
  }

  // Animasi Progress Bar
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (loading) {
      setProgress(10)
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 5 : prev))
      }, 200)
    }
    return () => clearInterval(interval)
  }, [loading])

  // ✅ FIX: Dependency array useEffect diperbaiki
  // Cukup panggil setErrorMsg(null) tanpa membaca errorMsg untuk menghindari dependency cycle/warning
  useEffect(() => {
    setErrorMsg(null)
  }, [sqlCode, file, activeTab])

  // 1. Download Template Excel
  const handleDownloadTemplate = () => {
    const templateData = [
      { "NIS": "12345", "Nama Lengkap": "Siti Aminah", "Nama Kelas": "X MIPA 1" },
      { "NIS": "67890", "Nama Lengkap": "Dewi Sartika", "Nama Kelas": "XI IPS 2" },
    ]
    const classRefData = [
      { "Daftar Kelas Tersedia": "X MIPA 1" },
      { "Daftar Kelas Tersedia": "X MIPA 2" },
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(templateData), "Input Data Siswi")
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(classRefData), "Referensi Kelas")
    XLSX.writeFile(wb, "Template_Siswi_Putri.xlsx")
  }

  // 2. Handle File Excel
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null)
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        if (typeof bstr !== "string") throw new Error("Gagal membaca file")
        const wb = XLSX.read(bstr, { type: "binary" })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(ws) as Record<string, unknown>[]

        if (data.length === 0) throw new Error("File Excel kosong!")

        const headers = Object.keys(data[0])
        if (!headers.includes("Nama Lengkap") || !headers.includes("NIS")) {
          throw new Error("Format header salah! Pastikan ada kolom 'Nama Lengkap' dan 'NIS'.")
        }

        const formattedData = data.map(item => ({
          ...item,
          'Nama Lengkap': toTitleCase(String(item['Nama Lengkap'] || ''))
        }))
        setJsonData(formattedData)
        toast.info(`${data.length} data siap.`)

        // ✅ FIX: Ganti 'any' dengan 'unknown'
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal membaca file"
        setErrorMsg(msg)
        setFile(null)
      }
    }
    reader.readAsBinaryString(selectedFile)
  }

  // 🔥 3. PARSE SQL (VERSI FINAL & SUDAH DIPERBAIKI)
  const parseSqlToJson = (sql: string) => {
    if (!sql.trim()) throw new Error("Kode SQL masih kosong.")

    // Validasi dasar
    if (!sql.toUpperCase().includes("INSERT INTO")) throw new Error("Sintaks harus mengandung 'INSERT INTO tbl_siswi...'")
    if (!sql.toUpperCase().includes("VALUES")) throw new Error("Sintaks harus mengandung 'VALUES'")

    // 🔥 FIX: Ambil hanya bagian SETELAH kata "VALUES"
    // Supaya header kolom (nama, nis, kelas) tidak ikut terbaca sebagai data
    const parts = sql.split(/VALUES/i)
    if (parts.length < 2) throw new Error("Format SQL salah. Pastikan ada 'VALUES'.")

    const valuesOnly = parts[1] // Ini isinya cuma ('Andi', ...), ('Budi', ...)

    // Regex ambil isi kurung
    const regex = /\(([^)]+)\)/g
    const matches = valuesOnly.match(regex)

    if (!matches || matches.length === 0) throw new Error("Tidak ada data values yang ditemukan. Gunakan format ('Nama', 'NIS', 'Kelas').")

    return matches.map((match, index) => {
      const content = match.slice(1, -1) // Hapus kurung ( dan )

      // Split koma, tapi hati-hati kalau ada koma dalam tanda kutip (Advanced Split)
      // Tapi untuk simplicity kita pakai split biasa dulu dengan asumsi tidak ada koma di dalam Nama
      const rowParts = content.split(",").map(s => s.trim().replace(/^'|'$/g, "")) // Hapus kutip '

      // Validasi jumlah kolom (Minimal Nama & NIS)
      if (rowParts.length < 2) throw new Error(`Data tidak lengkap di baris ke-${index + 1}. Minimal Nama dan NIS.`)

      return {
        'Nama Lengkap': toTitleCase(rowParts[0] || ""),
        'NIS': rowParts[1] || "",
        'Nama Kelas': rowParts[2] || "" // Mengambil data ketiga sebagai kelas
      }
    })
  }

  // 4. Handle Import Action
  const handleImport = async () => {
    setLoading(true)
    setErrorMsg(null)
    setIsSuccess(false)

    try {
      let payload: Record<string, unknown>[] = []

      if (activeTab === "excel") {
        if (jsonData.length === 0) throw new Error("Belum ada file yang dipilih atau file kosong.")
        payload = jsonData
      } else {
        payload = parseSqlToJson(sqlCode)
      }

      const res = await fetch("/api/siswi/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok || json.status === 'fail') throw new Error(json.message || "Gagal import dari server.")

      setProgress(100)
      setIsSuccess(true)
      toast.success(`Sukses! ${json.count} siswi berhasil ditambahkan.`)

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem"
      setErrorMsg(msg)
      setLoading(false)
      setProgress(0)
    }
  }

  const toggleSqlMode = () => {
    if (sqlMode === 'edit') {
      if (!sqlCode.trim()) setSqlCode(simpleTemplateSql)
      setSqlMode('preview')
    } else {
      setSqlMode('edit')
    }
  }

  // Logic Disable Button
  const isImportDisabled =
    loading ||
    (activeTab === 'excel' && !file) ||
    (activeTab === 'sql' && (!sqlCode.trim() || sqlMode === 'preview'))

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!loading) onOpenChangeAction(v) }}>
      <DialogContent className="sm:max-w-xl bg-[#0a0a0a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Import Data Siswi</DialogTitle>
          <DialogDescription className="text-gray-400">
            Import massal menggunakan Excel atau Query SQL sederhana.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="excel" onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/5">
            <TabsTrigger value="excel" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Excel Import</TabsTrigger>
            <TabsTrigger value="sql" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">SQL Import</TabsTrigger>
          </TabsList>

          {/* TAB EXCEL */}
          <TabsContent value="excel" className="mt-4 space-y-4">
             <div className="flex items-center justify-between p-3 border border-indigo-500/20 bg-indigo-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-full">
                    <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-white">Format Data</p>
                    <p className="text-xs text-gray-400">Unduh template Excel (Khusus Perempuan)</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={handleDownloadTemplate} className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:text-white">
                  <Download className="w-4 h-4 mr-2" /> Template
                </Button>
             </div>

             <div className="relative group">
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  disabled={loading || isSuccess} 
                />
                
                <div className={`h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200
                  ${file ? 'border-emerald-500/50' : 'border-white/10 hover:bg-white/5 hover:border-white/20'}
                `}>
                   {file ? (
                     <div className="flex flex-col items-center gap-1 animate-in zoom-in-50 duration-300">
                        {/* 1. IKON EXCEL (HIJAU) */}
                        <div className="p-3 bg-emerald-500/10 rounded-full mb-1">
                           <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
                        </div>
                        
                        {/* 2. NAMA FILE (URUTAN PIRAMIDA: BESAR) */}
                        <span className="text-sm font-semibold text-emerald-400 max-w-[250px] truncate">
                          {file.name}
                        </span>

                        {/* 3. JUMLAH DATA (URUTAN PIRAMIDA: SEDANG) */}
                        <span className="text-xs text-gray-400">
                          {jsonData.length} baris data siap
                        </span>
                        
                        {/* 4. INSTRUKSI GANTI (URUTAN PIRAMIDA: KECIL) */}
                        <span className="text-[10px] text-gray-600 italic mt-2">
                          (Klik untuk mengganti file)
                        </span>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-white/5 rounded-full group-hover:bg-indigo-500/10 transition-colors">
                           <UploadCloud className="w-8 h-8 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400 group-hover:text-gray-300 font-medium">
                            Klik atau drag file Excel di sini
                          </p>
                          <p className="text-xs text-gray-600">
                            Format: .xlsx, .xls, .csv
                          </p>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </TabsContent>

          {/* TAB SQL */}
          <TabsContent value="sql" className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-3 border border-indigo-500/20 bg-indigo-500/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-full">
                  <Database className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-white">SQL Query</p>
                  <p className="text-xs text-gray-400">Format: (Nama, NIS, Nama Kelas)</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={toggleSqlMode} disabled={loading || isSuccess} className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:text-white">
                {sqlMode === 'edit' ? <><Eye className="w-4 h-4 mr-2" /> Preview</> : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
              </Button>
            </div>

            <div className="relative group h-40">
              {sqlMode === 'edit' ? (
                <textarea
                  className="w-full h-full bg-[#050505] border border-white/10 rounded-lg p-4 text-xs font-mono text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent placeholder:text-gray-600"
                  value={sqlCode}
                  onChange={(e) => setSqlCode(e.target.value)}
                  placeholder={placeholderSql}
                  spellCheck={false}
                  disabled={loading || isSuccess}
                />
              ) : (
                <div className="w-full h-full bg-[#050505] border border-white/10 rounded-lg p-4 relative overflow-hidden group/code">
                  <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap overflow-y-auto h-full scrollbar-thin scrollbar-thumb-white/10">{sqlCode}</pre>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4 bg-white/10" />

        <DialogFooter className="flex items-center justify-between w-full gap-4">
          {/* LEFT SIDE: PROGRESS BAR / ERROR MESSAGE */}
          <div className="flex-1 h-full flex items-center overflow-hidden">
            {loading ? (
              <div className="w-full space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold"><span>Processing...</span><span>{progress}%</span></div>
                <Progress value={progress} className="h-2 bg-white/10" />
              </div>
            ) : errorMsg ? (
              // 🔥 Tampilan Error (FIXED: Teks bisa turun ke bawah)
              <div className="flex items-start gap-2 text-red-400 bg-red-500/10 px-3 py-2 rounded-md border border-red-500/20 w-full animate-in fade-in slide-in-from-bottom-1">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {/* Tambah mt-0.5 biar icon sejajar baris pertama */}
                <span className="text-xs font-medium wrap-break-word whitespace-normal text-left leading-tight">
                  {errorMsg}
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-600 italic">Ready to import</span>
            )}
          </div>

          {/* RIGHT SIDE: BUTTONS */}
          <div className="flex gap-2">
            {!isSuccess && (
              <Button variant="outline" onClick={() => onOpenChangeAction(false)} className="border-white/10 bg-transparent hover:bg-white/5 text-gray-300" disabled={loading}>
                Batal
              </Button>
            )}

            {isSuccess ? (
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]" onClick={() => window.location.reload()}>
                <Check className="w-4 h-4 mr-2" /> Selesai
              </Button>
            ) : (
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                onClick={handleImport}
                disabled={isImportDisabled}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {loading ? 'Mengimport...' : 'Import Data'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}