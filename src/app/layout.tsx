// src/app/layout.tsx
import type { Metadata } from "next";
// Kita ganti ke next/font/google
import { Geist, Inter, Space_Grotesk, Montserrat, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// 1. GEIST (Default Sans)
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// 2. INTER
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// 3. SPACE GROTESK
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

// 4. MONTSERRAT
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// 5. PLUS JAKARTA
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
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