"use client"

import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import { useEffect, useRef, useState } from "react"
import { CalendarIcon, MapPinIcon, BriefcaseIcon, BookmarkIcon } from "lucide-react"
import type { Offer } from "@/types/types"
import { Toaster, showToast } from "@/components/toast"
import { useTranslation } from "@/utils/i18n"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import axios from "axios"

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

export default function SavedOffersView({ 
  savedOffers: initialSavedOffers = [] 
}: { 
  savedOffers?: Offer[];
}) {
  // ----- HOOKS & STATE -----
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [savedOffers, setSavedOffers] = useState(initialSavedOffers);
  const [isSubmitting, setIsSubmitting] = useState<number | null>(null)

  // ----- COLOR THEMING SYSTEM -----
  // Colores principales (púrpura)
  const primaryColor = "#7c28eb"
  const primaryLightColor = "#9645f4"

  // ----- TAILWIND CLASS MODIFIERS -----
  const borderColor = "border-purple-100/50 dark:border-purple-600/30"
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

  // Particle animation effect (código de animación existente)
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
      href: route("candidate.dashboard"),
    },
    {
      title: t("saved_offers"),
      href: route("candidate.saved-offers"),
    }
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
      <Head title={t("saved_offers")} />

      <div className="flex h-full flex-1 flex-col gap-4 p-4 bg-[#FEFBF2] dark:bg-transparent relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FEFBF2] via-[#FEFBF2] to-[#F8F0DD] dark:bg-[#0a0a0a] z-0">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full dark:bg-[#0a0a0a]" />
        </div>

        {/* Content with glassmorphism effect */}
        <div className="relative z-10 px-2">
          <motion.div
            className="px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-[#7c28eb] dark:text-purple-300">{t("saved_offers")}</h2>
              <BookmarkIcon className="h-5 w-5 text-[#9645f4]" />
            </div>
            <p className="text-muted-foreground">{t("jobs_saved_for_later")}</p>
          </motion.div>

          {/* Lista de Ofertas Guardadas */}
          {savedOffers && savedOffers.length > 0 ? (
            <motion.div
              className="flex flex-col gap-4 mt-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {savedOffers.map((offer, index) => (
                <motion.div
                  key={`saved-${offer.id}`}
                  variants={itemVariants}
                  custom={index}
                  className={cn(
                    "relative overflow-hidden rounded-xl border p-4 flex flex-col md:flex-row md:items-center md:gap-4",
                    "transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:scale-[1.01]",
                    borderColor,
                    cardBgColor,
                    cardHoverBgColor,
                  )}
                >
                  <div
                    className="absolute top-0 right-0 w-12 h-1 rounded-bl"
                    style={{ backgroundColor: primaryLightColor }}
                  />

                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <Link
                        href={route("offer.show", offer.id)}
                        className="font-semibold text-lg text-[#7c28eb] dark:text-purple-300 hover:text-[#6620c5] dark:hover:text-purple-200 transition-colors"
                      >
                        {offer.name}
                      </Link>
                      <span
                        className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
                        style={{
                          backgroundColor: `${primaryColor}20`,
                          color: primaryColor,
                        }}
                      >
                        {offer.category}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
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
                        style={{ color: primaryColor }}
                      >
                        <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"></path>
                        <path d="M18 5V3a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path>
                        <path d="M21 5H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                      </svg>
                      <span>{offer.company ? (offer.company as any).name : t("company_not_available")}</span>
                    </p>

                    <p className="text-sm mb-4 line-clamp-2">{offer.description}</p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="flex flex-wrap md:flex-col gap-3 md:gap-1 text-xs text-muted-foreground">
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
                            (closingDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
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

                    <div className="flex flex-col gap-2 self-end md:self-center mt-4 md:mt-0">
                      {/* Acciones para ofertas guardadas */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                        {/* Botón de aplicar a la oferta */}
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-1.5 text-sm w-full relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300"
                          asChild
                        >
                          <Link href={route("apply.form", offer.id)}>
                            <span className="relative z-10">{t("apply")}</span>
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer"></span>
                          </Link>
                        </Button>

                        {/* Botón para eliminar de guardados */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={cn(
                            "gap-1.5 text-sm w-full cursor-pointer",
                            "border-purple-200 dark:border-purple-700",
                            "text-[#7c28eb] dark:text-white",
                            "hover:bg-purple-50 dark:hover:bg-purple-900/30",
                            "hover:border-[#7c28eb] dark:hover:border-purple-500",
                            "hover:text-[#6620c5] dark:hover:text-white",
                            "transition-all duration-300",
                          )}
                          onClick={() => handleUnsave(offer.id)}
                          disabled={isSubmitting === offer.id}
                        >
                          {isSubmitting === offer.id ? (
                            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <BookmarkIcon className="size-3.5 fill-current" />
                          )}
                          {isSubmitting === offer.id ? t("removing") : t("unsave")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Estado vacío cuando no hay ofertas guardadas
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={cn(
                "relative p-8 overflow-hidden rounded-xl border text-center my-6",
                borderColor,
                cardBgColor,
              )}
            >
              <div className="flex flex-col items-center gap-2 relative z-10">
                <BookmarkIcon className="h-12 w-12 mb-2 text-muted-foreground" style={{ color: `${primaryColor}60` }} />
                <h2 className="text-xl font-semibold text-[#7c28eb] dark:text-purple-300">
                  {t("no_saved_offers_yet")}
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">{t("no_saved_offers_message")}</p>
                <Button
                  className="relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <Link 
                    href={route("dashboard")} 
                    className="w-full h-full absolute inset-0 z-10"
                    aria-label={t("browse_to_save_jobs")}
                  />
                  <div className="flex items-center gap-2 pointer-events-none">
                    {t("browse_to_save_jobs")}
                  </div>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer pointer-events-none"></span>
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