"use client"

import { Head, useForm, Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import AppLogo from "@/components/app-logo"
import { useTranslation } from "@/utils/i18n"
import { motion } from "framer-motion"
import { User, Building2, CheckCircle } from "lucide-react"

/**
 * Componente de selección de rol para nuevos usuarios registrados con Google.
 * Permite elegir entre candidato o empresa para determinar el tipo de perfil.
 */
export default function GoogleRoleSelection() {
  const { t } = useTranslation()
  
  const { data, setData, post, processing, errors } = useForm({
    role_id: "",
  })
  
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('google.process.role'))
  }
  
  const selectRole = (role: string) => {
    setData('role_id', role)
  }
  
  return (
    <>
      <Head title={t("select_role")} />
      <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
        {/* Fondo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/30 z-0">
          <canvas id="particle-canvas" className="absolute inset-0 w-full h-full" />
        </div>
  
        {/* Contenedor principal */}
        <div className="relative z-10 w-full max-w-md space-y-8">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group justify-center mb-2">
              <AppLogo className="h-12 w-8 bg-transparent p-0 m-0" />
              <span className="text-xl font-bold tracking-tight hover:text-purple-600 dark:hover:text-purple-300 transition-colors -ml-1">
                EmpleaWorks
              </span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-[#7c28eb] dark:text-purple-300">
              {t("complete_registration")}
            </h1>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {t("select_role_description")}
            </p>
          </div>
  
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl overflow-hidden border border-purple-100/50 dark:border-purple-600/30 p-6 shadow-sm transform transition-all duration-300 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30"
          >
            <form onSubmit={submit}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">{t("select_your_role")}</Label>
                  
                  <RadioGroup
                    value={data.role_id}
                    onValueChange={(value) => setData('role_id', value)}
                    className="flex flex-col gap-4"
                  >
                    {/* Opción Candidato */}
                    <label htmlFor="candidate-option" className="cursor-pointer w-full">
                      <div 
                        className={`
                          relative flex flex-col rounded-lg border p-4 transition-all
                          ${data.role_id === "1" 
                            ? "border-[#7c28eb] bg-purple-50/50 dark:bg-purple-900/20 ring-1 ring-[#7c28eb]" 
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-purple-200 dark:hover:border-purple-800"}
                        `}
                      >
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="candidate-option" 
                            name="role_id" 
                            value="1" 
                            checked={data.role_id === "1"}
                            onChange={() => selectRole("1")}
                            className="sr-only"
                          />
                          <User className="h-5 w-5 mr-3 text-[#7c28eb] dark:text-purple-300 flex-shrink-0" />
                          <div className="flex-grow">
                            <span className="text-base font-medium">
                              {t("candidate")}
                            </span>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t("candidate_role_description")}
                            </p>
                          </div>
                          {data.role_id === "1" && (
                            <CheckCircle className="h-5 w-5 text-[#7c28eb] dark:text-purple-300 ml-2" />
                          )}
                        </div>
                        
                        <div className="mt-3 pl-8">
                          <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                            <li>{t("candidate_feature_1")}</li>
                            <li>{t("candidate_feature_2")}</li>
                            <li>{t("candidate_feature_3")}</li>
                          </ul>
                        </div>
                      </div>
                    </label>
                    
                    {/* Opción Empresa */}
                    <label htmlFor="company-option" className="cursor-pointer w-full">
                      <div 
                        className={`
                          relative flex flex-col rounded-lg border p-4 transition-all
                          ${data.role_id === "2" 
                            ? "border-[#7c28eb] bg-purple-50/50 dark:bg-purple-900/20 ring-1 ring-[#7c28eb]" 
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-purple-200 dark:hover:border-purple-800"}
                        `}
                      >
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="company-option" 
                            name="role_id" 
                            value="2" 
                            checked={data.role_id === "2"}
                            onChange={() => selectRole("2")}
                            className="sr-only"
                          />
                          <Building2 className="h-5 w-5 mr-3 text-[#7c28eb] dark:text-purple-300 flex-shrink-0" />
                          <div className="flex-grow">
                            <span className="text-base font-medium">
                              {t("company")}
                            </span>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t("company_role_description")}
                            </p>
                          </div>
                          {data.role_id === "2" && (
                            <CheckCircle className="h-5 w-5 text-[#7c28eb] dark:text-purple-300 ml-2" />
                          )}
                        </div>
                        
                        <div className="mt-3 pl-8">
                          <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                            <li>{t("company_feature_1")}</li>
                            <li>{t("company_feature_2")}</li>
                            <li>{t("company_feature_3")}</li>
                          </ul>
                        </div>
                      </div>
                    </label>
                  </RadioGroup>
                  
                  {errors.role_id && <p className="text-sm text-red-500">{errors.role_id}</p>}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white" 
                  disabled={processing || !data.role_id}
                >
                  {processing ? t("completing") : t("complete_registration")}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  )
}