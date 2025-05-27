"use client"

import type React from "react"

import AppLayout from "@/layouts/app-layout"
import { Head, Link, useForm, usePage } from "@inertiajs/react"
import { BriefcaseIcon, CalendarIcon, MapPinIcon, BuildingIcon, ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { BreadcrumbItem, SharedData } from "@/types"
import { useState, useEffect } from "react"
import type { Offer } from "@/types/types"
import { useTranslation } from "@/utils/i18n"
import ClipLoader from "react-spinners/ClipLoader"
import { cn } from "@/lib/utils"

interface ApplyFormProps {
  offer: Offer // Recibimos la oferta como prop
}

export default function ApplyForm({ offer }: ApplyFormProps) {
  // ----- HOOKS & STATE -----
  const { company } = offer
  const { t } = useTranslation()
  const { auth } = usePage<SharedData>().props

  // ----- COLOR THEMING SYSTEM -----
  // Colores principales (púrpura)
  const primaryColor = "#7c28eb"
  const primaryHoverColor = "#6620c5"
  const primaryLightColor = "#9645f4"

  // Colores de acento (ámbar)
  const accentColor = "#FDC231"

  // ----- TAILWIND CLASS MODIFIERS -----
  // Clases CSS para aplicar el tema púrpura
  const borderColor = "border-purple-100 dark:border-purple-600/30"
  const bgAccentColor = "bg-purple-50/50 dark:bg-purple-950/20"

  // ----- FORM STATE -----
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)

  // ----- FORM DATA & HANDLERS -----
  const { data, setData, post, processing, errors } = useForm({
    phone: "",
    email: "",
    cl: "",
    offer_id: offer.id,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSpinner(true)
    setTimeout(() => {
      post("/apply", {
        onSuccess: () => {
          setShowSpinner(false)
          console.log("Application submitted successfully")
        },
      })
    }, 600) // Muestra el spinner al menos 1 segundo
  }

  // ----- CONFIGURATION -----
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t("dashboard"),
      href: "/dashboard",
    },
    {
      title: offer.name,
      href: `/offers/${offer.id}`,
    },
    {
      title: t("apply"),
      href: `/apply-form/${offer.id}`,
    },
  ]

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
    let animationFrameId: number

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // ----- RENDER COMPONENT -----
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${t("apply_for")} ${offer.name} - EmpleaWorks`} />

      {/* Spinner Overlay */}
      {showSpinner && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.1)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ClipLoader size={80} color={primaryColor} />
        </div>
      )}

      <div className="relative flex h-full flex-1 flex-col gap-4 p-4 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FEFBF2] via-[#FEFBF2] to-[#F8F0DD] dark:bg-[#0a0a0a] z-0">
          <canvas id="particle-canvas" className="absolute inset-0 w-full h-full dark:bg-[#0a0a0a]" />
        </div>

        {/* Content with glassmorphism effect */}
        <div className="relative z-10">
          {/* Cabecera de la página */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mb-4 hover:text-foreground/80"
              style={{ color: primaryColor }}
            >
              <Link href={`/offers/${offer.id}`}>
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                {t("back_to_offer_details")}
              </Link>
            </Button>

            <h1 className="text-2xl font-bold mb-2 text-[#7c28eb] dark:text-purple-300">
              {t("apply_for")}: {offer.name}
            </h1>
            <div className="flex items-center mb-4">
              <span className="text-lg font-medium text-muted-foreground">{company.name}</span>
              <Badge
                className={cn(
                  "ml-3",
                  "bg-amber-100 text-amber-800 hover:bg-amber-200",
                  "dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/40",
                )}
              >
                {offer.category}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario de Aplicación */}
            <div className="lg:col-span-2">
              <Card
                className={cn(
                  "transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30",
                  borderColor,
                  "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
                )}
              >
                <CardHeader className={cn(bgAccentColor, "px-6 py-4")}>
                  <CardTitle className="text-[#7c28eb] dark:text-purple-300">{t("application_form")}</CardTitle>
                  <CardDescription className="dark:text-gray-300">{t("complete_all_fields")}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#7c28eb] dark:text-purple-300">
                        {t("phone_number")}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        placeholder={t("enter_phone")}
                        required
                        className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                      />
                      {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#7c28eb] dark:text-purple-300">
                        {t("email")}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder={t("enter_email")}
                        required
                        className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cl" className="text-[#7c28eb] dark:text-purple-300">
                        {t("cover_letter")}
                      </Label>
                      <Textarea
                        id="cl"
                        value={data.cl}
                        onChange={(e) => setData("cl", e.target.value)}
                        placeholder={t("why_apply")}
                        rows={5}
                        required
                        className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                      />
                      {errors.cl && <p className="text-sm text-red-500">{errors.cl}</p>}
                    </div>

                    {/* Checkbox de términos y condiciones */}
                    <div className="flex items-start gap-2 mt-4">
                      <Checkbox
                        id="terms"
                        name="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                        required
                        className="data-[state=checked]:bg-[#7c28eb] data-[state=checked]:border-[#7c28eb]"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t("agree_terms_extended")}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {t("data_processing_notice")}
                          <Link href={route("terms")} className="hover:underline text-[#7c28eb] dark:text-purple-300">
                            {t("terms_and_conditions")}
                          </Link>
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-4 relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                      disabled={processing || !acceptTerms}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {processing ? t("submitting") : t("submit_application")}
                      </span>
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer pointer-events-none"></span>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Resumen del Trabajo */}
            <div>
              <Card
                className={cn(
                  "transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30",
                  borderColor,
                  "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
                )}
              >
                <CardHeader className={cn(bgAccentColor, "px-6 py-4")}>
                  <CardTitle className="text-[#7c28eb] dark:text-purple-300">{t("job_summary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center">
                    {company.logo ? (
                      <img
                        src={`/storage/${company.logo}`}
                        alt={company.name}
                        className="size-16 rounded-md object-cover mr-4"
                      />
                    ) : (
                      <div
                        className="size-16 rounded-md flex items-center justify-center mr-4"
                        style={{ backgroundColor: `${accentColor}20` }}
                      >
                        <BuildingIcon className="size-8 text-[#FDC231] dark:text-[#FFDE7A]" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{company.name}</h3>
                    </div>
                  </div>

                  <Separator className="bg-purple-100 dark:bg-purple-600/30" />

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div
                        className="size-9 flex items-center justify-center rounded-full mr-3"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <BriefcaseIcon className="size-5 text-[#9645f4] dark:text-[#c79dff]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("contract_type")}</p>
                        <p className="font-medium">{offer.contract_type}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div
                        className="size-9 flex items-center justify-center rounded-full mr-3"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <MapPinIcon className="size-5 text-[#9645f4] dark:text-[#c79dff]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("location")}</p>
                        <p className="font-medium">{offer.job_location}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div
                        className="size-9 flex items-center justify-center rounded-full mr-3"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <CalendarIcon className="size-5 text-[#9645f4] dark:text-[#c79dff]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("deadline")}</p>
                        <p className="font-medium">{new Date(offer.closing_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
    </AppLayout>
  )
}
