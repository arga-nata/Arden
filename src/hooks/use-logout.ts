// src/hooks/use-logout.ts
import { useRouter } from "next/navigation"

export function useLogout() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Panggil API Logout yang baru
      await fetch('/api/auth/logout', { method: 'POST' })
      
      // Hapus sisa di browser
      const cookies = ["user_role", "auth_token", "user_name", "user_photo"]
      cookies.forEach(name => {
        document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
      })
      localStorage.clear()

      router.push("/login")
      router.refresh()
    } catch (error) {
      router.push("/login")
    }
  }

  return { handleLogout }
}