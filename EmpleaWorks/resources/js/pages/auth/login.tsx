"use client"

import { Head } from "@inertiajs/react"
import { LoginForm } from "@/components/login-form"
import { useTranslation } from "@/utils/i18n"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect } from "react"

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
  const { t } = useTranslation()

  // Particle animation effect
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.offsetWidth
        canvas.height = container.offsetHeight
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25

        // Purple color palette
        const colors = ["rgba(124, 40, 235, 0.4)", "rgba(150, 69, 244, 0.3)", "rgba(199, 157, 255, 0.5)"]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width

        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 10000))

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <>
      <Head title={t("log_in")} />
      <div className="relative flex min-h-svh flex-col items-center justify-center p-4 md:p-10 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/30 z-0">
          <canvas id="particle-canvas" className="absolute inset-0 w-full h-full" />
        </div>

        {/* Content with glassmorphism effect */}
        <div className="relative z-10 w-full max-w-sm md:max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-[#7c28eb] dark:text-purple-300">{t("log_in")}</h2>
              <Sparkles className="h-6 w-6 text-[#9645f4] animate-pulse" />
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t("enter_email_to_sign_in") || "Sign in to your account to access your dashboard and manage your profile."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
            }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-purple-100/50 dark:border-purple-500/20 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30"
          >
            <div className="p-6 md:p-8">
              <LoginForm status={status} canResetPassword={canResetPassword} />
            </div>
            {/* Decorative gradient footer */}
            <div className="h-2 bg-gradient-to-r from-[#7c28eb] via-[#9645f4] to-[#c79dff]"></div>
          </motion.div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  )
}
