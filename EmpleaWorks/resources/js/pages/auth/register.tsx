"use client"

import { type FormEventHandler, useEffect, useState } from "react"
import { Head, Link, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AppLogo from "@/components/app-logo"
import InputError from "@/components/input-error"
import { useTranslation } from "@/utils/i18n"
import { InputPassword } from "@/components/ui/input-password"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function Register() {
  const { t } = useTranslation()
  const [activeField, setActiveField] = useState<string | null>(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
  })

  useEffect(() => {
    return () => {
      reset("password", "password_confirmation")
    }
  }, [])

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route("register"))
  }

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

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName)
  }

  const handleBlur = () => {
    setActiveField(null)
  }

  return (
    <>
      <Head title={t("register")} />
      <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/30 z-0">
          <canvas id="particle-canvas" className="absolute inset-0 w-full h-full" />
        </div>

        {/* Content with glassmorphism effect */}
        <div className="relative z-10 w-full max-w-md space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-2 text-center"
          >
            <Link href="/" className="flex items-center gap-2 group justify-center">
              <AppLogo className="h-12 w-8 bg-transparent p-0 m-0" />
              <span className="text-xl font-bold tracking-tight hover:text-purple-600 dark:hover:text-purple-300 transition-colors -ml-1">
                EmpleaWorks
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-[#7c28eb]">{t("create_an_account")}</h1>
              <Sparkles className="h-5 w-5 text-[#9645f4] animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">{t("enter_details_create_account")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl overflow-hidden border border-purple-100/50 dark:border-purple-600/30 p-6 shadow-sm transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30"
          >
            <form onSubmit={submit} className="space-y-6">
              <div className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2 relative">
                  <Label
                    htmlFor="name"
                    className={`text-[#9645f4] dark:text-[#c79dff] transition-all duration-300 ${
                      activeField === "name" ? "text-[#6a1fd0] dark:text-purple-200" : ""
                    }`}
                  >
                    {t("name")}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={data.name}
                    className={`w-full border-purple-100 dark:border-purple-600/30 focus-visible:ring-[#7c28eb] transition-all duration-300 ${
                      activeField === "name"
                        ? "border-[#7c28eb] dark:border-purple-400 shadow-[0_0_0_1px_rgba(124,40,235,0.2)]"
                        : ""
                    }`}
                    autoComplete="name"
                    autoFocus
                    placeholder={t("name_placeholder")}
                    onChange={(e) => setData("name", e.target.value)}
                    onFocus={() => handleFocus("name")}
                    onBlur={handleBlur}
                    required
                  />
                  {activeField === "name" && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#7c28eb] to-[#9645f4] w-0"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <InputError message={errors.name} />
                </div>

                {/* Email Field */}
                <div className="space-y-2 relative">
                  <Label
                    htmlFor="email"
                    className={`text-[#9645f4] dark:text-[#c79dff] transition-all duration-300 ${
                      activeField === "email" ? "text-[#6a1fd0] dark:text-purple-200" : ""
                    }`}
                  >
                    {t("email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className={`w-full border-purple-100 dark:border-purple-600/30 focus-visible:ring-[#7c28eb] transition-all duration-300 ${
                      activeField === "email"
                        ? "border-[#7c28eb] dark:border-purple-400 shadow-[0_0_0_1px_rgba(124,40,235,0.2)]"
                        : ""
                    }`}
                    autoComplete="username"
                    placeholder={t("email_placeholder")}
                    onChange={(e) => setData("email", e.target.value)}
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    required
                  />
                  {activeField === "email" && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#7c28eb] to-[#9645f4] w-0"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <InputError message={errors.email} />
                </div>

                {/* Role Selection */}
                <div className="space-y-2 relative">
                  <Label
                    htmlFor="role"
                    className={`text-[#9645f4] dark:text-[#c79dff] transition-all duration-300 ${
                      activeField === "role" ? "text-[#6a1fd0] dark:text-purple-200" : ""
                    }`}
                  >
                    {t("role")}
                  </Label>
                  <Select
                    name="role"
                    value={data.role}
                    onValueChange={(value) => setData("role", value)}
                    onOpenChange={(open) => {
                      if (open) handleFocus("role")
                      else handleBlur()
                    }}
                    disabled={processing}
                    required
                  >
                    <SelectTrigger
                      id="role"
                      className={`w-full border-purple-100 dark:border-purple-600/30 focus-visible:ring-[#7c28eb] transition-all duration-300 ${
                        activeField === "role"
                          ? "border-[#7c28eb] dark:border-purple-400 shadow-[0_0_0_1px_rgba(124,40,235,0.2)]"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder={t("select_role")} />
                    </SelectTrigger>
                    <SelectContent className="border-purple-100 dark:border-purple-600/30 dark:bg-gray-900">
                      <SelectItem
                        value="candidate"
                        className="cursor-pointer focus:bg-purple-50 dark:focus:bg-purple-900/20 focus:text-[#7c28eb]"
                      >
                        {t("candidate")}
                      </SelectItem>
                      <SelectItem
                        value="company"
                        className="cursor-pointer focus:bg-purple-50 dark:focus:bg-purple-900/20 focus:text-[#7c28eb]"
                      >
                        {t("company")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {activeField === "role" && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#7c28eb] to-[#9645f4] w-0"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <InputError message={errors.role} />
                </div>

                {/* Password Field */}
                <div className="space-y-2 relative">
                  <InputPassword
                    id="password"
                    name="password"
                    value={data.password}
                    onChange={(value) => {
                      setData("password", value)
                      // Simulate focus when typing in password field
                      handleFocus("password")
                      // Clear focus after a short delay when done typing
                      const timer = setTimeout(() => {
                        if (activeField === "password") {
                          handleBlur()
                        }
                      }, 3000)
                      return () => clearTimeout(timer)
                    }}
                    label={t("password")}
                    className={`[&_label]:text-[#9645f4] [&_label]:dark:text-[#c79dff] [&_input]:border-purple-100 [&_input]:dark:border-purple-600/30 [&_input]:focus-visible:ring-[#7c28eb] transition-all duration-300 ${
                      activeField === "password"
                        ? "[&_input]:border-[#7c28eb] [&_input]:dark:border-purple-400 [&_input]:shadow-[0_0_0_1px_rgba(124,40,235,0.2)]"
                        : ""
                    }`}
                    placeholder={t("password_placeholder")}
                    required
                  />
                  <InputError message={errors.password} />
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2 relative">
                  <Label
                    htmlFor="password_confirmation"
                    className={`text-[#9645f4] dark:text-[#c79dff] transition-all duration-300 ${
                      activeField === "password_confirmation" ? "text-[#6a1fd0] dark:text-purple-200" : ""
                    }`}
                  >
                    {t("confirm_password")}
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className={`w-full border-purple-100 dark:border-purple-600/30 focus-visible:ring-[#7c28eb] transition-all duration-300 ${
                      activeField === "password_confirmation"
                        ? "border-[#7c28eb] dark:border-purple-400 shadow-[0_0_0_1px_rgba(124,40,235,0.2)]"
                        : ""
                    }`}
                    autoComplete="new-password"
                    placeholder={t("password_placeholder")}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    onFocus={() => handleFocus("password_confirmation")}
                    onBlur={handleBlur}
                    required
                  />
                  {activeField === "password_confirmation" && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#7c28eb] to-[#9645f4] w-0"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <InputError message={errors.password_confirmation} />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                disabled={processing}
              >
                <span className="relative z-10">{processing ? t("registering") : t("register")}</span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer"></span>
              </Button>
            </form>
          </motion.div>

          <div className="text-center text-sm">
            {t("already_have_account")}{" "}
            <Link
              href={route("login")}
              className="text-[#9645f4] dark:text-[#c79dff] underline underline-offset-4 hover:text-[#7c28eb] dark:hover:text-purple-300"
            >
              {t("sign_in")}
            </Link>
          </div>
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
