"use client"

import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, SharedData } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import { CalendarIcon, MapPinIcon, BriefcaseIcon, PlusCircleIcon, UsersIcon, BuildingIcon } from "lucide-react"
import type { Offer } from "@/types/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster, showToast } from "@/components/toast"
import { TrashIcon } from "lucide-react"
import { router } from "@inertiajs/react"
import { useTranslation } from "@/utils/i18n"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEffect } from "react"
import { motion } from "framer-motion"

export default function CompanyDashboard({
  companyOffers = [],
  totalApplicants = 0,
}: { companyOffers?: Offer[]; totalApplicants?: number }) {
  // ----- HOOKS & STATE -----
  const { auth } = usePage<SharedData>().props
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props
  const { t } = useTranslation()

  // ----- COLOR THEMING SYSTEM -----
  // Colores principales (púrpura)
  const primaryColor = "#7c28eb"
  const primaryHoverColor = "#6620c5"
  const primaryLightColor = "#9645f4"

  // Colores de acento (ámbar)
  const accentColor = "#FDC231"
  const accentDarkColor = "#E3B100"
  const accentLightColor = "#FFDE7A"

  // ----- TAILWIND CLASS MODIFIERS -----
  // Clases CSS para aplicar el tema púrpura con acentos ámbar
  const borderColor = "border-purple-100 dark:border-purple-600/30"
  const bgAccentColor = "bg-purple-50/50 dark:bg-purple-950/20"
  const cardBgColor = "bg-white dark:bg-gray-900"
  const cardHoverBgColor = "hover:bg-purple-50/70 dark:hover:bg-purple-900/15"

  // ----- CONFIGURATION -----
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t("company_dashboard"),
      href: "/company/dashboard",
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

  // Añadimos useEffect para mostrar los mensajes flash
  useEffect(() => {
    if (flash && flash.success) {
      showToast.success(flash.success);
    }
    if (flash && flash.error) {
      showToast.error(flash.error);
    }
  }, [flash]);

  // ----- RENDER COMPONENT -----
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Toaster />
      <Head title={t("company_dashboard")} />

      <div className="relative flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FEFBF2] via-[#FEFBF2] to-[#F8F0DD] dark:bg-[#0a0a0a] z-0">
          <canvas id="particle-canvas" className="absolute inset-0 w-full h-full dark:bg-[#0a0a0a]" />
        </div>

        {/* Content with glassmorphism effect */}
        <div className="relative z-10">
          {/* Título del Dashboard con animación */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="px-2 mb-4"
          >
            <h2 className="text-2xl font-semibold mb-2 text-[#7c28eb] dark:text-purple-300">
              {t("company_dashboard")}
            </h2>
            <p className="text-muted-foreground">{t("manage_company_listings")}</p>
          </motion.div>

          {/* Acciones rápidas con animación de contenedor */}
          <motion.div 
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Tarjeta de Job Listings */}
            <motion.div variants={itemVariants}>
              <Card
                className={cn(
                  "overflow-hidden flex flex-col h-full min-h-[230px]",
                  "transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:scale-[1.02]",
                  borderColor,
                  "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
                )}
                style={{ borderTop: `4px solid ${primaryColor}` }}
              >
                <CardHeader className="px-3 py-1.5">
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
                      className="text-primary/80"
                      style={{ color: primaryLightColor }}
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    {t("job_listings")}
                  </CardTitle>
                  <CardDescription className="dark:text-gray-300">{t("manage_jobs")}</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col justify-between px-3 pt-0 pb-1">
                  <div>
                    <div className="text-3xl font-bold text-[#7c28eb] dark:text-purple-300">{companyOffers.length}</div>
                    <div className="text-sm text-muted-foreground mb-1">{t("active_positions")}</div>
                  </div>

                  <Button
                    size="sm"
                    className="gap-1 w-full mt-0 relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    asChild
                  >
                    <Link href={route("company.create-job")} className="flex items-center justify-center">
                      <PlusCircleIcon className="h-4 w-4 mr-1" />
                      {t("new_job")}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer pointer-events-none"></span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tarjeta de Aplicantes */}
            <motion.div variants={itemVariants}>
              <Card
                className={cn(
                  "overflow-hidden flex flex-col h-full min-h-[230px]",
                  "transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:scale-[1.02]",
                  borderColor,
                  "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
                )}
                style={{ borderTop: `4px solid ${accentColor}` }}
              >
                <CardHeader className="px-3 py-2">
                  <CardTitle className="flex items-center gap-2 text-[#7c28eb] dark:text-purple-300">
                    <UsersIcon className="h-5 w-5" style={{ color: accentColor }} />
                    {t("applicants")}
                  </CardTitle>
                  <CardDescription className="dark:text-gray-300">{t("applications_to_jobs")}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between px-3 pt-0 pb-1">
                  <div>
                    <div className="text-3xl font-bold text-[#7c28eb] dark:text-purple-300">{totalApplicants}</div>
                    <div className="text-sm text-muted-foreground mb-1">{t("total_candidates")}</div>
                  </div>

                  <Button
                    size="sm"
                    className="gap-1 w-full mt-2 cursor-pointer"
                    style={{
                      backgroundColor: accentColor,
                      color: "#4a2982",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = accentDarkColor
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = accentColor
                    }}
                    asChild
                  >
                    <Link href={route("company.applicants")} className="flex items-center justify-center">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      {t("view_applicants")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tarjeta de Perfil de Empresa */}
            <motion.div variants={itemVariants}>
              <Card
                className={cn(
                  "overflow-hidden flex flex-col h-full min-h-[230px]",
                  "transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:scale-[1.02]",
                  borderColor,
                  "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
                )}
                style={{ borderTop: `4px solid ${primaryLightColor}` }}
              >
                <CardHeader className="px-3 py-2">
                  <CardTitle className="flex items-center gap-2 text-[#7c28eb] dark:text-purple-300">
                    <BuildingIcon className="h-5 w-5" style={{ color: primaryLightColor }} />
                    {t("company_profile")}
                  </CardTitle>
                  <CardDescription className="dark:text-gray-300">{t("update_profile")}</CardDescription>
                </CardHeader>
                <CardContent className="px-3 pt-0 pb-1 flex-grow flex flex-col justify-between">
                  {/* Bloque de perfil */}
                  <div className="flex items-center gap-2 mb-2">
                    {/* Logo de la empresa */}
                    {auth.user.image ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-purple-100 dark:border-purple-700/30">
                        <img
                          src={`/storage/${auth.user.image}`}
                          alt={auth.user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-purple-200 dark:border-purple-700/30"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <BuildingIcon className="h-6 w-6" style={{ color: primaryColor }} />
                      </div>
                    )}
                    <div>
                      <div className="text-lg font-medium truncate max-w-[200px]">{auth.user.name}</div>
                      <div className="text-sm text-muted-foreground">{t("complete_profile")}</div>
                      {/* Estado de verificación de correo */}
                      {auth.user?.email_verified_at === null ? (
                        <div className="flex items-center gap-1 text-xs text-red-600 mt-0.5">
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-6 6M9 9l6 6" />
                          </svg>
                          {t("email_not_verified")}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
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
                    </div>
                  </div>

                  {/* Botón de editar */}
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "gap-1 w-full mt-0",
                      "border-purple-200 dark:border-purple-700",
                      "text-[#7c28eb] dark:text-white",
                      "hover:bg-purple-50 dark:hover:bg-purple-900/30",
                      "hover:border-[#7c28eb] dark:hover:border-purple-500",
                      "hover:text-[#6620c5] dark:hover:text-white",
                      "transition-all duration-300",
                      "cursor-pointer"
                    )}
                    asChild
                  >
                    <Link href={"/settings/profile"} className="flex items-center justify-center">
                      <BuildingIcon className="h-4 w-4 mr-1" />
                      {t("edit_profile")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Título de las ofertas con animación */}
          <motion.div 
            className="px-2 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-2 text-[#7c28eb] dark:text-purple-300">
              {t("your_job_listings")}
            </h2>
            <p className="text-muted-foreground">{t("manage_current_postings")}</p>
          </motion.div>

          {/* Mostrar ofertas en el grid con animación */}
          {companyOffers && companyOffers.length > 0 ? (
            <motion.div 
              className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {companyOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  variants={itemVariants}
                  className={cn(
                    "relative overflow-hidden rounded-xl border p-4 flex flex-col transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:scale-[1.01]",
                    borderColor,
                    "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
                    "hover:bg-purple-50/70 dark:hover:bg-purple-900/15",
                  )}
                >
                  {/* Elemento decorativo ámbar */}
                  <div
                    className="absolute top-0 right-0 w-12 h-1 rounded-bl"
                    style={{ backgroundColor: accentColor }}
                  />

                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2 text-[#7c28eb] dark:text-purple-300">
                      {offer.name}
                    </h3>
                    <span
                      className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
                      style={{
                        backgroundColor: `${accentColor}20`,
                        color: accentDarkColor,
                      }}
                    >
                      {offer.category}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {t("posted")}: {new Date(offer.created_at).toLocaleDateString()}
                  </p>

                  <p className="text-sm line-clamp-3 mb-4 flex-grow">{offer.description}</p>

                  <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <BriefcaseIcon className="size-3.5" style={{ color: primaryLightColor }} />
                      <span>{offer.contract_type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="size-3.5" style={{ color: primaryLightColor }} />
                      <span>{offer.job_location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="size-3.5" style={{ color: primaryLightColor }} />
                      {(() => {
                        const closingDate = new Date(offer.closing_date)
                        const currentDate = new Date()
                        const daysLeft = Math.ceil(
                          (closingDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
                        )

                        return (
                          <span className={daysLeft < 3 ? "text-red-500 font-medium" : ""}>
                            {t("closed_in")}:{" "}
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

                  <div className="flex flex-col gap-2 w-full">
                    {/* Botón View Details */}
                    <Button
                      className="w-full text-white relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      asChild
                    >
                      <Link href={route("offer.show", offer.id)} className="flex items-center justify-center gap-1.5">
                        {t("view_details")}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-3.5"
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer"></span>
                      </Link>
                    </Button>

                    {/* Segunda fila: Edit y Delete */}
                    <div className="flex flex-wrap gap-2 w-full">
                      {/* Edit Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "flex-1 min-w-[80px] text-sm rounded-full transition-all duration-300",
                          "border-purple-300/30 dark:border-purple-400/20",
                          "hover:bg-purple-500/10 hover:border-purple-500/50",
                          "dark:hover:bg-purple-500/10 hover:text-purple-600",
                        )}
                        style={{ color: primaryColor }}
                        asChild
                      >
                        <Link
                          href={route("company.edit-job", offer.id)}
                          className="flex items-center justify-center gap-1.5"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0-2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          {t("edit")}
                        </Link>
                      </Button>

                      {/* Delete Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 min-w-[80px] text-sm rounded-full border-red-300/30 dark:border-red-400/20 hover:bg-red-500/10 hover:border-red-500/50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <span className="flex items-center justify-center gap-1.5">
                              <TrashIcon className="size-3.5" />
                              {t("delete")}
                            </span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                          className={cn(borderColor, "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md")}
                        >
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("are_you_sure")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("delete_confirmation")}
                              <span className="font-semibold"> "{offer.name}"</span> {t("and_remove_applications")}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                              onClick={() => {
                                router.delete(route("offers.destroy", offer.id), {
                                  onSuccess: () => {
                                    showToast.success(t("job_deleted_success"))
                                  },
                                  onError: () => {
                                    showToast.error(t("job_deleted_error"))
                                  },
                                })
                              }}
                            >
                              {t("delete")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Card para añadir nueva oferta */}
              <motion.div
                variants={itemVariants}
                className={cn(
                  "relative overflow-hidden rounded-xl border p-4 flex flex-col justify-center items-center min-h-[250px] transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:scale-[1.02]",
                  borderColor,
                  "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
                )}
              >
                <PlusCircleIcon className="h-10 w-10 mb-2" style={{ color: `${primaryColor}80` }} />
                <h3 className="font-medium text-lg mb-1 text-[#7c28eb] dark:text-purple-300">{t("create_new_job")}</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">{t("add_job_opportunity")}</p>
                <Button
                  className="relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  asChild
                >
                  <Link href={route("company.create-job")}>
                    {t("create_job_listing")}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer"></span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            // Si no hay ofertas publicadas por la empresa
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={cn(
                "relative p-8 overflow-hidden rounded-xl border text-center my-6 transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30",
                borderColor,
                "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
              )}
            >
              <div className="flex flex-col items-center gap-2 relative z-10">
                <BuildingIcon className="h-12 w-12 mb-2" style={{ color: `${primaryColor}60` }} />
                <h2 className="text-xl font-semibold text-[#7c28eb] dark:text-purple-300">
                  {t("no_job_listings_yet")}
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">{t("no_job_listings_message")}</p>
                <Button
                  className="gap-1 text-white relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  asChild
                >
                  <Link href={route("company.create-job")} className="flex items-center justify-center">
                    <PlusCircleIcon className="h-4 w-4 mr-1" />
                    {t("create_first_job")}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer"></span>
                  </Link>
                </Button>
              </div>
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5" />
            </motion.div>
          )}
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
