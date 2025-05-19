"use client"

import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, SharedData } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import { useEffect, useRef, useState } from "react"
import { BookOpenCheck, UserIcon, Sparkles, BookmarkIcon } from "lucide-react"
import type { Offer } from "@/types/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster, showToast } from "@/components/toast"
import { useTranslation } from "@/utils/i18n"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import axios from "axios"

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

export default function CandidateDashboard({ 
  candidateOffers = [], 
  savedOffers: initialSavedOffers = [] 
}: { 
  candidateOffers?: Offer[];
  savedOffers?: Offer[];
}) {
  // ----- HOOKS & STATE -----
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props
  const { auth } = usePage<SharedData>().props
  const { t } = useTranslation()
  const user = auth.user
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [savedOffers, setSavedOffers] = useState(initialSavedOffers);
  const [isSubmitting, setIsSubmitting] = useState<number | null>(null)

  // ----- COLOR THEMING SYSTEM -----
  // Colores principales (púrpura)
  const primaryColor = "#7c28eb"
  const primaryHoverColor = "#6620c5"
  const primaryLightColor = "#9645f4"

  // Colores de acento (ámbar)
  const accentColor = "#FDC231"
  const accentDarkColor = "#E3B100"

  // ----- TAILWIND CLASS MODIFIERS -----
  const borderColor = "border-purple-100/50 dark:border-purple-600/30"
  const bgAccentColor = "bg-purple-50/50 dark:bg-purple-950/20"
  const cardBgColor = "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
  const cardHoverBgColor = "hover:bg-purple-50/70 dark:hover:bg-purple-900/15"

  // ----- SIDE EFFECTS -----
  useEffect(() => {
    if (flash && flash.success) {
      showToast.success(flash.success)
    }
    if (flash && flash.error) {
      showToast.error(flash.error)
    }
  }, [flash])

  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current
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
        if (canvas) {
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height
        } else {
          this.x = 0
          this.y = 0
        }
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25

        // Purple color palette
        const colors = ["rgba(124, 40, 235, 0.4)", "rgba(150, 69, 244, 0.3)", "rgba(199, 157, 255, 0.5)"]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        if (canvas) {
          this.x += this.speedX
          this.y += this.speedY

          if (this.x > canvas.width) this.x = 0
          else if (this.x < 0) this.x = canvas.width

          if (this.y > canvas.height) this.y = 0
          else if (this.y < 0) this.y = canvas.height
        }
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

  // ----- CONFIGURATION -----
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t("candidate_dashboard_title"),
      href: "/candidate/dashboard",
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const handleUnsave = async (offerId: number) => {
    try {
      setIsSubmitting(offerId);
      
      await axios.post(route('offer.save.toggle', offerId));
      
      showToast.success(t('offer_removed_from_saved'));
      
      setSavedOffers(currentOffers => 
        currentOffers.filter(offer => offer.id !== offerId)
      );
      
    } catch (error) {
      console.error('Error unsaving offer:', error);
      showToast.error(t('operation_failed'));
    } finally {
      setIsSubmitting(null);
    }
  };

  // ----- RENDER COMPONENT -----
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Toaster />
      <Head title={t("candidate_dashboard_title")} />

      <div className="flex h-full flex-1 flex-col gap-4 p-4 bg-[#FEFBF2] dark:bg-transparent relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FEFBF2] via-[#FEFBF2] to-[#F8F0DD] dark:bg-[#0a0a0a] z-0">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full dark:bg-[#0a0a0a]" />
        </div>

        {/* Content with glassmorphism effect */}
        <div className="relative z-10 px-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-[#7c28eb] dark:text-purple-300">
                {t("candidate_dashboard_title")}
              </h2>
              <Sparkles className="h-5 w-5 text-[#9645f4] animate-pulse" />
            </div>
            <p className="text-muted-foreground">{t("candidate_dashboard_subtitle")}</p>
          </motion.div>

          {/* Acciones Rápidas */}
          <motion.div
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 mt-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Tarjeta de Aplicaciones */}
            <motion.div variants={itemVariants} className="h-full">
              <Card
                className={cn(
                  "overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:scale-[1.02]",
                  borderColor,
                  cardBgColor,
                )}
                style={{ borderTop: `4px solid ${primaryColor}` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#7c28eb] dark:text-purple-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: primaryLightColor }}
                    >
                      <rect width="7" height="7" x="3" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="14" rx="1" />
                      <rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                    {t("explore_jobs")}
                  </CardTitle>
                  <CardDescription>{t("find_new_opportunities")}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  {/* Contenido con ilustración a un lado y texto al otro */}
                  <div className="flex flex-row items-center gap-4 mb-4 flex-grow">
                    <div className="flex-shrink-0 w-1/3 flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#7c28eb] dark:text-purple-300"
                        >
                          <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
                          <path d="M16 2v4" />
                          <path d="M8 2v4" />
                          <path d="M3 10h18" />
                          <circle cx="18" cy="18" r="3" />
                          <path d="M18 15v1.5" />
                          <path d="M18 19.5V21" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow w-2/3">
                      <div className="space-y-2">
                        <h3 className="font-medium text-[#7c28eb] dark:text-purple-300">
                          {t("latest_jobs_waiting")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t("personalized_job_opportunities")}
                        </p>
                        <div className="flex items-center text-xs space-x-2 text-muted-foreground">
                          <span className="inline-flex items-center gap-0.5">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {t("updated_daily")}
                          </span>
                          <span className="inline-flex items-center gap-0.5">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="7" height="7" x="14" y="14" rx="1" />
                              <rect width="7" height="7" x="3" y="14" rx="1" />
                              <rect width="7" height="7" x="3" y="3" rx="1" />
                              <rect width="7" height="7" x="14" y="3" rx="1" />
                            </svg>
                            {t("multiple_categories")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="gap-1 w-full mt-2 relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Link
                      href={route("dashboard")}
                      className="w-full h-full absolute inset-0 z-10"
                      aria-label={t("find_jobs")}
                    />
                    <div className="w-full flex items-center justify-center pointer-events-none">
                      {t("browse_all_jobs")}
                    </div>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer pointer-events-none"></span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tarjeta de Perfil */}
            <motion.div variants={itemVariants} className="h-full">
              <Card
                className={cn(
                  "overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:scale-[1.02]",
                  borderColor,
                  cardBgColor,
                )}
                style={{ borderTop: `4px solid ${accentColor}` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#7c28eb] dark:text-purple-300">
                    <UserIcon className="h-5 w-5" style={{ color: primaryLightColor }} />
                    {t("profile")}
                  </CardTitle>
                  <CardDescription>{t("your_information")}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-col h-full justify-between">
                    {/* Bloque de perfil con imagen */}
                    <div className="flex items-center gap-3">
                      {/* Avatar del usuario */}
                      {user?.image ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                          <img src={`/storage/${user.image}`} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700"
                          style={{ backgroundColor: `${accentColor}30` }}
                        >
                          <UserIcon className="h-6 w-6" style={{ color: accentColor }} />
                        </div>
                      )}
                      <div>
                        <div className="text-lg font-medium truncate max-w-[200px]">{user?.name}</div>
                        <div className="text-sm text-muted-foreground">{t("complete_profile")}</div>
                        {/* Estado de verificación de correo */}
                        {user?.email_verified_at === null ? (
                          <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 5.636l-1.414-1.414A9 9 0 105.636 18.364l1.414 1.414A9 9 0 1018.364 5.636z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 9l-6 6M9 9l6 6"
                              />
                            </svg>
                            {t("email_not_verified")}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {t("email_verified")}
                          </div>
                        )}
                        {/* Estado de CV */}
                        {user?.candidate ? (
                          user.candidate.cv ? (
                            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V7.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 1H7a2 2 0 00-2 2v16a2 2 0 002 2z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 9h6M9 13h6M9 17h3"
                                />
                              </svg>
                              {t("cv_uploaded")}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V7.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 1H7a2 2 0 00-2 2v16a2 2 0 002 2z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 9h6M9 13h6M9 17h3"
                                />
                              </svg>
                              {t("cv_not_uploaded")}
                            </div>
                          )
                        ) : null}
                      </div>
                    </div>

                    {/* Botón de editar perfil */}
                    <div className="mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className={cn(
                          "w-full",
                          "border-purple-200 dark:border-purple-700",
                          "text-[#7c28eb] dark:text-white",
                          "hover:bg-purple-50 dark:hover:bg-purple-900/30",
                          "hover:border-[#7c28eb] dark:hover:border-purple-500",
                          "hover:text-[#6620c5] dark:hover:text-white",
                          "transition-all duration-300",
                        )}
                        asChild
                      >
                        <Link href={"/settings/profile"} className="w-full flex items-center justify-center gap-1.5">
                          <UserIcon className="h-4 w-4" />
                          {t("edit_profile")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Tarjetas de acceso rápido */}
          <motion.div
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 mt-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Tarjeta de Ofertas Aplicadas */}
            <motion.div variants={itemVariants} className="h-full">
              <Card
                className={cn(
                  "overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:scale-[1.02]",
                  borderColor,
                  cardBgColor,
                )}
                style={{ borderTop: `4px solid ${accentColor}` }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-[#7c28eb] dark:text-purple-300">
                    <BookOpenCheck className="h-5 w-5" style={{ color: primaryLightColor }} />
                    {t("your_applications")}
                    <div className="ml-auto bg-purple-100 dark:bg-purple-900/30 text-[#7c28eb] dark:text-purple-300 text-xs py-1 px-2 rounded-full">
                      {candidateOffers.length}
                    </div>
                  </CardTitle>
                  <CardDescription className="mb-1">{t("jobs_applied_to")}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow flex flex-col justify-between pt-0 pb-4 space-y-4">
                  {/* Preview de ofertas aplicadas */}
                  <div className={cn("overflow-hidden flex-grow", candidateOffers.length > 0 ? "min-h-[120px]" : "")}>
                    {candidateOffers.length > 0 ? (
                      <div className="space-y-2">
                        {candidateOffers.slice(0, 3).map((offer, index) => (
                          <div 
                            key={`app-${offer.id}`} 
                            className={cn(
                              "flex items-center p-2 rounded-md text-sm transition-colors",
                              "bg-white dark:bg-gray-800/50",
                              "border border-purple-100/50 dark:border-purple-700/30",
                              index === 2 && candidateOffers.length > 3 ? "mb-1" : ""
                            )}
                          >
                            <div className="flex-1 truncate">
                              <Link 
                                href={route("offer.show", offer.id)}
                                className="font-medium truncate text-[#7c28eb] dark:text-purple-300 hover:text-[#6620c5] dark:hover:text-purple-200 transition-colors block"
                              >
                                {offer.name}
                              </Link>
                              <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="flex-shrink-0"
                                >
                                  <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"></path>
                                  <path d="M18 5V3a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path>
                                  <path d="M21 5H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                                </svg>
                                {offer.company ? (offer.company as any).name : t("company_not_available")}
                              </div>
                            </div>
                            {/* Días restantes */}
                            <div className="ml-2 whitespace-nowrap">
                              {(() => {
                                const closingDate = new Date(offer.closing_date)
                                const currentDate = new Date()
                                const daysLeft = Math.ceil(
                                  (closingDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
                                )

                                return (
                                  <span className={cn(
                                    "text-xs px-1.5 py-0.5 rounded-full",
                                    daysLeft <= 0 
                                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" 
                                      : daysLeft <= 3
                                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                        : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                  )}>
                                    {daysLeft <= 0
                                      ? t("closed")
                                      : daysLeft === 1
                                        ? t("days_remaining", { days: daysLeft })
                                        : t("days_remaining_plural", { days: daysLeft })}
                                  </span>
                                )
                              })()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 text-center h-full">
                        <div className="text-muted-foreground text-sm mb-2">{t("no_applications_yet")}</div>
                        <div className="text-xs text-muted-foreground">{t("browse_to_apply")}</div>
                      </div>
                    )}
                  </div>

                  {/* Botón para ver todas */}
                  <Button
                    size="sm"
                    className="gap-1 w-full relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Link 
                      href={route("candidate.applications")} 
                      className="w-full h-full absolute inset-0 z-10"
                      aria-label={t("view_applications")}
                    />
                    <div className="w-full flex items-center justify-center gap-1 pointer-events-none">
                      {t("view_applications")}
                    </div>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer pointer-events-none"></span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tarjeta de Ofertas Guardadas - Versión simplificada */}
            <motion.div variants={itemVariants} className="h-full">
              <Card
                className={cn(
                  "overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:scale-[1.02]",
                  borderColor,
                  cardBgColor,
                )}
                style={{ borderTop: `4px solid ${primaryColor}` }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-[#7c28eb] dark:text-purple-300">
                    <BookmarkIcon className="h-5 w-5" style={{ color: primaryLightColor }} />
                    {t("saved_offers")}
                    <div className="ml-auto bg-purple-100 dark:bg-purple-900/30 text-[#7c28eb] dark:text-purple-300 text-xs py-1 px-2 rounded-full">
                      {savedOffers.length}
                    </div>
                  </CardTitle>
                  <CardDescription className="mb-1">{t("jobs_saved_for_later")}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow flex flex-col justify-between pt-0 pb-4 space-y-4">
                  {/* Preview de ofertas guardadas - Versión simplificada */}
                  <div className={cn("overflow-hidden flex-grow", savedOffers.length > 0 ? "min-h-[120px]" : "")}>
                    {savedOffers.length > 0 ? (
                      <div className="space-y-2">
                        {savedOffers.slice(0, 3).map((offer, index) => (
                          <div 
                            key={`saved-${offer.id}`} 
                            className={cn(
                              "flex items-center p-2 rounded-md text-sm transition-colors",
                              "bg-white dark:bg-gray-800/50",
                              "border border-purple-100/50 dark:border-purple-700/30",
                              index === 2 && savedOffers.length > 3 ? "mb-1" : ""
                            )}
                          >
                            <div className="flex-1 truncate">
                              <Link 
                                href={route("offer.show", offer.id)}
                                className="font-medium truncate text-[#7c28eb] dark:text-purple-300 hover:text-[#6620c5] dark:hover:text-purple-200 transition-colors block"
                              >
                                {offer.name}
                              </Link>
                              <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="flex-shrink-0"
                                >
                                  <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"></path>
                                  <path d="M18 5V3a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path>
                                  <path d="M21 5H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                                </svg>
                                {offer.company ? (offer.company as any).name : t("company_not_available")}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 text-center h-full">
                        <div className="text-muted-foreground text-sm mb-2">{t("no_saved_offers_yet")}</div>
                        <div className="text-xs text-muted-foreground">{t("browse_to_save")}</div>
                      </div>
                    )}
                  </div>

                  {/* Botón para ver todas */}
                  <Button
                    size="sm"
                    className="gap-1 w-full relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Link 
                      href={route("candidate.saved-offers")} 
                      className="w-full h-full absolute inset-0 z-10"
                      aria-label={t("view_saved_offers")}
                    />
                    <div className="w-full flex items-center justify-center gap-1 pointer-events-none">
                      {t("view_saved_offers")}
                    </div>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer pointer-events-none"></span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
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
    </AppLayout>
  )
}