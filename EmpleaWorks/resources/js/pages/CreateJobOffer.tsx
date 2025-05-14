"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, SharedData } from "@/types"
import { Head, Link, useForm, usePage } from "@inertiajs/react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type FormEvent, useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useTranslation } from "@/utils/i18n"
import { cn } from "@/lib/utils"

interface CreateJobOfferProps {
  categories: string[]
  contractTypes: string[]
  company?: {
    id: number
    name: string
  }
}

export default function CreateJobOffer({ categories = [], contractTypes = [], company }: CreateJobOfferProps) {
  // ----- HOOKS & STATE -----
  const { auth } = usePage<SharedData>().props
  const { t } = useTranslation()
  const [date, setDate] = useState<Date | undefined>(
    // Set default date to 30 days from now
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  )

  // ----- COLOR THEMING SYSTEM -----
  // Colores principales (púrpura)
  const primaryColor = "#7c28eb"
  const primaryHoverColor = "#6620c5"
  const primaryLightColor = "#9645f4"

  // Colores de acento (ámbar)
  const accentColor = "#FDC231"

  // ----- TAILWIND CLASS MODIFIERS -----
  // Clases CSS para aplicar el tema púrpura con acentos ámbar
  const borderColor = "border-purple-100 dark:border-purple-600/30"
  const bgAccentColor = "bg-purple-50/50 dark:bg-purple-950/20"

  // ----- CONFIGURATION -----
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t("company_dashboard"),
      href: "/company/dashboard",
    },
    {
      title: t("create_new_job"),
      href: "/company/create-job",
    },
  ]

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    description: "",
    category: "",
    degree: "",
    email: auth.user.email,
    contract_type: "",
    job_location: "",
    closing_date: date ? format(date, "yyyy-MM-dd") : "",
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Update the closing_date in case the date picker changed
    setData("closing_date", date ? format(date, "yyyy-MM-dd") : "")

    post(route("offers.store"), {
      onSuccess: () => {
        toast.success(t("job_created_success"))
        // Redirect to company dashboard after success
        window.location.href = route("company.dashboard")
      },
      onError: () => {
        toast.error(t("job_created_error"))
      },
    })
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
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "toast-offers",
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "8px",
            padding: "20px 28px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
      />
      <Head title={t("create_job_listing")} />

      <div className="relative flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FEFBF2] via-[#FEFBF2] to-[#F8F0DD] dark:bg-[#0a0a0a] z-0">
          <canvas id="particle-canvas" className="absolute inset-0 w-full h-full dark:bg-[#0a0a0a]" />
        </div>

        {/* Content with glassmorphism effect */}
        <div className="relative z-10">
          <div className="px-2 mb-4">
            <h2 className="text-2xl font-semibold mb-2 text-[#7c28eb] dark:text-purple-300">{t("create_new_job")}</h2>
            <p className="text-muted-foreground">{t("fill_job_details")}</p>
          </div>

          <Card
            className={cn(
              "transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30",
              borderColor,
              "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
            )}
          >
            <CardHeader className={cn(bgAccentColor, "px-6 py-4")}>
              <CardTitle className="text-[#7c28eb] dark:text-purple-300">{t("job_information")}</CardTitle>
              <CardDescription className="dark:text-gray-300">{t("provide_position_details")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Job Title */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#7c28eb] dark:text-purple-300">
                      {t("job_title")}
                    </Label>
                    <Input
                      id="name"
                      placeholder={t("job_title_placeholder")}
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  {/* Job Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-[#7c28eb] dark:text-purple-300">
                      {t("category")}
                    </Label>
                    <Select value={data.category} onValueChange={(value) => setData("category", value)}>
                      <SelectTrigger className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500">
                        <SelectValue placeholder={t("select_category")} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#7c28eb] dark:text-purple-300">
                    {t("job_description")}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={t("job_description_placeholder")}
                    rows={5}
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                  />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Required Degree */}
                  <div className="space-y-2">
                    <Label htmlFor="degree" className="text-[#7c28eb] dark:text-purple-300">
                      {t("required_degree")}
                    </Label>
                    <Input
                      id="degree"
                      placeholder={t("degree_placeholder")}
                      value={data.degree}
                      onChange={(e) => setData("degree", e.target.value)}
                      className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                    />
                    {errors.degree && <p className="text-red-500 text-sm">{errors.degree}</p>}
                  </div>

                  {/* Contact Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#7c28eb] dark:text-purple-300">
                      {t("contact_email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {/* Contract Type */}
                  <div className="space-y-2">
                    <Label htmlFor="contract_type" className="text-[#7c28eb] dark:text-purple-300">
                      {t("contract_type")}
                    </Label>
                    <Select value={data.contract_type} onValueChange={(value) => setData("contract_type", value)}>
                      <SelectTrigger className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500">
                        <SelectValue placeholder={t("select_contract_type")} />
                      </SelectTrigger>
                      <SelectContent>
                        {contractTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.contract_type && <p className="text-red-500 text-sm">{errors.contract_type}</p>}
                  </div>

                  {/* Job Location */}
                  <div className="space-y-2">
                    <Label htmlFor="job_location" className="text-[#7c28eb] dark:text-purple-300">
                      {t("job_location")}
                    </Label>
                    <Input
                      id="job_location"
                      placeholder={t("location_placeholder")}
                      value={data.job_location}
                      onChange={(e) => setData("job_location", e.target.value)}
                      className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                    />
                    {errors.job_location && <p className="text-red-500 text-sm">{errors.job_location}</p>}
                  </div>

                  {/* Closing Date */}
                  <div className="space-y-2">
                    <Label htmlFor="closing_date" className="text-[#7c28eb] dark:text-purple-300">
                      {t("application_deadline")}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="closing_date"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            "border-purple-200 dark:border-purple-700",
                            !date && "text-muted-foreground",
                            "hover:bg-purple-50 dark:hover:bg-purple-900/30",
                            "hover:border-[#7c28eb] dark:hover:border-purple-500",
                            "focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500",
                            "transition-all duration-300",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" style={{ color: accentColor }} />
                          {date ? format(date, "PPP") : <span>{t("pick_date")}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(newDate) => {
                            setDate(newDate)
                            if (newDate) {
                              setData("closing_date", format(newDate, "yyyy-MM-dd"))
                            }
                          }}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.closing_date && <p className="text-red-500 text-sm">{errors.closing_date}</p>}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    asChild
                    className={cn(
                      "border-purple-200 dark:border-purple-700",
                      "text-[#7c28eb] dark:text-white",
                      "hover:bg-purple-50 dark:hover:bg-purple-900/30",
                      "hover:border-[#7c28eb] dark:hover:border-purple-500",
                      "hover:text-[#6620c5] dark:hover:text-white",
                      "transition-all duration-300",
                      "cursor-pointer"
                    )}
                  >
                    <Link href={route("company.dashboard")}>{t("cancel")}</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing}
                    className="relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <span className="relative z-10">{processing ? t("creating") : t("create_job_listing")}</span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer pointer-events-none"></span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
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
