"use client"

import { useEffect, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import type { Container, ISourceOptions } from "@tsparticles/engine"

export default function ParticlesBackground() {
  const [init, setInit] = useState(false)

  // 1. Inisialisasi mesin partikel sekali saja saat komponen dimuat
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // Memuat versi "slim" agar performa tetap ringan (cocok untuk RAM 4GB)
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log("Particles container loaded", container)
  }

  const options: ISourceOptions = {
    fpsLimit: 60,
    fullScreen: { enable: false },
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
        },
      },
      color: {
        value: "#ffffff",
      },
      // FIX 1: 'stroke' sekarang berada langsung di bawah 'particles', bukan di dalam 'shape'
      stroke: {
        width: 0,
        color: "#000000",
      },
      shape: {
        type: "edge", // Bentuk Kotak
      },
      // FIX 2: 'random' sudah dihapus. Gunakan format objek { min, max } pada 'value'
      opacity: {
        value: { min: 0.1, max: 0.3 }, 
      },
      size: {
        value: { min: 1, max: 4 },
      },
      links: {
        enable: false,
      },
      move: {
        enable: true,
        speed: 3,
        direction: "bottom",
        random: false,
        straight: false,
        outModes: {
          default: "out",
        },
      },
    },
    detectRetina: true,
  };

  // 2. Hanya tampilkan partikel jika inisialisasi sudah selesai
  if (!init) return null

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      className="absolute inset-0 z-0 pointer-events-none"
      options={options}
    />
  )
}