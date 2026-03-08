// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// 1. GEIST (Default Sans)
const geist = localFont({
  src: "../fonts/Geist-VariableFont_wght.ttf",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap", // Penting agar text muncul duluan
});

// 2. INTER
const inter = localFont({
  src: [
    { path: "../fonts/Inter-VariableFont_opsz,wght.ttf", style: "normal" },
    { path: "../fonts/Inter-Italic-VariableFont_opsz,wght.ttf", style: "italic" },
  ],
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

// 3. SPACE GROTESK
const spaceGrotesk = localFont({
  src: "../fonts/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-space", // Nama variabel disingkat biar gampang
  weight: "300 700",
  display: "swap",
});

// 4. MONTSERRAT
const montserrat = localFont({
  src: [
    { path: "../fonts/Montserrat-VariableFont_wght.ttf", style: "normal" },
    { path: "../fonts/Montserrat-Italic-VariableFont_wght.ttf", style: "italic" },
  ],
  variable: "--font-montserrat",
  weight: "100 900",
  display: "swap",
});

// 5. PLUS JAKARTA
const jakarta = localFont({
  src: [
    { path: "../fonts/PlusJakartaSans-VariableFont_wght.ttf", style: "normal" },
    { path: "../fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf", style: "italic" },
  ],
  variable: "--font-jakarta",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARDEN",
  description: "Sistem Absensi Karakter Siswi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        // KITA INJECT SEMUA VARIABEL FONT KE SINI
        className={`
          ${geist.variable} 
          ${inter.variable} 
          ${spaceGrotesk.variable} 
          ${montserrat.variable} 
          ${jakarta.variable}
          font-sans antialiased bg-[#000000] text-white selection:bg-indigo-500/30
        `}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}