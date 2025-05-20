"use client"

import AppLayout from "@/layouts/app-layout"
import { Head, Link, usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"
import { BriefcaseIcon, CalendarIcon, MapPinIcon, BuildingIcon, MailIcon, GlobeIcon, ArrowLeftIcon, BookmarkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { BreadcrumbItem } from "@/types"
import type { ShowOfferProps } from "@/types/types"
import { Toaster, showToast } from "@/components/toast"
import { useTranslation } from "@/utils/i18n"
import { cn } from "@/lib/utils"
import axios from "axios"

export default function ShowOffer({ offer }: ShowOfferProps) {
  // ----- HOOKS & STATE -----
  const { flash, auth } = usePage<{ flash: { success?: string; error?: string }, auth: { user?: { role_id: number, email_verified_at?: string } } }>().props
  const { t } = useTranslation()
  const { company } = offer
  const isAuthenticated = !!auth.user;
  const isCandidate = isAuthenticated && auth.user?.role_id === 1;
  const isVerified = isAuthenticated && auth.user?.email_verified_at !== null;
  const [isSaved, setIsSaved] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // ----- COLOR THEMING SYSTEM -----
  // Colores principales (púrpura)
  const primaryColor = "#7c28eb"
  const primaryHoverColor = "#6620c5"
  const primaryLightColor = "#9645f4"

  // Colores de acento (ámbar)
  const accentColor = "#FDC231"

  // Clases para el tema
  const borderColor = "border-purple-100 dark:border-purple-600/30"
  const bgAccentColor = "bg-purple-50/50 dark:bg-purple-950/20"

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
  ]

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

  // Comprobar estado de guardado y aplicado
  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated && isCandidate && isVerified) {
        try {
          // Verificar estado guardado
          const savedResponse = await axios.get(route('saved.offers'), {
            withCredentials: true,
            headers: {
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            }
          });
          
          const savedOffers = savedResponse.data.savedOffers || [];
          setIsSaved(savedOffers.some((savedOffer: { id: number }) => savedOffer.id === offer.id));
          
          // Verificar si ha aplicado
          const appliedResponse = await axios.get(route('candidate.applications.check', offer.id), {
            withCredentials: true,
            headers: {
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            }
          });
          
          setHasApplied(appliedResponse.data.hasApplied || false);
        } catch (error) {
          console.error('Error checking status:', error);
        }
      } else {
        setIsSaved(false);
        setHasApplied(false);
      }
    };
    
    checkStatus();
  }, [isAuthenticated, isCandidate, isVerified, offer.id]);

  // Actualizar el estado de guardado
  const toggleSaveOffer = async () => {
    if (!isAuthenticated) {
      window.location.href = route('login')
      return
    }

    if (!isCandidate) {
      showToast.error(t('only_candidates_can_save'))
      return
    }
    
    // Comprobar si ya ha aplicado
    if (hasApplied) {
      showToast.error(t('cannot_save_applied_offer'))
      return
    }

    try {
      setIsToggling(true)
      await axios.post(route('offer.save.toggle', offer.id))
      setIsSaved(!isSaved)
      showToast.success(isSaved ? t('offer_removed_from_saved') : t('offer_saved_success'))
    } catch (error) {
      // Gestionar error específico de oferta aplicada
      if (axios.isAxiosError(error) && error.response?.data?.message === 'cannot_save_applied_offer') {
        showToast.error(t('cannot_save_applied_offer'))
      } else {
        console.error('Error toggling saved status:', error)
        showToast.error(t('operation_failed'))
      }
    } finally {
      setIsToggling(false)
    }
  }

  // ----- RENDER COMPONENT -----
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Toaster />
      <Head title={`${offer.name} - EmpleaWorks`} />

      {/* Contenedor principal */}
      <div className="relative flex h-full flex-1 flex-col gap-4 p-4 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FEFBF2] via-[#FEFBF2] to-[#F8F0DD] dark:bg-[#0a0a0a] z-0">
          <canvas id="particle-canvas" className="absolute inset-0 w-full h-full dark:bg-[#0a0a0a]" />
        </div>

        {/* Content with glassmorphism effect */}
        <div className="relative z-10">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mb-4 hover:text-foreground/80"
              style={{ color: primaryColor }}
            >
              <Link href={route("dashboard")}>
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                {t("back_to_offers")}
              </Link>
            </Button>

            <h1 className="text-2xl font-bold mb-2 text-[#7c28eb] dark:text-purple-300">{offer.name}</h1>
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
            <div className="lg:col-span-2 space-y-6">
              <Card
                className={cn(
                  "transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30",
                  borderColor,
                  "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
                )}
              >
                <CardHeader className={cn(bgAccentColor, "px-6 py-4")}>
                  <CardTitle className="text-[#7c28eb] dark:text-purple-300">{t("job_description")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="whitespace-pre-line">{offer.description}</p>
                </CardContent>
              </Card>

              <Card
                className={cn(
                  "transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30",
                  borderColor,
                  "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
                )}
              >
                <CardHeader className={cn(bgAccentColor, "px-6 py-4")}>
                  <CardTitle className="text-[#7c28eb] dark:text-purple-300">{t("job_details")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="flex items-center">
                      <div
                        className="size-9 flex items-center justify-center rounded-full mr-3"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <span className="text-lg font-bold text-[#9645f4] dark:text-[#c79dff]">D</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("required_degree")}</p>
                        <p className="font-medium">{offer.degree || t("not_specified")}</p>
                      </div>
                    </div>

                    <div className="flex items-center md:col-span-2">
                      <div
                        className="size-9 flex items-center justify-center rounded-full mr-3"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <MailIcon className="size-5 text-[#9645f4] dark:text-[#c79dff]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("contact_email")}</p>
                        <a
                          href={`mailto:${offer.email}`}
                          className="font-medium hover:underline text-[#7c28eb] dark:text-purple-300"
                        >
                          {offer.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    {isCandidate && isVerified && !hasApplied && (
                      <>
                        {/* Primera columna: Botón Guardar (solo si NO ha aplicado) */}
                        <div className="flex sm:col-span-1">
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-center",
                              isSaved ? "bg-purple-50 text-[#7c28eb] border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700" : 
                              "border-purple-100 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                            )}
                            onClick={toggleSaveOffer}
                            disabled={isToggling}
                          >
                            <BookmarkIcon className={cn(
                              "h-4 w-4 mr-2 transition-transform duration-300",
                              isSaved ? "text-[#7c28eb] dark:text-purple-300 fill-current" : "fill-none",
                              isToggling ? "animate-pulse" : ""
                            )} />
                            <span className="truncate">
                              {isSaved ? t('saved') : t('save_for_later')}
                            </span>
                          </Button>
                        </div>
                        
                        {/* Segunda columna: Botón Aplicar (solo si NO ha aplicado) */}
                        <div className="sm:col-span-1">
                          <Button
                            className="w-full justify-center relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300"
                            asChild
                          >
                            <Link href={route("apply.form", offer.id)}>
                              <span className="relative z-10 truncate">{t("apply_to_this_offer")}</span>
                              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer"></span>
                            </Link>
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Si ya ha aplicado, mostrar un solo botón de aplicado */}
                    {isCandidate && isVerified && hasApplied && (
                      <div className="sm:col-span-2">
                        <Button
                          variant="outline"
                          className="w-full justify-center border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300 cursor-default"
                          disabled={true}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="w-4 h-4 mr-2 flex-shrink-0"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          <span className="truncate">{t('applied')}</span>
                        </Button>
                      </div>
                    )}

                    {/* Para usuarios no verificados */}
                    {isCandidate && !isVerified && (
                      <div className="sm:col-span-2">
                        <Button
                          variant="outline"
                          className="w-full justify-center border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          onClick={() => window.location.href = route('verification.notice')}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="w-4 h-4 mr-2 flex-shrink-0"
                          >
                            <path d="M22 10.5V12c0 5-3.58 9-8 9s-8-4-8-9v-1.5" />
                            <path d="M6 8h12" />
                            <path d="M10 5V3" />
                            <path d="M14 5V3" />
                          </svg>
                          <span className="truncate">
                            {t('verify_email_to_save')}
                          </span>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card
                className={cn(
                  "transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30",
                  borderColor,
                  "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
                )}
              >
                <CardHeader className={cn(bgAccentColor, "px-6 py-4")}>
                  <CardTitle className="text-[#7c28eb] dark:text-purple-300">{t("about_company")}</CardTitle>
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

                  {company.description && (
                    <div>
                      <h4 className="font-medium mb-2 text-[#7c28eb] dark:text-purple-300">{t("description")}</h4>
                      <p className="text-sm text-muted-foreground">{company.description}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium mb-1 text-[#7c28eb] dark:text-purple-300">{t("contact")}</h4>

                    <div className="flex items-center">
                      <MailIcon className="size-4 mr-2 text-[#FDC231] dark:text-[#FFDE7A]" />
                      <a
                        href={`mailto:${company.email}`}
                        className="text-sm hover:underline text-[#7c28eb] dark:text-purple-300"
                      >
                        {company.email}
                      </a>
                    </div>

                    {company.web_link && (
                      <div className="flex items-center">
                        <GlobeIcon className="size-4 mr-2 text-[#FDC231] dark:text-[#FFDE7A]" />
                        <a
                          href={company.web_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline text-[#7c28eb] dark:text-purple-300"
                        >
                          {company.web_link.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}

                    {company.address && (
                      <div className="flex items-center">
                        <MapPinIcon className="size-4 mr-2 text-[#FDC231] dark:text-[#FFDE7A]" />
                        <span className="text-sm">{company.address}</span>
                      </div>
                    )}
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
