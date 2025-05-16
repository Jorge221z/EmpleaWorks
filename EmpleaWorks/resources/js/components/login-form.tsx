"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useForm, Link } from "@inertiajs/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslation } from "@/utils/i18n"
import AppLogo from "@/components/app-logo"
import { motion } from "framer-motion"
import { Send, Sparkles } from "lucide-react"
import { Github, Mail } from "lucide-react"

export function LoginForm({
  className,
  status,
  canResetPassword = true,
  ...props
}: React.ComponentProps<"div"> & {
  status?: string
  canResetPassword?: boolean
}) {
  const { t } = useTranslation()
  const [activeField, setActiveField] = useState<string | null>(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  })

  useEffect(() => {
    return () => {
      reset("password")
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post("/login")
  }

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName)
  }

  const handleBlur = () => {
    setActiveField(null)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="overflow-hidden p-0 border-purple-100/50 dark:border-purple-500/20 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 transition-all duration-300">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    <Link href="/" className="flex items-center gap-2 group justify-center">
                      <AppLogo className="h-12 w-8 bg-transparent p-0 m-0" />
                      <span className="text-xl font-bold tracking-tight hover:text-purple-600 dark:hover:text-purple-300 transition-colors -ml-1">
                        EmpleaWorks
                      </span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-[#7c28eb] dark:text-purple-300">{t("welcome_back")}</h1>
                  </div>
                </div>

                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-md bg-purple-100/90 dark:bg-purple-900/30 backdrop-blur-sm p-4 text-sm text-[#7c28eb] dark:text-purple-300 border border-purple-200 dark:border-purple-800/50"
                  >
                    {status}
                  </motion.div>
                )}

                <div className="space-y-2 relative">
                  <Label
                    htmlFor="email"
                    className={`text-[#9645f4] dark:text-[#c79dff] transition-all duration-300 ${
                      activeField === "email" ? "text-[#6a1fd0] dark:text-purple-200" : ""
                    }`}
                  >
                    {t("email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    placeholder={t("email_placeholder")}
                    onChange={(e) => setData("email", e.target.value)}
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    autoComplete="username"
                    className={`border-purple-100 dark:border-purple-600/30 focus-visible:ring-[#7c28eb] transition-all duration-300 ${
                      activeField === "email"
                        ? "border-[#7c28eb] dark:border-purple-400 shadow-[0_0_0_1px_rgba(124,40,235,0.2)]"
                        : ""
                    }`}
                    required
                  />
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive mt-1"
                    >
                      {errors.email}
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <Label
                      htmlFor="password"
                      className={`text-[#9645f4] dark:text-[#c79dff] transition-all duration-300 ${
                        activeField === "password" ? "text-[#6a1fd0] dark:text-purple-200" : ""
                      }`}
                    >
                      {t("password")}
                    </Label>
                    {canResetPassword && (
                      <Link
                        href="/forgot-password"
                        className="text-sm text-[#9645f4] dark:text-[#c79dff] underline-offset-4 hover:text-[#7c28eb] dark:hover:text-purple-300 hover:underline sm:ml-auto mt-1 sm:mt-0"
                      >
                        {t("forgot_your_password")}
                      </Link>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    onFocus={() => handleFocus("password")}
                    onBlur={handleBlur}
                    autoComplete="current-password"
                    placeholder={t("password_placeholder")}
                    className={`border-purple-100 dark:border-purple-600/30 focus-visible:ring-[#7c28eb] transition-all duration-300 ${
                      activeField === "password"
                        ? "border-[#7c28eb] dark:border-purple-400 shadow-[0_0_0_1px_rgba(124,40,235,0.2)]"
                        : ""
                    }`}
                    required
                  />
                  {errors.password && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive mt-1"
                    >
                      {errors.password}
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={data.remember}
                    onCheckedChange={(checked) => setData("remember", checked === true)}
                    className="border-purple-200 dark:border-purple-700 data-[state=checked]:bg-[#7c28eb] data-[state=checked]:border-[#7c28eb]"
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    {t("remember_me")}
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  disabled={processing}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {processing ? (
                      <>
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
                        {t("signing_in")}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        {t("sign_in")}
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7c28eb]/0 via-white/20 to-[#7c28eb]/0 -translate-x-full animate-shimmer group-hover:animate-shimmer pointer-events-none"></span>
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">
                      {t("or_continue_with")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.location.href = route('google.redirect')}
                    className="flex items-center justify-center gap-2 border-purple-100 dark:border-purple-600/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-[#7c28eb] dark:hover:text-purple-300 transition-all duration-300 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    {t("sign_in_with_google")}
                  </Button>
                </div>

                <div className="text-center text-sm mt-4">
                  {t("dont_have_account")}{" "}
                  <Link
                    href="/register"
                    className="text-[#9645f4] dark:text-[#c79dff] underline underline-offset-4 hover:text-[#7c28eb] dark:hover:text-purple-300"
                  >
                    {t("sign_up")}
                  </Link>
                </div>
              </div>
            </form>
            <div className="bg-muted relative hidden md:block">
              <img
                src="/images/login-background.webp"
                alt="Login background"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-muted-foreground hover:text-[#7c28eb] text-center text-xs text-balance"
      >
        {t("terms_text")}{" "}
        <Link
          href="/terms"
          className="text-[#9645f4] dark:text-[#c79dff] underline underline-offset-4 hover:text-[#7c28eb] dark:hover:text-purple-300"
        >
          {t("terms_and_conditions")}
        </Link>
      </motion.div>
    </div>
  )
}
