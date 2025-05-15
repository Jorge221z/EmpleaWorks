"use client"

import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, SharedData } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import { CalendarIcon, MapPinIcon, BriefcaseIcon, ArrowRightIcon, SearchIcon, Sparkles, Zap } from "lucide-react"
import type { Offer } from "@/types/types"
import SearchBar from "@/SearchBar/SearchBar"
import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { Toaster, showToast } from "@/components/toast"
import { useTranslation } from "@/utils/i18n"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface DashboardProps {
    offers?: Offer[]
    categories?: string[]
    contractTypes?: string[]
}

export default function Dashboard({ offers = [], categories = [], contractTypes = [] }: DashboardProps) {
    // ----- HOOKS & STATE -----
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props
    const { auth } = usePage<SharedData>().props
    const { t } = useTranslation()
    const isAuthenticated = !!auth.user
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // ----- COLOR THEMING SYSTEM -----
    // Colores principales (púrpura)
    const primaryColor = "#7c28eb"
    const primaryHoverColor = "#6620c5"
    const primaryLightColor = "#9645f4"

    // Colores de acento (ámbar)
    const accentColor = "#FDC231"
    const accentDarkColor = "#E3B100"

    // ----- TAILWIND CLASS MODIFIERS -----
    const borderColor = "border-purple-100 dark:border-purple-600/30"

    // ----- DATA MANAGEMENT -----
    const sortedOffers = useMemo(() => {
        // Ordenar las ofertas por fecha de creación (de más reciente a más antigua)
        return [...offers].sort((a, b) => {
            const dateA = new Date(a.created_at)
            const dateB = new Date(b.created_at)
            return dateB.getTime() - dateA.getTime()
        })
    }, [offers])

    const [filteredOffers, setFilteredOffers] = useState<Offer[]>(sortedOffers)
    const [isSearching, setIsSearching] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)

    const availableCategories = useMemo(() => {
        if (categories.length > 0) return categories
        return [...new Set(offers.map((offer) => offer.category).filter(Boolean))]
    }, [categories, offers])

    const availableContractTypes = useMemo(() => {
        if (contractTypes.length > 0) return contractTypes
        return [...new Set(offers.map((offer) => offer.contract_type).filter(Boolean))]
    }, [contractTypes, offers])

    // ----- EVENT HANDLERS -----
    const navigateToLogin = () => {
        window.location.href = route("login")
    }

    const navigateToRegister = () => {
        window.location.href = route("register")
    }

    const handleFilteredResults = useCallback(
        (results: Offer[]) => {
            if (results.length !== sortedOffers.length) {
                setIsSearching(true)
                setTimeout(() => setIsSearching(false), 300)
            }
            setFilteredOffers(results)
        },
        [sortedOffers.length],
    )

    // ----- SIDE EFFECTS -----
    useEffect(() => {
        if (flash && flash.success) {
            showToast.success(flash.success)
        }
        if (flash && flash.error) {
            showToast.error(flash.error)
        }
    }, [flash])

    useEffect(() => {
        setFilteredOffers(sortedOffers)
    }, [sortedOffers])

    // Simulate initial loading
    useEffect(() => {
        if (initialLoading && offers.length > 0) {
            setTimeout(() => {
                setInitialLoading(false)
            }, 1500)
        }
    }, [initialLoading, offers.length])

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
                // Store the current device pixel ratio
                const dpr = window.devicePixelRatio || 1

                // Set the canvas size in CSS pixels
                canvas.style.width = `${container.offsetWidth}px`
                canvas.style.height = `${container.offsetHeight}px`

                // Set the canvas size in actual pixels
                canvas.width = container.offsetWidth * dpr
                canvas.height = container.offsetHeight * dpr

                // Scale the context to ensure correct drawing operations
                ctx.scale(dpr, dpr)
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
                if (!canvas) throw new Error("Canvas is not available")
                // Use CSS dimensions for positioning (not the scaled canvas dimensions)
                const width = Number.parseInt(canvas.style.width || "0", 10)
                const height = Number.parseInt(canvas.style.height || "0", 10)

                this.x = Math.random() * width
                this.y = Math.random() * height
                this.size = Math.random() * 3 + 1
                this.speedX = Math.random() * 0.5 - 0.25
                this.speedY = Math.random() * 0.5 - 0.25

                // Purple color palette
                const colors = ["rgba(124, 40, 235, 0.4)", "rgba(150, 69, 244, 0.3)", "rgba(199, 157, 255, 0.5)"]
                this.color = colors[Math.floor(Math.random() * colors.length)]
            }

            update() {
                if (!canvas) return
                // Use CSS dimensions for boundaries
                const width = Number.parseInt(canvas.style.width || "0", 10)
                const height = Number.parseInt(canvas.style.height || "0", 10)

                this.x += this.speedX
                this.y += this.speedY

                if (this.x > width) this.x = 0
                else if (this.x < 0) this.x = width

                if (this.y > height) this.y = 0
                else if (this.y < 0) this.y = height
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
        const width = Number.parseInt(canvas.style.width || "0", 10)
        const height = Number.parseInt(canvas.style.height || "0", 10)
        const particleCount = Math.min(50, Math.floor((width * height) / 10000))

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle())
        }

        // Animation loop
        let animationFrameId: number

        const animate = () => {
            if (!ctx) return
            // Get current CSS dimensions
            const width = Number.parseInt(canvas.style.width || "0", 10)
            const height = Number.parseInt(canvas.style.height || "0", 10)

            ctx.clearRect(0, 0, width, height)

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
    }, [initialLoading])

    // ----- CONFIGURATION -----
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t("dashboard"),
            href: "/dashboard",
        },
    ]

    // ----- RENDER COMPONENT -----
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                {/* Sistema de notificaciones */}
                <Toaster />
                <Head title={t("dashboard")} />

                <div className="relative flex h-full flex-1 flex-col gap-4 p-4 overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br bg-[#fefbf2] dark:bg-[#0a0a0a] z-0">
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-[#fefbf2] dark:bg-[#0a0a0a]" />
                    </div>

                    {/* Content with glassmorphism effect */}
                    <div className="relative z-10">
                        {/* Banner de bienvenida para usuarios no autenticados */}
                        {!isAuthenticated && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative rounded-xl border p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-purple-100/50 dark:border-purple-500/20 mb-4 shadow-lg transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30"
                            >
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-2xl font-bold text-[#7c28eb] dark:text-purple-300 flex items-center gap-2">
                                            {t("welcome_title")}
                                            <Zap className="h-5 w-5 text-[#FDC231] animate-pulse" />
                                        </h2>
                                        <p className="text-muted-foreground max-w-xl">{t("welcome_subtitle")}</p>
                                        <div className="flex gap-3 mt-3">
                                            <Button
                                                variant="default"
                                                onClick={navigateToLogin}
                                                className="relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">{t("sign_in")}</span>
                                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer pointer-events-none"></span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={navigateToRegister}
                                                className="border-purple-100 dark:border-purple-600/30 hover:text-[#7c28eb] hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all duration-300 cursor-pointer"
                                            >
                                                {t("create_account")}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="hidden md:block relative w-80 h-48 -mr-8 -mt-4 -mb-4">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#7c28eb]/10 to-[#FDC231]/10 rounded-lg">
                                            {/* Fondo con patrón de puntos */}
                                            <div className="absolute top-0 left-0 w-full h-full">
                                                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                                    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                                                        <circle cx="2" cy="2" r="1" fill="#7c28eb" opacity="0.2" />
                                                    </pattern>
                                                    <rect width="100%" height="100%" fill="url(#dots)" />
                                                </svg>
                                            </div>

                                            {/* Ilustración creativa de búsqueda de empleo */}
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                                                <svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                                    <defs>
                                                        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#7c28eb" stopOpacity="0.9" />
                                                            <stop offset="100%" stopColor="#9645f4" stopOpacity="0.9" />
                                                        </linearGradient>
                                                        <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#FDC231" stopOpacity="0.9" />
                                                            <stop offset="100%" stopColor="#E3B100" stopOpacity="0.9" />
                                                        </linearGradient>
                                                        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                                                            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.9" />
                                                        </linearGradient>
                                                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                            <feGaussianBlur stdDeviation="3" result="blur" />
                                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                                        </filter>
                                                    </defs>

                                                    {/* Línea de conexión central */}
                                                    <path
                                                        d="M30,70 C60,20 180,120 210,70"
                                                        stroke="url(#purpleGrad)"
                                                        strokeWidth="2"
                                                        strokeDasharray="4 2"
                                                        fill="none"
                                                        className="animate-dash"
                                                    />

                                                    {/* Gráfico de crecimiento */}
                                                    <path
                                                        d="M40,100 L60,80 L80,85 L100,65 L120,60 L140,50 L160,30"
                                                        stroke="url(#yellowGrad)"
                                                        strokeWidth="3"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="animate-draw"
                                                    />
                                                    <circle cx="40" cy="100" r="4" fill="url(#yellowGrad)" className="animate-pulse-slow" />
                                                    <circle cx="60" cy="80" r="4" fill="url(#yellowGrad)" className="animate-pulse-slow" />
                                                    <circle cx="80" cy="85" r="4" fill="url(#yellowGrad)" className="animate-pulse-slow" />
                                                    <circle cx="100" cy="65" r="4" fill="url(#yellowGrad)" className="animate-pulse-slow" />
                                                    <circle cx="120" cy="60" r="4" fill="url(#yellowGrad)" className="animate-pulse-slow" />
                                                    <circle cx="140" cy="50" r="4" fill="url(#yellowGrad)" className="animate-pulse-slow" />
                                                    <circle cx="160" cy="30" r="4" fill="url(#yellowGrad)" className="animate-pulse-slow" />

                                                    {/* Elementos de búsqueda de empleo */}
                                                    {/* Maletín */}
                                                    <g filter="url(#glow)" className="animate-float-slow">
                                                        <rect x="30" y="50" width="30" height="24" rx="4" fill="url(#purpleGrad)" />
                                                        <rect x="42" y="44" width="6" height="6" rx="2" fill="url(#purpleGrad)" />
                                                        <rect x="36" y="50" width="18" height="2" fill="#FDC231" />
                                                    </g>

                                                    {/* Documento/CV */}
                                                    <g filter="url(#glow)" className="animate-float-medium">
                                                        <rect
                                                            x="180"
                                                            y="40"
                                                            width="20"
                                                            height="26"
                                                            rx="2"
                                                            fill="white"
                                                            stroke="url(#purpleGrad)"
                                                            strokeWidth="1.5"
                                                        />
                                                        <path d="M185 48H195" stroke="#7c28eb" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M185 53H193" stroke="#7c28eb" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M185 58H190" stroke="#7c28eb" strokeWidth="1.5" strokeLinecap="round" />
                                                        <circle
                                                            cx="190"
                                                            cy="35"
                                                            r="8"
                                                            fill="url(#yellowGrad)"
                                                            opacity="0.8"
                                                            className="animate-pulse-slow"
                                                        />
                                                    </g>

                                                    {/* Lupa de búsqueda */}
                                                    <g filter="url(#glow)" className="animate-float-fast">
                                                        <circle cx="120" cy="90" r="15" fill="none" stroke="url(#blueGrad)" strokeWidth="3" />
                                                        <path d="M132 102L140 110" stroke="url(#blueGrad)" strokeWidth="3" strokeLinecap="round" />
                                                    </g>

                                                    {/* Personas/Conexiones */}
                                                    <g className="animate-float-medium">
                                                        <circle cx="70" cy="110" r="8" fill="url(#purpleGrad)" />
                                                        <circle cx="90" cy="110" r="8" fill="url(#yellowGrad)" />
                                                        <circle cx="110" cy="110" r="8" fill="url(#blueGrad)" />
                                                        <path d="M78 110H82" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M98 110H102" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                                    </g>

                                                    {/* Estrellas/Logros */}
                                                    <path
                                                        d="M200 90L203 96L210 97L203 99L200 105L197 99L190 97L197 96L200 90Z"
                                                        fill="url(#yellowGrad)"
                                                        className="animate-spin-slow"
                                                    />
                                                    <path
                                                        d="M50 30L52 34L57 35L52 36L50 40L48 36L43 35L48 34L50 30Z"
                                                        fill="url(#yellowGrad)"
                                                        className="animate-spin-slow"
                                                    />
                                                    <path
                                                        d="M150 110L152 114L157 115L152 116L150 120L148 116L143 115L148 114L150 110Z"
                                                        fill="url(#yellowGrad)"
                                                        className="animate-spin-slow"
                                                    />

                                                    {/* Destellos */}
                                                    <circle cx="40" cy="70" r="2" fill="#FDC231" className="animate-pulse-fast" />
                                                    <circle cx="180" cy="80" r="2" fill="#FDC231" className="animate-pulse-fast" />
                                                    <circle cx="100" cy="40" r="2" fill="#FDC231" className="animate-pulse-fast" />
                                                    <circle cx="140" cy="120" r="2" fill="#FDC231" className="animate-pulse-fast" />
                                                    <circle cx="210" cy="50" r="2" fill="#FDC231" className="animate-pulse-fast" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7c28eb] via-[#9645f4] to-[#FDC231]"></div>
                            </motion.div>
                        )}

                        {/* Cabecera de la sección de ofertas */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="px-2 mb-4"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold text-[#7c28eb] dark:text-purple-300">{t("recent_jobs")}</h2>
                                
                            </div>
                            <p className="text-muted-foreground max-w-2xl">{t("explore_opportunities")}</p>
                        </motion.div>

                        {/* Barra de búsqueda y filtros */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-6 relative"
                        >
                            <div className="absolute -left-1 top-6 bottom-6 w-1.5 rounded-full bg-gradient-to-b from-[#FDC231] to-[#E3B100]"></div>

                            <div
                                className={cn(
                                    "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl p-5 shadow-lg ml-2 border transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30",
                                    borderColor,
                                )}
                            >
                                <SearchBar
                                    data={sortedOffers}
                                    onFilteredResults={handleFilteredResults}
                                    categories={availableCategories}
                                    contractTypes={availableContractTypes}
                                    primaryColor={primaryColor}
                                    accentColor={accentColor}
                                />
                            </div>
                        </motion.div>

                        {/* Listado de ofertas de empleo */}
                        <AnimatePresence mode="wait">
                            {initialLoading ? (
                                <motion.div
                                    key="initial-loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-center items-center py-12"
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative w-16 h-16">
                                            <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-800/30 opacity-25"></div>
                                            <div className="absolute inset-0 rounded-full border-4 border-t-[#7c28eb] dark:border-t-purple-400 animate-spin"></div>
                                        </div>
                                        <p className="text-muted-foreground">{t("loading_offers")}</p>
                                    </div>
                                </motion.div>
                            ) : isSearching ? (
                                <motion.div
                                    key="searching"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-center items-center py-12"
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative w-16 h-16">
                                            <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-800/30 opacity-25"></div>
                                            <div className="absolute inset-0 rounded-full border-4 border-t-[#7c28eb] dark:border-t-purple-400 animate-spin"></div>
                                        </div>
                                        <p className="text-muted-foreground">{t("searching")}</p>
                                    </div>
                                </motion.div>
                            ) : filteredOffers && filteredOffers.length > 0 ? (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid auto-rows-min gap-4 sm:grid-cols-2 md:grid-cols-3"
                                >
                                    {filteredOffers.map((offer) => (
                                        <motion.div
                                            key={offer.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                            className={cn(
                                                "relative overflow-hidden rounded-xl border p-4 flex flex-col transition-colors duration-200",
                                                borderColor,
                                                "bg-white dark:bg-gray-900",
                                                "hover:bg-purple-50/70 dark:hover:bg-purple-900/15",
                                            )}
                                        >
                                            {/* Elemento decorativo ámbar */}
                                            <div
                                                className="absolute top-0 right-0 w-12 h-1 rounded-bl"
                                                style={{ backgroundColor: accentColor }}
                                            />

                                            {/* Encabezado de la tarjeta */}
                                            <div className="flex justify-between items-start mb-2">
                                                <Link
                                                    href={route("offer.show", offer.id)}
                                                    className="font-semibold text-lg line-clamp-2 text-[#7c28eb] dark:text-purple-300 hover:text-[#6620c5] dark:hover:text-purple-200 transition-colors"
                                                >
                                                    {offer.name}
                                                </Link>
                                                <span
                                                    className="text-xs px-2 py-1 rounded-full"
                                                    style={{
                                                        backgroundColor: `${accentColor}20`,
                                                        color: accentDarkColor,
                                                    }}
                                                >
                                                    {offer.category}
                                                </span>
                                            </div>

                                            {/* Información de la empresa */}
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
                                                    style={{ color: accentColor }}
                                                >
                                                    <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"></path>
                                                    <path d="M18 5V3a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path>
                                                    <path d="M21 5H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                                                </svg>
                                                <span>{offer.company ? (offer.company as any).name : t("company_not_available")}</span>
                                            </p>

                                            {/* Descripción de la oferta */}
                                            <p className="text-sm line-clamp-3 mb-4 flex-grow">{offer.description}</p>

                                            {/* Detalles adicionales de la oferta */}
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

                                            {/* Botón de acción */}
                                            <div className="flex justify-end mt-auto">
                                                <Link
                                                    href={route("offer.show", offer.id)}
                                                    className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                                        "border border-purple-200 dark:border-purple-700",
                                                        "text-[#7c28eb] dark:text-white",
                                                        "hover:bg-purple-50 dark:hover:bg-purple-900/30",
                                                        "hover:border-[#7c28eb] dark:hover:border-purple-500",
                                                        "hover:text-[#6620c5] dark:hover:text-white",
                                                    )}
                                                    title={t("view_details")}
                                                >
                                                    {t("view_details")}
                                                    <ArrowRightIcon className="size-4" />
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : // Estados alternativos: sin resultados o sin datos
                                filteredOffers.length === 0 ? (
                                    <motion.div
                                        key="no-results"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl border border-purple-100/50 dark:border-purple-500/20 shadow-lg"
                                    >
                                        <div className="inline-flex p-4 rounded-full bg-amber-100/50 dark:bg-amber-900/30 mb-4">
                                            <SearchIcon className="h-8 w-8 text-[#FDC231]" />
                                        </div>
                                        <div className="text-xl font-medium mb-2 text-[#7c28eb] dark:text-purple-300">
                                            {t("no_offers_found")}
                                        </div>
                                        <p className="text-muted-foreground max-w-md mx-auto">{t("try_other_terms")}</p>
                                    </motion.div>
                                ) : (
                                    // Estado de "No hay ofertas disponibles" cuando no hay datos iniciales
                                    <motion.div
                                        key="no-data"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid auto-rows-min gap-4 md:grid-cols-3"
                                    >
                                        {[1, 2, 3].map((i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.1 * i }}
                                                className={cn(
                                                    "relative aspect-video overflow-hidden rounded-xl border",
                                                    borderColor,
                                                    "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
                                                )}
                                            >
                                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                                {i === 1 && (
                                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                                        {t("no_offers_available")}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                        </AnimatePresence>
                    </div>
                </div>
            </AppLayout>
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
                
                .bg-grid-pattern {
                  background-image: radial-gradient(rgba(124, 40, 235, 0.1) 1px, transparent 1px);
                  background-size: 12px 12px;
                }
                
                @keyframes float {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(-5px); }
                  100% { transform: translateY(0px); }
                }
                
                .animate-float {
                  animation: float 4s ease-in-out infinite;
                }
                
                .animate-float-delayed {
                  animation: float 4s ease-in-out 1s infinite;
                }
                
                .animate-float-more-delayed {
                  animation: float 4s ease-in-out 2s infinite;
                }

                @keyframes pulse-slow {
                  0% { opacity: 0.6; transform: scale(1); }
                  50% { opacity: 0.8; transform: scale(1.05); }
                  100% { opacity: 0.6; transform: scale(1); }
                }

                @keyframes pulse-slower {
                  0% { opacity: 0.7; transform: scale(1); }
                  50% { opacity: 0.9; transform: scale(1.1); }
                  100% { opacity: 0.7; transform: scale(1); }
                }

                @keyframes pulse-fast {
                  0% { opacity: 0.5; }
                  50% { opacity: 1; }
                  100% { opacity: 0.5; }
                }

                @keyframes spin-slow {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }

                .animate-pulse-slow {
                  animation: pulse-slow 4s ease-in-out infinite;
                }

                .animate-pulse-slower {
                  animation: pulse-slower 6s ease-in-out infinite;
                }

                .animate-pulse-fast {
                  animation: pulse-fast 2s ease-in-out infinite;
                }

                @keyframes spin-slow {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }

                .animate-spin-slow {
                  animation: spin-slow 12s linear infinite;
                }

                .animate-float-slow {
                  animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </>
    )
}