"use client"

import { useEffect } from "react"
import { Head, Link } from "@inertiajs/react"
import { UsersIcon, FileIcon, BriefcaseIcon, CalendarIcon } from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import { useTranslation } from "@/utils/i18n"
import type { BreadcrumbItem } from "@/types"
import { cn } from "@/lib/utils"

interface Applicant {
  id: number
  name: string
  email: string
  image: string | null
  cv: string | null
}

interface JobWithApplicants {
  id: number
  name: string
  category: string
  closing_date: string
  applicants: Applicant[]
  applicants_count: number
}

interface CompanyApplicantsProps {
  jobsWithApplicants: JobWithApplicants[]
}

export default function CompanyApplicants({ jobsWithApplicants = [] }: CompanyApplicantsProps) {
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

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t("company_dashboard"),
      href: "/company/dashboard",
    },
    {
      title: t("applicants"),
      href: "/company/applicants",
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t("applicants_by_job")} />

      <div className="relative flex h-full flex-1 flex-col gap-4 p-4 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FEFBF2] via-[#FEFBF2] to-[#F8F0DD] dark:bg-[#0a0a0a] z-0">
          <canvas id="particle-canvas" className="absolute inset-0 w-full h-full dark:bg-[#0a0a0a]" />
        </div>

        {/* Content with glassmorphism effect */}
        <div className="relative z-10">
          {/* Título de la página */}
          <div className="px-2 mb-4">
            <h2 className="text-2xl font-semibold mb-2 text-[#7c28eb] dark:text-purple-300">
              {t("applicants_by_job")}
            </h2>
            <p className="text-muted-foreground">{t("applications_to_jobs")}</p>
          </div>

          {jobsWithApplicants.length > 0 ? (
            <div className="grid gap-8">
              {jobsWithApplicants.map((job) => (
                <Card
                  key={job.id}
                  className={cn(
                    "overflow-hidden transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30",
                    borderColor,
                    "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
                  )}
                >
                  <CardHeader className={cn(bgAccentColor, "px-6 py-4")}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2 text-[#7c28eb] dark:text-purple-300">
                          <BriefcaseIcon className="h-5 w-5" style={{ color: primaryLightColor }} />
                          {job.name}
                        </CardTitle>
                        <CardDescription className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 dark:text-gray-300">
                          <Badge
                            className={cn(
                              "mt-1",
                              "bg-amber-100 text-amber-800 hover:bg-amber-200",
                              "dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/40",
                            )}
                          >
                            {job.category}
                          </Badge>
                          <span className="flex items-center gap-1 text-xs">
                            <CalendarIcon className="h-3.5 w-3.5" style={{ color: accentColor }} />
                            {new Date(job.closing_date).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge
                        className={cn(
                          "text-sm",
                          "bg-purple-100 text-purple-800 hover:bg-purple-200",
                          "dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/40",
                        )}
                      >
                        {job.applicants_count} {job.applicants_count === 1 ? t("candidate") : t("candidates")}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    {job.applicants.length > 0 ? (
                      <div className="space-y-4">
                        {job.applicants.map((applicant) => (
                          <div
                            key={applicant.id}
                            className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-purple-100 dark:border-purple-800/20 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              {/* Avatar del candidato */}
                              {applicant.image ? (
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-purple-100 dark:border-purple-800/20">
                                  <img
                                    src={`/storage/${applicant.image}`}
                                    alt={applicant.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: `${primaryColor}15` }}
                                >
                                  <UsersIcon className="h-5 w-5" style={{ color: primaryLightColor }} />
                                </div>
                              )}

                              {/* Información del candidato */}
                              <div>
                                <div className="font-medium text-sm">{applicant.name}</div>
                                <div className="text-xs text-muted-foreground">{applicant.email}</div>
                              </div>
                            </div>

                            {/* Botón para descargar CV */}
                            {applicant.cv ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  "gap-1 transition-all duration-300 hover:scale-[1.02]",
                                  "border-purple-200 dark:border-purple-700",
                                  "text-[#7c28eb] dark:text-white",
                                  "hover:bg-purple-50 dark:hover:bg-purple-900/30",
                                  "hover:border-[#7c28eb] dark:hover:border-purple-500",
                                  "hover:text-[#6620c5] dark:hover:text-white",
                                )}
                                asChild
                              >
                                <a href={`/storage/${applicant.cv}`} target="_blank" rel="noopener noreferrer" download>
                                  <FileIcon className="h-3.5 w-3.5" style={{ color: accentColor }} />
                                  {t("cv_download")}
                                </a>
                              </Button>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-xs border-purple-200 dark:border-purple-700 text-muted-foreground"
                              >
                                {t("no_cv_provided")}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <UsersIcon className="h-10 w-10 mb-2" style={{ color: `${primaryColor}60` }} />
                        <h3 className="font-medium text-lg text-[#7c28eb] dark:text-purple-300">
                          {t("no_applicants_yet")}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">{t("no_applicants_message")}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Mensaje si no hay ofertas con candidatos
            <div
              className={cn(
                "relative p-8 overflow-hidden rounded-xl border text-center my-6 transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30",
                borderColor,
                "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
              )}
            >
              <div className="flex flex-col items-center gap-2 relative z-10">
                <UsersIcon className="h-12 w-12 mb-2" style={{ color: `${primaryColor}60` }} />
                <h2 className="text-xl font-semibold text-[#7c28eb] dark:text-purple-300">
                  {t("no_applications_yet")}
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">{t("no_applications_message")}</p>
                <Button
                  className="relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  asChild
                >
                  <Link href={route("company.dashboard")}>
                    {t("back_to_dashboard")}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer"></span>
                  </Link>
                </Button>
              </div>
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5" />
            </div>
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
