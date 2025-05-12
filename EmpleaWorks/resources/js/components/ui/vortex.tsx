"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { createNoise3D } from "simplex-noise"
import { motion } from "motion/react"
import { useAppearance } from "@/hooks/use-appearance"

interface VortexProps {
  children?: any
  className?: string
  containerClassName?: string
  particleCount?: number
  rangeY?: number
  baseSpeed?: number
  rangeSpeed?: number
  baseRadius?: number
  rangeRadius?: number
  backgroundColor?: string
  particleOpacity?: number
  contrastMode?: "auto" | "light" | "dark"
  preserveBackground?: boolean
  autoTheme?: boolean
}

export const Vortex = (props: VortexProps) => {
  const { appearance } = useAppearance()
  const [themeBackground, setThemeBackground] = useState<string>("")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const particleCount = props.particleCount || 700
  const particlePropCount = 9
  const particlePropsLength = particleCount * particlePropCount
  const rangeY = props.rangeY || 800
  const baseTTL = 50
  const rangeTTL = 150
  // Velocidad reducida
  const baseSpeed = props.baseSpeed || 0.05
  const rangeSpeed = props.rangeSpeed || 0.4
  const baseRadius = props.baseRadius || 1.5
  const rangeRadius = props.rangeRadius || 2.5
  const noiseSteps = 3
  const xOff = 0.00125
  const yOff = 0.00125
  // Reducir el valor de zOff para un movimiento más suave
  const zOff = 0.0003
  const autoTheme = props.autoTheme !== false // Por defecto true

  // Determinar el color de fondo basado en el tema
  useEffect(() => {
    if (autoTheme) {
      // Verificar si el tema es dark
      const isDarkTheme =
        appearance === "dark" ||
        (appearance === "system" &&
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)

      setThemeBackground(isDarkTheme ? "#000000" : "#FEFBF2")
    }
  }, [appearance, autoTheme])

  // Usar el color de fondo proporcionado o el basado en el tema
  const backgroundColor = props.backgroundColor || themeBackground || "#000000"

  const particleOpacity = props.particleOpacity || 1.0
  const contrastMode = props.contrastMode || "auto"
  const preserveBackground = props.preserveBackground !== false // Por defecto true

  // Colores de la paleta púrpura
  const primaryColor = "#7c28eb"
  const secondaryColor = "#6620c5"
  const tertiaryColor = "#9645f4"

  let tick = 0
  const noise3D = createNoise3D()
  let particleProps = new Float32Array(particlePropsLength)
  const center: [number, number] = [0, 0]

  const HALF_PI: number = 0.5 * Math.PI
  const TAU: number = 2 * Math.PI
  const TO_RAD: number = Math.PI / 180
  const rand = (n: number): number => n * Math.random()
  const randRange = (n: number): number => n - rand(2 * n)
  const fadeInOut = (t: number, m: number): number => {
    const hm = 0.5 * m
    return Math.abs(((t + hm) % m) - hm) / hm
  }
  const lerp = (n1: number, n2: number, speed: number): number => (1 - speed) * n1 + speed * n2

  const isLightBackground = (color: string) => {
    // Handle named colors
    if (color === "white" || color === "light") return true
    if (color === "black" || color === "dark") return false

    // Handle hex colors
    if (color.startsWith("#")) {
      const hex = color.replace("#", "")
      const r = Number.parseInt(hex.substring(0, 2), 16) || 0
      const g = Number.parseInt(hex.substring(2, 4), 16) || 0
      const b = Number.parseInt(hex.substring(4, 6), 16) || 0

      // Calculate perceived brightness using the formula:
      // (0.299*R + 0.587*G + 0.114*B)
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      return brightness > 0.5
    }

    // Handle rgb/rgba colors
    if (color.startsWith("rgb")) {
      const values = color.match(/\d+/g)
      if (values && values.length >= 3) {
        const r = Number.parseInt(values[0])
        const g = Number.parseInt(values[1])
        const b = Number.parseInt(values[2])
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        return brightness > 0.5
      }
    }

    return false
  }

  // Determine if we should use light or dark mode for particles
  const shouldUseDarkParticles = () => {
    if (contrastMode === "light") return false
    if (contrastMode === "dark") return true
    return isLightBackground(backgroundColor)
  }

  const setup = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (canvas && container) {
      const ctx = canvas.getContext("2d")

      if (ctx) {
        resize(canvas, ctx)
        initParticles()

        // Aplicar el color de fondo al contenedor directamente
        if (preserveBackground && container) {
          container.style.backgroundColor = backgroundColor
        }

        draw(canvas, ctx)
      }
    }
  }

  const initParticles = () => {
    tick = 0
    particleProps = new Float32Array(particlePropsLength)

    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i)
    }
  }

  const initParticle = (i: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    let x, y, vx, vy, life, ttl, speed, radius, colorIndex

    // Distribuir partículas por toda la pantalla
    x = rand(canvas.width)
    y = rand(canvas.height)
    vx = 0
    vy = 0
    life = 0
    ttl = baseTTL + rand(rangeTTL)
    speed = baseSpeed + rand(rangeSpeed)
    radius = baseRadius + rand(rangeRadius)

    // 0 = primary, 1 = secondary, 2 = tertiary
    colorIndex = Math.floor(rand(3))

    particleProps.set([x, y, vx, vy, life, ttl, speed, radius, colorIndex], i)
  }

  const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    tick++

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!preserveBackground) {
      // Si no preservamos el fondo en el contenedor, lo dibujamos en el canvas
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    drawParticles(ctx)
    renderGlow(canvas, ctx)
    renderToScreen(canvas, ctx)

    window.requestAnimationFrame(() => draw(canvas, ctx))
  }

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx)
    }
  }

  const updateParticle = (i: number, ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i,
      i9 = 8 + i
    let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, colorIndex

    x = particleProps[i]
    y = particleProps[i2]
    n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU
    vx = lerp(particleProps[i3], Math.cos(n), 0.5)
    vy = lerp(particleProps[i4], Math.sin(n), 0.5)
    life = particleProps[i5]
    ttl = particleProps[i6]
    speed = particleProps[i7]
    x2 = x + vx * speed
    y2 = y + vy * speed
    radius = particleProps[i8]
    colorIndex = particleProps[i9]

    drawParticle(x, y, x2, y2, life, ttl, radius, colorIndex, ctx)

    life++

    particleProps[i] = x2
    particleProps[i2] = y2
    particleProps[i3] = vx
    particleProps[i4] = vy
    particleProps[i5] = life
    ;(checkBounds(x, y, canvas) || life > ttl) && initParticle(i)
  }

  const drawParticle = (
    x: number,
    y: number,
    x2: number,
    y2: number,
    life: number,
    ttl: number,
    radius: number,
    colorIndex: number,
    ctx: CanvasRenderingContext2D,
  ) => {
    ctx.save()
    ctx.lineCap = "round"
    ctx.lineWidth = radius

    const useDarkParticles = shouldUseDarkParticles()
    const opacity = fadeInOut(life, ttl) * particleOpacity

    // Seleccionar color basado en el índice
    let color
    if (colorIndex === 0) {
      color = primaryColor
    } else if (colorIndex === 1) {
      color = secondaryColor
    } else {
      color = tertiaryColor
    }

    // Corregir el formato de color para que funcione correctamente
    if (useDarkParticles) {
      // Para fondos claros
      ctx.strokeStyle = color
      ctx.globalAlpha = opacity
      ctx.shadowColor = color
      ctx.shadowBlur = 4
    } else {
      // Para fondos oscuros
      ctx.strokeStyle = color
      ctx.globalAlpha = opacity
    }

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }

  const checkBounds = (x: number, y: number, canvas: HTMLCanvasElement) => {
    return x > canvas.width || x < 0 || y > canvas.height || y < 0
  }

  const resize = (canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) => {
    const { innerWidth, innerHeight } = window

    canvas.width = innerWidth
    canvas.height = innerHeight

    center[0] = 0.5 * canvas.width
    center[1] = 0.5 * canvas.height
  }

  const renderGlow = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.save()

    const useDarkParticles = shouldUseDarkParticles()

    if (useDarkParticles) {
      // Para fondos claros
      ctx.filter = "blur(6px) brightness(120%) saturate(150%)"
      ctx.globalCompositeOperation = "source-over"
    } else {
      // Para fondos oscuros
      ctx.filter = "blur(8px) brightness(200%)"
      ctx.globalCompositeOperation = "lighter"
    }

    ctx.drawImage(canvas, 0, 0)
    ctx.restore()

    ctx.save()

    if (useDarkParticles) {
      // Segunda pasada para fondos claros
      ctx.filter = "blur(3px) brightness(100%) saturate(150%)"
      ctx.globalCompositeOperation = "source-over"
    } else {
      // Segunda pasada para fondos oscuros
      ctx.filter = "blur(4px) brightness(200%)"
      ctx.globalCompositeOperation = "lighter"
    }

    ctx.drawImage(canvas, 0, 0)
    ctx.restore()
  }

  const renderToScreen = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.save()

    const useDarkParticles = shouldUseDarkParticles()

    if (useDarkParticles) {
      // Para fondos claros
      ctx.globalCompositeOperation = "source-over"
    } else {
      // Para fondos oscuros
      ctx.globalCompositeOperation = "lighter"
    }

    ctx.drawImage(canvas, 0, 0)
    ctx.restore()
  }

  // Reiniciar el componente cuando cambia el color de fondo
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.backgroundColor = backgroundColor
    }

    // Opcional: reiniciar las partículas cuando cambia el fondo
    // initParticles();
  }, [backgroundColor])

  useEffect(() => {
    setup()

    const handleResize = () => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (canvas && ctx) {
        resize(canvas, ctx)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className={cn("relative h-full w-full", props.containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={containerRef}
        className="absolute h-full w-full inset-0 z-0 bg-transparent flex items-center justify-center"
        style={{ backgroundColor: preserveBackground ? backgroundColor : "transparent" }}
      >
        <canvas ref={canvasRef}></canvas>
      </motion.div>

      <div className={cn("relative z-10", props.className)}>{props.children}</div>
    </div>
  )
}
