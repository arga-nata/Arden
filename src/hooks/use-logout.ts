import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function useLogout() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = () => {
    setIsLoading(true)
    // Hapus kedua cookie: role dan token
    document.cookie = "user_role=; path=/; max-age=0;"
    document.cookie = "auth_token=; path=/; max-age=0;" // Tambahkan ini

    router.replace("/login")
    router.refresh()
  }

  return {
    handleLogout,
    isLoading
  }
}