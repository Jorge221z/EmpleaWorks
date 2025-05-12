"use client"

import { Head } from "@inertiajs/react"
import { LoginForm } from "@/components/login-form"
import { useTranslation } from "@/utils/i18n"
import { Vortex } from "@/components/ui/vortex"
import { useState, useEffect } from "react"

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string
  canResetPassword: boolean
}) {
  const { t } = useTranslation()

  // Mantenemos el viewport dinámico solo para la posicion vertical
  const [viewportHeight, setViewportHeight] = useState<number>(0)
  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight)
    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  const [particleCount, setParticleCount] = useState(300)
  const [particleOpacity, setParticleOpacity] = useState(1.0)
  const [contrastMode, setContrastMode] = useState<"auto" | "light" | "dark">("auto")
  const [preserveBackground, setPreserveBackground] = useState(true)

  return (
    <>
      <Head title={t("log_in")} />

      {/* Vortex de fondo con detección automática de tema */}
      <Vortex
        containerClassName="fixed inset-0 w-full h-screen z-0"
        particleCount={particleCount}
        particleOpacity={particleOpacity}
        contrastMode={contrastMode}
        preserveBackground={preserveBackground}
        rangeY={800}
        baseSpeed={0.05} // Velocidad reducida
        rangeSpeed={0.4} // Rango de velocidad reducido
        baseRadius={1.5}
        rangeRadius={2.5}
        autoTheme={true} // Activar detección automática de tema
      >
        {/* Children opcionales, aquí va tu formulario */}
        <div className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-10">
          <div className="w-full max-w-sm md:max-w-3xl">
            <LoginForm status={status} canResetPassword={canResetPassword} />
          </div>
        </div>
      </Vortex>
    </>
  )
}
