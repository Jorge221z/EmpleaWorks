"use client"

import { useState, useEffect } from "react"
import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { useTranslation } from "@/utils/i18n"
import type { BreadcrumbItem } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Cookie, Sparkles, CheckCircle2, Shield, Book } from "lucide-react"
import { motion } from "framer-motion"

export default function Terms() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState("terms")
    const [activeSection, setActiveSection] = useState<string | null>(null)

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t("dashboard"),
            href: "/dashboard",
        },
        {
            title: activeTab === "terms" ? t("terms_and_conditions") : t("cookies_policy"),
            href: "/terms", // Fixed: Replaced route("terms") with a static route
        },
    ]

    // Handle scroll to highlight active section in table of contents
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("section[id]")
            let currentSection: string | null = null

            sections.forEach((section) => {
                const sectionTop = section.getBoundingClientRect().top
                if (sectionTop < 200) {
                    currentSection = section.id
                }
            })

            setActiveSection(currentSection)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll() // Initial check

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [activeTab])

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

    // Smooth scroll to section
    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId)
        if (section) {
            section.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={activeTab === "terms" ? t("terms_title") : t("cookies_title")} />

            <div className="relative flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/30 z-0">
                    <canvas
                        id="particle-canvas"
                        className="absolute inset-0 w-full h-full bg-[#FEFBF2] dark:bg-gray-900"
                    />
                </div>

                {/* Content with glassmorphism effect */}
                <div className="relative z-10 px-2">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold text-[#7c28eb] dark:text-purple-300">
                                {activeTab === "terms" ? t("terms_title") : t("cookies_title")}
                            </h2>
                            <Sparkles className="h-6 w-6 text-[#9645f4] animate-pulse" />
                        </div>
                        <p className="text-muted-foreground mb-8 max-w-2xl">
                            {activeTab === "terms" ? t("terms_subtitle") : t("cookies_subtitle")}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#FEFBF2] dark:bg-gray-900/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-purple-100/50 dark:border-purple-500/20"
                    >
                        {/* Tabs header with glassmorphism */}
                        <div className="border-b border-purple-100/70 dark:border-purple-600/30 p-2 bg-[#FEFBF2] dark:bg-purple-950/30 backdrop-blur-sm">
                            <Tabs defaultValue="terms" value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-1">
                                    <TabsTrigger
                                        value="terms"
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7c28eb]/90 data-[state=active]:to-[#9645f4]/90 data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:shadow-md px-2 sm:px-4 text-xs sm:text-sm rounded-md transition-all duration-300 data-[state=active]:scale-[1.02]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            <span className="hidden sm:inline">{t("terms_and_conditions")}</span>
                                            <span className="sm:hidden">Términos</span>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="cookies"
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7c28eb]/90 data-[state=active]:to-[#9645f4]/90 data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:shadow-md px-2 sm:px-4 text-xs sm:text-sm rounded-md transition-all duration-300 data-[state=active]:scale-[1.02]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Cookie className="h-4 w-4" />
                                            <span className="hidden sm:inline">{t("cookies_policy")}</span>
                                            <span className="sm:hidden">Cookies</span>
                                        </div>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <Tabs defaultValue="terms" value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsContent value="terms" className="p-6 md:p-8 relative">
                                <div className="prose dark:prose-invert max-w-none relative z-10">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                            className="md:w-64 lg:w-72 shrink-0"
                                        >
                                            <div className="md:sticky md:top-4">
                                                <div className="p-5 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-purple-100/50 dark:border-purple-500/20 mb-6 shadow-lg transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50">
                                                            <Book className="h-4 w-4 text-[#7c28eb] dark:text-purple-300" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-[#7c28eb] dark:text-purple-300">
                                                            {t("table_of_contents")}
                                                        </h3>
                                                    </div>
                                                    <nav className="space-y-1 text-sm">
                                                        {[
                                                            { id: "terminos-de-uso", title: t("terms_of_use"), number: 1 },
                                                            { id: "proteccion-de-datos", title: t("data_protection"), number: 2 },
                                                            { id: "uso-de-la-informacion", title: t("use_of_information"), number: 3 },
                                                            { id: "derechos-rgpd", title: t("gdpr_rights"), number: 4 },
                                                            { id: "retencion-de-datos", title: t("data_retention"), number: 5 },
                                                            { id: "seguridad", title: t("security"), number: 6 },
                                                            { id: "cookies", title: t("cookies_tracking"), number: 7 },
                                                            { id: "limitacion-de-responsabilidad", title: t("liability_limitation"), number: 8 },
                                                            { id: "modificaciones", title: t("modifications"), number: 9 },
                                                            { id: "ley-aplicable", title: t("applicable_law"), number: 10 },
                                                        ].map((section) => (
                                                            <button
                                                                key={section.id}
                                                                onClick={() => scrollToSection(section.id)}
                                                                className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-300 flex items-center gap-2 group ${activeSection === section.id
                                                                        ? "bg-gradient-to-r from-purple-100/80 to-purple-50/80 dark:from-purple-900/40 dark:to-purple-800/20 text-[#7c28eb] dark:text-purple-300 font-medium shadow-sm"
                                                                        : "hover:bg-purple-100/50 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] dark:hover:text-purple-300"
                                                                    }`}
                                                            >
                                                                <span
                                                                    className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ${activeSection === section.id
                                                                            ? "bg-[#7c28eb] text-white"
                                                                            : "bg-purple-100 dark:bg-purple-900/50 text-[#7c28eb] dark:text-purple-300 group-hover:bg-[#7c28eb] group-hover:text-white"
                                                                        } transition-colors duration-300`}
                                                                >
                                                                    {section.number}
                                                                </span>
                                                                <span>{section.title}</span>
                                                            </button>
                                                        ))}
                                                    </nav>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                            className="flex-1"
                                        >
                                            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl p-6 border border-purple-100/50 dark:border-purple-500/20 shadow-lg">
                                                <section id="terminos-de-uso" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
                                                            <FileText className="h-5 w-5 text-[#7c28eb] dark:text-purple-300" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300 flex items-center gap-2">
                                                                1. {t("terms_of_use")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("terms_of_use_text")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="proteccion-de-datos" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
                                                            <Shield className="h-5 w-5 text-[#7c28eb] dark:text-purple-300" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                2. {t("data_protection")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("data_protection_text")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="uso-de-la-informacion" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
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
                                                                className="text-[#7c28eb] dark:text-purple-300"
                                                            >
                                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                                                <polyline points="10 9 9 9 8 9"></polyline>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                3. {t("use_of_information")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("use_of_information_text")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="derechos-rgpd" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
                                                            <CheckCircle2 className="h-5 w-5 text-[#7c28eb] dark:text-purple-300" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                4. {t("gdpr_rights")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("gdpr_rights_text")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="retencion-de-datos" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
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
                                                                className="text-[#7c28eb] dark:text-purple-300"
                                                            >
                                                                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                                                                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                                                                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                                                                <line x1="6" y1="18" x2="6.01" y2="18"></line>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                5. {t("data_retention")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("data_retention_text")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="seguridad" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
                                                            <Shield className="h-5 w-5 text-[#7c28eb] dark:text-purple-300" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                6. {t("security")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("security_text")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="cookies" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
                                                            <Cookie className="h-5 w-5 text-[#7c28eb] dark:text-purple-300" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                7. {t("cookies_tracking")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>
                                                                    {t("cookies_tracking_text", {
                                                                        cookies_policy: (
                                                                            <button
                                                                                onClick={() => setActiveTab("cookies")}
                                                                                className="text-[#7c28eb] hover:underline font-medium border-0 bg-transparent p-0 cursor-pointer inline-flex items-center gap-1"
                                                                            >
                                                                                <Cookie className="h-3 w-3" />
                                                                                {t("cookies_policy")}
                                                                            </button>
                                                                        ),
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="limitacion-de-responsabilidad" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
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
                                                                className="text-[#7c28eb] dark:text-purple-300"
                                                            >
                                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                8. {t("liability_limitation")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("liability_limitation_text")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="modificaciones" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
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
                                                                className="text-[#7c28eb] dark:text-purple-300"
                                                            >
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                9. {t("modifications")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("modifications_text")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="ley-aplicable" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
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
                                                                className="text-[#7c28eb] dark:text-purple-300"
                                                            >
                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                10. {t("applicable_law")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("applicable_law_text")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="mt-10 pt-6 border-t border-purple-100 dark:border-purple-600/30">
                                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
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
                                                            className="text-[#9645f4]"
                                                        >
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                            <polyline points="12 6 12 12 16 14"></polyline>
                                                        </svg>
                                                        {t("last_update", { date: "30 de abril de 2025" })}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="cookies" className="p-6 md:p-8 relative">
                                <div className="prose dark:prose-invert max-w-none relative z-10">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                            className="md:w-64 lg:w-72 shrink-0"
                                        >
                                            <div className="md:sticky md:top-4">
                                                <div className="p-5 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-purple-100/50 dark:border-purple-500/20 mb-6 shadow-lg transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50">
                                                            <Book className="h-4 w-4 text-[#7c28eb] dark:text-purple-300" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-[#7c28eb] dark:text-purple-300">
                                                            {t("table_of_contents")}
                                                        </h3>
                                                    </div>
                                                    <nav className="space-y-1 text-sm">
                                                        {[
                                                            { id: "introduccion", title: t("introduction"), number: 1 },
                                                            { id: "tipos-de-cookies", title: t("cookie_types"), number: 2 },
                                                            { id: "cookies-de-terceros", title: t("third_party_cookies"), number: 3 },
                                                            { id: "gestion-de-cookies", title: t("cookie_management"), number: 4 },
                                                            { id: "privacidad", title: t("privacy_impact"), number: 5 },
                                                            { id: "actualizaciones", title: t("updates"), number: 6 },
                                                        ].map((section) => (
                                                            <button
                                                                key={section.id}
                                                                onClick={() => scrollToSection(section.id)}
                                                                className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-300 flex items-center gap-2 group ${activeSection === section.id
                                                                        ? "bg-gradient-to-r from-purple-100/80 to-purple-50/80 dark:from-purple-900/40 dark:to-purple-800/20 text-[#7c28eb] dark:text-purple-300 font-medium shadow-sm"
                                                                        : "hover:bg-purple-100/50 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] dark:hover:text-purple-300"
                                                                    }`}
                                                            >
                                                                <span
                                                                    className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ${activeSection === section.id
                                                                            ? "bg-[#7c28eb] text-white"
                                                                            : "bg-purple-100 dark:bg-purple-900/50 text-[#7c28eb] dark:text-purple-300 group-hover:bg-[#7c28eb] group-hover:text-white"
                                                                        } transition-colors duration-300`}
                                                                >
                                                                    {section.number}
                                                                </span>
                                                                <span>{section.title}</span>
                                                            </button>
                                                        ))}
                                                    </nav>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                            className="flex-1"
                                        >
                                            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl p-6 border border-purple-100/50 dark:border-purple-500/20 shadow-lg">
                                                <section id="introduccion" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
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
                                                                className="text-[#7c28eb] dark:text-purple-300"
                                                            >
                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                1. {t("introduction")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("introduction_text")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="tipos-de-cookies" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
                                                            <Cookie className="h-5 w-5 text-[#7c28eb] dark:text-purple-300" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                2. {t("cookie_types")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("cookie_types_text")}</p>

                                                                <div className="mt-6 grid md:grid-cols-2 gap-4">
                                                                    {[
                                                                        {
                                                                            title: t("essential_cookies"),
                                                                            text: t("essential_cookies_text"),
                                                                            icon: (
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
                                                                                    className="text-[#7c28eb] dark:text-purple-300"
                                                                                >
                                                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                                                                    <path d="M9.1 12a2.1 2.1 0 0 1 0-4.2"></path>
                                                                                    <path d="M14.9 12a2.1 2.1 0 0 0 0-4.2"></path>
                                                                                </svg>
                                                                            ),
                                                                        },
                                                                        {
                                                                            title: t("performance_cookies"),
                                                                            text: t("performance_cookies_text"),
                                                                            icon: (
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
                                                                                    className="text-[#7c28eb] dark:text-purple-300"
                                                                                >
                                                                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                                                                </svg>
                                                                            ),
                                                                        },
                                                                        {
                                                                            title: t("functionality_cookies"),
                                                                            text: t("functionality_cookies_text"),
                                                                            icon: (
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
                                                                                    className="text-[#7c28eb] dark:text-purple-300"
                                                                                >
                                                                                    <circle cx="12" cy="12" r="3"></circle>
                                                                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                                                                </svg>
                                                                            ),
                                                                        },
                                                                        {
                                                                            title: t("marketing_cookies"),
                                                                            text: t("marketing_cookies_text"),
                                                                            icon: (
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
                                                                                    className="text-[#7c28eb] dark:text-purple-300"
                                                                                >
                                                                                    <path d="M17 18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12z"></path>
                                                                                    <path d="M17 14H9"></path>
                                                                                    <path d="M17 10H9"></path>
                                                                                    <path d="M10 6h4"></path>
                                                                                </svg>
                                                                            ),
                                                                        },
                                                                    ].map((cookie, index) => (
                                                                        <motion.div
                                                                            key={index}
                                                                            initial={{ opacity: 0, y: 10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                                                                            className="p-4 rounded-xl border border-purple-100/50 dark:border-purple-500/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group"
                                                                        >
                                                                            <div className="flex items-center gap-3 mb-2">
                                                                                <div className="p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                                                                                    {cookie.icon}
                                                                                </div>
                                                                                <h4 className="font-medium text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb] dark:group-hover:text-purple-300 transition-colors">
                                                                                    {cookie.title}
                                                                                </h4>
                                                                            </div>
                                                                            <p className="text-sm text-muted-foreground">{cookie.text}</p>
                                                                        </motion.div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="cookies-de-terceros" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
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
                                                                className="text-[#7c28eb] dark:text-purple-300"
                                                            >
                                                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                                <circle cx="8.5" cy="7" r="4"></circle>
                                                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                                                <line x1="23" y1="11" x2="17" y2="11"></line>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                3. {t("third_party_cookies")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("third_party_cookies_text")}</p>
                                                                <ul className="mt-4 space-y-3">
                                                                    <motion.li
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ duration: 0.3, delay: 0.6 }}
                                                                        className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-purple-100/50 dark:border-purple-500/20"
                                                                    >
                                                                        <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1 mt-0.5 flex-shrink-0">
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
                                                                                className="text-[#7c28eb]"
                                                                            >
                                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                                            </svg>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-medium text-[#9645f4] dark:text-[#c79dff]">
                                                                                Google Analytics
                                                                            </span>
                                                                            : {t("third_party_cookies_ga")}
                                                                        </div>
                                                                    </motion.li>
                                                                    <motion.li
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ duration: 0.3, delay: 0.7 }}
                                                                        className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-purple-100/50 dark:border-purple-500/20"
                                                                    >
                                                                        <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1 mt-0.5 flex-shrink-0">
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
                                                                                className="text-[#7c28eb]"
                                                                            >
                                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                                            </svg>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-medium text-[#9645f4] dark:text-[#c79dff]">
                                                                                {t("third_party_cookies_social")}
                                                                            </span>
                                                                            : {t("third_party_cookies_social_text")}
                                                                        </div>
                                                                    </motion.li>
                                                                </ul>
                                                                <p className="mt-4">{t("third_party_cookies_note")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="gestion-de-cookies" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
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
                                                                className="text-[#7c28eb] dark:text-purple-300"
                                                            >
                                                                <path d="M12 20h9"></path>
                                                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                4. {t("cookie_management")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("cookie_management_text")}</p>

                                                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                                                                    {[
                                                                        {
                                                                            name: "Chrome",
                                                                            url: "https://support.google.com/chrome/answer/95647",
                                                                            icon: (
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
                                                                                    className="mb-2 text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb]"
                                                                                >
                                                                                    <circle cx="12" cy="12" r="10"></circle>
                                                                                    <circle cx="12" cy="12" r="4"></circle>
                                                                                    <line x1="21.17" y1="8" x2="12" y2="8"></line>
                                                                                    <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                                                                                    <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                                                                                </svg>
                                                                            ),
                                                                        },
                                                                        {
                                                                            name: "Firefox",
                                                                            url: "https://support.mozilla.org/es/kb/Borrar%20cookies",
                                                                            icon: (
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
                                                                                    className="mb-2 text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb]"
                                                                                >
                                                                                    <circle cx="12" cy="12" r="10"></circle>
                                                                                    <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
                                                                                    <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
                                                                                    <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
                                                                                    <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
                                                                                    <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
                                                                                    <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
                                                                                </svg>
                                                                            ),
                                                                        },
                                                                        {
                                                                            name: "Safari",
                                                                            url: "https://support.apple.com/es-es/guide/safari/sfri11471/mac",
                                                                            icon: (
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
                                                                                    className="mb-2 text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb]"
                                                                                >
                                                                                    <circle cx="12" cy="12" r="10"></circle>
                                                                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                                                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"></path>
                                                                                </svg>
                                                                            ),
                                                                        },
                                                                        {
                                                                            name: "Edge",
                                                                            url: "https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
                                                                            icon: (
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
                                                                                    className="mb-2 text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb]"
                                                                                >
                                                                                    <circle cx="12" cy="12" r="10"></circle>
                                                                                    <polyline points="8 12 12 16 16 12"></polyline>
                                                                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                                                                </svg>
                                                                            ),
                                                                        },
                                                                    ].map((browser, index) => (
                                                                        <motion.a
                                                                            key={index}
                                                                            href={browser.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            initial={{ opacity: 0, y: 10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                                                            className="flex flex-col items-center p-4 rounded-xl border border-purple-100/50 dark:border-purple-500/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-purple-50/80 dark:hover:bg-purple-900/30 transition-all duration-300 text-center group hover:scale-[1.05] hover:shadow-md"
                                                                        >
                                                                            {browser.icon}
                                                                            <span className="text-sm font-medium group-hover:text-[#7c28eb]">
                                                                                {browser.name}
                                                                            </span>
                                                                        </motion.a>
                                                                    ))}
                                                                </div>
                                                                <p className="mt-4">{t("cookie_management_note")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="privacidad" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
                                                            <Shield className="h-5 w-5 text-[#7c28eb] dark:text-purple-300" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                5. {t("privacy_impact")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("privacy_impact_text")}</p>
                                                                <p className="mt-4">
                                                                    {t("privacy_impact_more", {
                                                                        terms_and_conditions: (
                                                                            <button
                                                                                onClick={() => setActiveTab("terms")}
                                                                                className="text-[#7c28eb] hover:underline font-medium border-0 bg-transparent p-0 cursor-pointer inline-flex items-center gap-1"
                                                                            >
                                                                                <FileText className="h-3 w-3" />
                                                                                {t("terms_and_conditions")}
                                                                            </button>
                                                                        ),
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent"></div>

                                                <section id="actualizaciones" className="scroll-mt-20">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="mt-1 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/50 flex-shrink-0">
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
                                                                className="text-[#7c28eb] dark:text-purple-300"
                                                            >
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-3 text-[#7c28eb] dark:text-purple-300">
                                                                6. {t("updates")}
                                                            </h3>
                                                            <div className="prose dark:prose-invert">
                                                                <p>{t("updates_text")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <div className="mt-10 pt-6 border-t border-purple-100 dark:border-purple-600/30">
                                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
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
                                                            className="text-[#9645f4]"
                                                        >
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                            <polyline points="12 6 12 12 16 14"></polyline>
                                                        </svg>
                                                        {t("last_update", { date: "30 de abril de 2025" })}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
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
