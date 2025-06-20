"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Head, useForm, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { useTranslation } from "@/utils/i18n"
import type { BreadcrumbItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MapPin, Send, Sparkles, ContactRound } from "lucide-react"
import { motion } from "framer-motion"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
import { Toaster, showToast } from "@/components/toast"

// ----- CONFIGURATION -----
const leafletIcon = new L.Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

export default function Contact() {
    // ----- HOOKS & STATE -----
    const { t } = useTranslation()
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        inquiryType: "",
    })
    const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [activeField, setActiveField] = useState<string | null>(null)
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props

    // ----- CONFIGURATION -----
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t("contact_us"),
            href: "/contact",
        },
    ]

    // ----- EVENT HANDLERS -----
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setData(name as any, value)
    }

    const handleSelectChange = (value: string) => {
        setData('inquiryType', value)
    }

    const handleFocus = (fieldName: string) => {
        setActiveField(fieldName)
    }

    const handleBlur = () => {
        setActiveField(null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFormStatus("loading")

        post('/contact', {
            onSuccess: () => {
                setFormStatus("success")
                reset()
                setActiveField(null)
            },
            onError: () => {
                setFormStatus("error")
            }
        });
    }

    // ----- SIDE EFFECTS -----
    useEffect(() => {
        if (flash && flash.success) {
            showToast.success(flash.success);
        }
        
        if (flash && flash.error) {
            showToast.error(flash.error);
        }
    }, [flash])

    // Configurar animación de partículas en el fondo para efectos visuales
    useEffect(() => {
        const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const setCanvasDimensions = () => {
            const container = canvas.parentElement
            if (container) {
                canvas.width = container.offsetWidth
                canvas.height = container.offsetHeight
            }
        }

        setCanvasDimensions()
        window.addEventListener("resize", setCanvasDimensions)

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

        const particles: Particle[] = []
        const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 10000))

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle())
        }

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

        return () => {
            window.removeEventListener("resize", setCanvasDimensions)
        }
    }, [])

    // ----- RENDER COMPONENT -----
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t("contact_us")} />
            <Toaster />

            {/* Contenedor principal con fondo animado */}
            <div className="relative flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-hidden">
                {/* Fondo con gradiente y canvas de partículas */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/30 z-0">
                    <canvas id="particle-canvas" className="absolute inset-0 w-full h-full bg-[#fefbf2] dark:bg-[#0a0a0a]" />
                </div>

                <div className="relative z-10 px-2">
                    {/* Título y descripción de la página con animación de entrada */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold text-[#7c28eb] dark:text-purple-300">{t("contact_us")}</h2>
                            <Sparkles className="h-6 w-6 text-[#9645f4] animate-pulse" />
                        </div>
                        <p className="text-muted-foreground mb-8 max-w-2xl">
                            {t("contact_subtitle") ||
                                "We're here to help. Fill out the form below and we'll get back to you as soon as possible."}
                        </p>
                    </motion.div>

                    {/* Grid principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <motion.div
                            className="lg:col-span-1 space-y-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* Tarjeta de información de contacto */}
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-purple-100/50 dark:border-purple-500/20 transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:scale-[1.02]">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-6 text-[#7c28eb] dark:text-purple-300 flex items-center gap-2">
                                        <span className="inline-block p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
                                            <ContactRound className="h-5 w-5 text-[#7c28eb] dark:text-purple-300" />
                                        </span>
                                        {t("contact_info")}
                                    </h3>

                                    {/* Lista de métodos de contacto */}
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 flex-shrink-0 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/30">
                                                <Mail className="h-5 w-5 text-[#7c28eb] dark:text-purple-300" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#7c28eb] dark:text-purple-300 mb-1">{t("email")}</h4>
                                                <a
                                                    href="mailto:empleaworks@gmail.com"
                                                    className="text-gray-600 dark:text-gray-300 hover:text-[#7c28eb] dark:hover:text-purple-300 transition-colors"
                                                >
                                                    empleaworks@gmail.com
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 flex-shrink-0 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/30">
                                                <MapPin className="h-5 w-5 text-[#7c28eb] dark:text-purple-300" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#7c28eb] dark:text-purple-300 mb-1">{t("address")}</h4>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Yecla, Murcia, España
                                                    
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Barra decorativa de gradiente */}
                                <div className="h-2 bg-gradient-to-r from-[#7c28eb] via-[#9645f4] to-[#c79dff]"></div>
                            </div>

                            {/* Mapa interactivo con React Leaflet */}
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-purple-100/50 dark:border-purple-500/20 h-64 relative transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:scale-[1.02] mt-11">
                                <MapContainer
                                    center={[38.6136, -1.1147]}
                                    zoom={13}
                                    scrollWheelZoom={false}
                                    style={{ height: "100%", width: "100%", zIndex: 1 }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {/* Marcador de ubicación con popup informativo */}
                                    <Marker position={[38.6136, -1.1147]} icon={leafletIcon}>
                                        <Popup>
                                            Yecla, Murcia, España
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                                {/* Barra decorativa inferior */}
                                <div className="h-2 bg-gradient-to-r from-[#7c28eb] via-[#9645f4] to-[#c79dff] absolute bottom-0 left-0 right-0"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="lg:col-span-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {/* Tarjeta del formulario */}
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-purple-100/50 dark:border-purple-500/20 transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30">
                                <div className="p-6 md:p-8 relative">
                                    <div className="relative mb-8 pb-4">
                                        <h3 className="text-xl font-semibold text-[#7c28eb] dark:text-purple-300 flex items-center gap-2">
                                            <span className="inline-block p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
                                                <Send className="h-5 w-5 text-[#7c28eb] dark:text-purple-300" />
                                            </span>
                                            {t("contact_form")}
                                        </h3>
                                        {/* Línea decorativa debajo del título */}
                                        <div className="absolute bottom-0 left-0 h-1 w-24 bg-gradient-to-r from-[#7c28eb] to-[#9645f4]"></div>
                                    </div>

                                    {/* Formulario de contacto con validación */}
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2 relative">
                                                <Label
                                                    htmlFor="name"
                                                    className={`text-[#7c28eb] dark:text-purple-300 transition-all duration-300 ${activeField === "name" ? "text-[#6a1fd0] dark:text-purple-200" : ""}`}
                                                >
                                                    {t("name")} <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={data.name}
                                                    onChange={handleChange}
                                                    onFocus={() => handleFocus("name")}
                                                    onBlur={handleBlur}
                                                    placeholder={t("your_name")}
                                                    required
                                                    className={`border-purple-100 dark:border-purple-600/30 focus:border-[#7c28eb] focus:ring-[#7c28eb]/20 transition-all duration-300 ${activeField === "name"
                                                            ? "border-[#7c28eb] dark:border-purple-400 shadow-[0_0_0_1px_rgba(124,40,235,0.2)]"
                                                            : ""
                                                        }`}
                                                />
                                                {activeField === "name" && (
                                                    <motion.div
                                                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#7c28eb] to-[#9645f4] w-0"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                )}
                                            </div>
                                            <div className="space-y-2 relative">
                                                <Label
                                                    htmlFor="email"
                                                    className={`text-[#7c28eb] dark:text-purple-300 transition-all duration-300 ${activeField === "email" ? "text-[#6a1fd0] dark:text-purple-200" : ""}`}
                                                >
                                                    {t("email")} <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={handleChange}
                                                    onFocus={() => handleFocus("email")}
                                                    onBlur={handleBlur}
                                                    placeholder={t("your_email")}
                                                    required
                                                    className={`border-purple-100 dark:border-purple-600/30 focus:border-[#7c28eb] focus:ring-[#7c28eb]/20 transition-all duration-300 ${activeField === "email"
                                                            ? "border-[#7c28eb] dark:border-purple-400 shadow-[0_0_0_1px_rgba(124,40,235,0.2)]"
                                                            : ""
                                                        }`}
                                                />
                                                {activeField === "email" && (
                                                    <motion.div
                                                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#7c28eb] to-[#9645f4] w-0"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2 relative">
                                                <Label
                                                    htmlFor="inquiryType"
                                                    className={`text-[#7c28eb] dark:text-purple-300 transition-all duration-300 ${activeField === "inquiryType" ? "text-[#6a1fd0] dark:text-purple-200" : ""}`}
                                                >
                                                    {t("inquiry_type")}
                                                </Label>
                                                <Select
                                                    value={data.inquiryType}
                                                    onValueChange={handleSelectChange}
                                                    onOpenChange={(open) => {
                                                        if (open) handleFocus("inquiryType")
                                                        else handleBlur()
                                                    }}
                                                >
                                                    <SelectTrigger
                                                        className={`border-purple-100 dark:border-purple-600/30 focus:border-[#7c28eb] focus:ring-[#7c28eb]/20 transition-all duration-300 ${activeField === "inquiryType"
                                                                ? "border-[#7c28eb] dark:border-purple-400 shadow-[0_0_0_1px_rgba(124,40,235,0.2)]"
                                                                : ""
                                                            }`}
                                                    >
                                                        <SelectValue placeholder={t("select_inquiry_type")} />
                                                    </SelectTrigger>
                                                    {/* Opciones de consulta categorizadas */}
                                                    <SelectContent className="border-purple-100 dark:border-purple-600/30">
                                                        <SelectItem value="Consulta general">{t("general_inquiry")}</SelectItem>
                                                        <SelectItem value="Consulta sobre ofertas">{t("job_inquiry")}</SelectItem>
                                                        <SelectItem value="Problemas aplicando">{t("application_help")}</SelectItem>
                                                        <SelectItem value="Problemas de empresa">{t("employer_support")}</SelectItem>
                                                        <SelectItem value="Soporte tecnico">{t("technical_support")}</SelectItem>
                                                        <SelectItem value="Colaboracion">{t("collaboration")}</SelectItem>
                                                        <SelectItem value="Otro">{t("other")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {activeField === "inquiryType" && (
                                                    <motion.div
                                                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#7c28eb] to-[#9645f4] w-0"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                )}
                                            </div>
                                            <div className="space-y-2 relative">
                                                <Label
                                                    htmlFor="subject"
                                                    className={`text-[#7c28eb] dark:text-purple-300 transition-all duration-300 ${activeField === "subject" ? "text-[#6a1fd0] dark:text-purple-200" : ""}`}
                                                >
                                                    {t("subject")} <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="subject"
                                                    name="subject"
                                                    value={data.subject}
                                                    onChange={handleChange}
                                                    onFocus={() => handleFocus("subject")}
                                                    onBlur={handleBlur}
                                                    placeholder={t("message_subject")}
                                                    required
                                                    className={`border-purple-100 dark:border-purple-600/30 focus:border-[#7c28eb] focus:ring-[#7c28eb]/20 transition-all duration-300 ${activeField === "subject"
                                                            ? "border-[#7c28eb] dark:border-purple-400 shadow-[0_0_0_1px_rgba(124,40,235,0.2)]"
                                                            : ""
                                                        }`}
                                                />
                                                {activeField === "subject" && (
                                                    <motion.div
                                                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#7c28eb] to-[#9645f4] w-0"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2 relative">
                                            <Label
                                                htmlFor="message"
                                                className={`text-[#7c28eb] dark:text-purple-300 transition-all duration-300 ${activeField === "message" ? "text-[#6a1fd0] dark:text-purple-200" : ""}`}
                                            >
                                                {t("message")} <span className="text-red-500">*</span>
                                            </Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                value={data.message}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus("message")}
                                                onBlur={handleBlur}
                                                placeholder={t("your_message")}
                                                required
                                                rows={6}
                                                className={`border-purple-100 dark:border-purple-600/30 focus:border-[#7c28eb] focus:ring-[#7c28eb]/20 transition-all duration-300 ${activeField === "message"
                                                        ? "border-[#7c28eb] dark:border-purple-400 shadow-[0_0_0_1px_rgba(124,40,235,0.2)]"
                                                        : ""
                                                    }`}
                                            />
                                            {activeField === "message" && (
                                                <motion.div
                                                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#7c28eb] to-[#9645f4] w-0"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                            )}
                                        </div>

                                        {/* Botón de envío con estados y animaciones */}
                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    {processing ? (
                                                        <>
                                                            {/* Spinner de carga */}
                                                            <svg
                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                ></path>
                                                            </svg>
                                                            {t("sending")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* Icono de envío con animación en hover */}
                                                            <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                            {t("send_message")}
                                                        </>
                                                    )}
                                                </span>
                                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer"></span>
                                            </Button>
                                        </div>
                                    </form>

                                    {/* Aviso de privacidad */}
                                    <div className="mt-10 pt-6 border-t border-purple-100 dark:border-purple-600/30">
                                        <p className="text-sm text-muted-foreground">
                                            {t("privacy_notice") ||
                                                "By submitting this form, you agree to our Terms and Conditions and Privacy Policy."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Estilos CSS personalizados para animaciones */}
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

            {/* Estilos específicos para el mapa Leaflet */}
            <style>{`
                .leaflet-container {
                    border-radius: 1rem;
                    min-height: 16rem;
                }
            `}</style>
        </AppLayout>
    )
}
