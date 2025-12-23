import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const spaceGrotesk = localFont({
  src: "../fonts/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-space-grotesk",
  weight: "300 700",
});

const inter = localFont({
  src: [
    { path: "../fonts/Inter-VariableFont_opsz,wght.ttf", style: "normal" },
    { path: "../fonts/Inter-Italic-VariableFont_opsz,wght.ttf", style: "italic" },
  ],
  variable: "--font-inter",
  weight: "100 900",
});

const montserrat = localFont({
  src: [
    { path: "../fonts/Montserrat-VariableFont_wght.ttf", style: "normal" },
    { path: "../fonts/Montserrat-Italic-VariableFont_wght.ttf", style: "italic" },
  ],
  variable: "--font-montserrat",
  weight: "100 900",
});

const plusJakarta = localFont({
  src: [
    { path: "../fonts/PlusJakartaSans-VariableFont_wght.ttf", style: "normal" },
    { path: "../fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf", style: "italic" },
  ],
  variable: "--font-plus-jakarta",
  weight: "200 800",
});

export const metadata: Metadata = {
  title: "ARDEN",
  description: "Sistem Absensi Karakter Siswi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning sangat penting karena ekstensi browser 
    // sering mengubah atribut class/style pada tag html & body
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${montserrat.variable} ${plusJakarta.variable} font-sans antialiased bg-[#000000] text-white selection:bg-indigo-500/30`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}