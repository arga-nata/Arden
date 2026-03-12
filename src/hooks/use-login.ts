// src/hooks/use-login.ts
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

  // 1. Deteksi Perangkat (Desktop vs Mobile)
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
      // 2. Tembak ke URL API Auth yang baru
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const result = await response.json()

      if (!response.ok || result.status !== 'success') {
        throw new Error(result.message || "Username atau Password salah.")
      }

      const role = result.data.role

      // 3. Validasi Keamanan Perangkat
      if (role === 'Pelaksana' && !isMobile) {
        throw new Error("Login Pelaksana wajib menggunakan Aplikasi HP.")
      } 
      if ((role === 'Admin' || role === 'Pemantau') && isMobile) {
        throw new Error("Fitur Manajemen wajib dibuka lewat Laptop/PC.")
      }

      // 4. Redirect (Cookies sudah diurus Server!)
      router.push(role === 'Pelaksana' ? '/mobile' : '/dashboard')

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan sistem.")
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