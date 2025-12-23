import { ApiResponse, LoginData } from '@/types/api';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [isMobile, setIsMobile] = useState(false)

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
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result: ApiResponse<LoginData> = await response.json();

      if (!response.ok || result.status === 'fail') {
        throw new Error(result.message || "Username atau Password salah.");
      }

      const userData = result.data;
      if (!userData) throw new Error("Data tidak valid.");

      const { role, token } = userData;

      // --- LOGIKA PERANGKAT (REVISED & NOT REVERSED) ---
      
      // 1. Jika Role adalah Pelaksana, WAJIB Mobile
      if (role === 'Pelaksana') {
        if (!isMobile) {
          throw new Error("Login Pelaksana wajib menggunakan Aplikasi HP (Android/iOS).");
        }
      } 
      // 2. Jika Role adalah Admin/Pemantau, WAJIB Desktop
      else if (role === 'Admin' || role === 'Pemantau') {
        if (isMobile) {
          throw new Error("Fitur Manajemen wajib dibuka lewat Laptop/PC.");
        }
      }

      // Jika lolos validasi device, simpan session
      document.cookie = `user_role=${role}; path=/; max-age=86400`;
      document.cookie = `auth_token=${token}; path=/; max-age=86400`;

      // Redirect sesuai wilayah kerja
      if (role === 'Pelaksana') {
        router.push('/app/home');
      } else {
        router.push('/dashboard');
      }

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false)
    }
  }

  return { username, setUsername, password, setPassword, showPassword, setShowPassword, isLoading, errorMsg, handleLogin }
}