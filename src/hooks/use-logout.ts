import { useRouter } from "next/navigation"

export function useLogout() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // 1. Panggil API Logout (Server Side Clear)
      // Ini penting agar Middleware di server tahu cookie sudah hilang
      await fetch('/api/logout', { method: 'POST' });

      // 2. Hapus Cookie di Client (Double Kill)
      // Jaga-jaga kalau ada cookie yang bandel di browser
      const cookies = ["user_role", "auth_token", "user_name", "user_photo"]
      cookies.forEach(name => {
        document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
      })
      
      // Hapus localStorage juga jika ada sisa
      localStorage.clear();

      // 3. Refresh dan Redirect
      router.push("/login")
      router.refresh() // Paksa Next.js cek ulang middleware
      
    } catch (error) {
      console.error("Logout gagal", error)
      // Tetap paksa keluar visualnya
      router.push("/login")
    }
  }

  return { handleLogout }
}