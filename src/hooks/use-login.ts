import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // 1. Logika Deteksi Perangkat (Mobile vs Desktop)
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      setIsMobile(isMobileDevice || window.innerWidth < 768)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    try {
      // 2. Kirim data ke API Internal (/api/login)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (!response.ok || result.status !== 'success') {
        throw new Error(result.message || "Username atau Password salah.");
      }

      // Pastikan data tersedia
      if (!result.data) throw new Error("Data tidak valid dari server.");

      // 3. Ambil Data dari Response Backend
      // Struktur Data: { token, id_user, role, nama_lengkap, foto_url, ... }
      const { role, nama_lengkap, foto_url, token } = result.data;

      // 4. Validasi Kesesuaian Perangkat (Security Logic)
      if (role === 'Pelaksana') {
        if (!isMobile) {
          throw new Error("Login Pelaksana wajib menggunakan Aplikasi HP (Android/iOS).");
        }
      } 
      else if (role === 'Admin' || role === 'Pemantau') {
        if (isMobile) {
          throw new Error("Fitur Manajemen wajib dibuka lewat Laptop/PC.");
        }
      }

      // 5. Simpan Session & Profil ke Cookies (Berlaku 24 Jam)
      // Menggunakan token ASLI dari backend JWT
      const cookieOptions = "path=/; max-age=86400; SameSite=Lax"; 
      
      document.cookie = `user_role=${role}; ${cookieOptions}`;
      document.cookie = `auth_token=${token}; ${cookieOptions}`; // Token JWT Asli
      document.cookie = `user_name=${nama_lengkap}; ${cookieOptions}`; // Nama Lengkap untuk UI
      document.cookie = `user_photo=${foto_url || ''}; ${cookieOptions}`; // Foto Profil

      // 6. Redirect Sesuai Wilayah Kerja
      if (role === 'Pelaksana') {
        router.push('/mobile');
      } else {
        router.push('/dashboard');
      }

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false)
    }
  }

  return { 
    username, setUsername, 
    password, setPassword, 
    showPassword, setShowPassword, 
    isLoading, errorMsg, handleLogin 
  }
}