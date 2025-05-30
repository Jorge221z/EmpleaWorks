"use client"

import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"
import { motion } from "framer-motion"
import { useTranslation } from "@/utils/i18n"
import { Smartphone, Download, Shield, CheckCircle, QrCode, Star, Zap, ArrowRight, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function MobileDownload() {
    const { t } = useTranslation()
    const [showQR, setShowQR] = useState(false)


    const breadcrumbs: BreadcrumbItem[] = [
        
        {
            title: t("download_app"),
            href: "/download-app",
        },
    ]

    const features = [
        {
            icon: Zap,
            title: t("instant_notifications"),
            description: t("instant_notifications_desc")
        },
        {
            icon: Shield,
            title: t("secure_app"),
            description: t("secure_app_desc")
        },
        {
            icon: Star,
            title: t("optimized_experience"),
            description: t("optimized_experience_desc")
        }
    ]

    const handleDownload = () => {
        // En producción, esto descargaría el APK real
        const link = document.createElement('a')
        link.href = 'https://github.com/Jorge221z/EmpleaWorks-Mobile/releases/download/v1.0.0/EmpleaWorks-v1.apk'
        link.download = 'EmpleaWorks.apk'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <>
            <Head title={`${t("download_app")} - EmpleaWorks`} />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="relative min-h-screen dark:bg-[#0a0a0a] bg-[#fefbf2] overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            animate={{
                                x: [0, 100, 0],
                                y: [0, -50, 0],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-amber-400/20 rounded-full blur-xl"
                        />
                        <motion.div
                            animate={{
                                x: [0, -80, 0],
                                y: [0, 60, 0],
                                rotate: [0, -180, -360],
                            }}
                            transition={{
                                duration: 25,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-amber-400/15 to-purple-400/15 rounded-full blur-xl"
                        />
                    </div>

                    <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
                        {/* Hero Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#7c28eb] to-[#9645f4] rounded-3xl mb-8 shadow-2xl shadow-purple-500/25"
                            >
                                <Smartphone className="w-10 h-10 text-white" />
                            </motion.div>

                            <h1 className="text-5xl md:text-6xl font-bold text-[#7c28eb] dark:text-purple-300 mb-6">
                                EmpleaWorks
                                <span className="block text-3xl md:text-4xl mt-2 bg-gradient-to-r from-[#7c28eb] to-[#FDC231] bg-clip-text text-transparent">
                                    {t("mobile_app")}
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                {t("mobile_app_subtitle")}
                            </p>
                        </motion.div>

                        {/* Main Content Grid */}
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                            {/* Left Column - Download Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="space-y-6 lg:space-y-8 order-1 lg:order-1 lg:-mt-0"
                            >
                                {/* Download Card */}
                                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl border border-purple-100/50 dark:border-purple-800/30">
                                    <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl flex items-center justify-center">
                                            <Download className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                {t("download_for_android")}
                                                <img 
                                                    src="/images/icons8-android-os.svg" 
                                                    alt="Android" 
                                                    className="w-7 h-7 lg:w-8 lg:h-8"
                                                />
                                            </h2>
                                            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                                                {t("version_free")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                                        <Button
                                            onClick={handleDownload}
                                            className="w-full h-12 lg:h-14 text-base lg:text-lg font-semibold bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                                        >
                                            <Download className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3" />
                                            {t("download_apk")}
                                        </Button>

                                        <div className="flex items-center justify-center">
                                            <span className="text-gray-400 text-sm">{t("or")}</span>
                                        </div>

                                        <Button
                                            variant="outline"
                                            onClick={() => setShowQR(!showQR)}
                                            className="w-full h-10 lg:h-12 border-2 border-purple-200 dark:border-purple-700 text-[#7c28eb] dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer"
                                        >
                                            <QrCode className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                                            {showQR ? t("hide_qr_code") : t("show_qr_code")}
                                        </Button>
                                    </div>

                                    {/* QR Code */}
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ 
                                            opacity: showQR ? 1 : 0, 
                                            height: showQR ? 'auto' : 0 
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-white rounded-2xl p-4 lg:p-6 text-center border border-gray-200">
                                            <div className="w-55 h-55 lg:w-57 lg:h-57 mx-auto bg-white rounded-xl flex items-center justify-center mb-3 lg:mb-4 p-2 lg:p-3">
                                                <img 
                                                    src="/images/QR.svg" 
                                                    alt={`QR Code - ${t("download_app")} EmpleaWorks`}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                <strong>{t("scan_with_android")}</strong>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {t("point_camera_qr")}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Security Warning */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 lg:p-4 mt-4 lg:mt-6"
                                    >
                                        <div className="flex items-start gap-2 lg:gap-3">
                                            <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                            <div className="text-xs lg:text-sm">
                                                <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                                                    {t("important_enable_unknown_sources")}
                                                </p>
                                                <div className="text-amber-700 dark:text-amber-300 space-y-2">
                                                    <p>
                                                        {t("install_app_instructions")}
                                                    </p>
                                                    <ol className="list-decimal list-inside space-y-1 text-xs">
                                                        <li>{t("step_1_settings")}</li>
                                                        <li>{t("step_2_security")}</li>
                                                        <li>{t("step_3_enable")}</li>
                                                        <li>{t("step_4_browser")}</li>
                                                    </ol>
                                                    <p className="text-xs mt-2 font-medium">
                                                        {t("app_safe_notice")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Right Column - Features & Preview */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="space-y-6 lg:space-y-8 order-2 lg:order-2"
                            >
                                {/* Phone Preview */}
                                <div className="relative flex justify-center">
                                    <motion.div
                                        animate={{
                                            y: [0, -10, 0],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="relative w-48 h-96 lg:w-64 lg:h-[520px] bg-gradient-to-b from-gray-900 to-black rounded-[2.5rem] lg:rounded-[3rem] p-4 lg:p-6 shadow-2xl"
                                    >
                                        {/* Phone Screen */}
                                        <div className="w-full h-full bg-gradient-to-br from-[#7c28eb] via-purple-500 to-[#FDC231] rounded-[2rem] p-4 lg:p-6 flex flex-col">
                                            {/* Status Bar */}
                                            <div className="flex justify-between items-center text-white text-xs mb-3 lg:mb-4">
                                                <span>9:41</span>
                                                <div className="flex gap-1">
                                                    <div className="w-3 h-1.5 lg:w-4 lg:h-2 bg-white/80 rounded-sm"></div>
                                                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white/60 rounded-full"></div>
                                                    <div className="w-5 h-1.5 lg:w-6 lg:h-2 bg-white/80 rounded-sm"></div>
                                                </div>
                                            </div>

                                            {/* App Content Preview */}
                                            <div className="flex-1 bg-white/95 rounded-xl lg:rounded-2xl p-3 lg:p-4 text-center">
                                                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-[#7c28eb] rounded-lg lg:rounded-xl mx-auto mb-2 lg:mb-3 flex items-center justify-center">
                                                    <Smartphone className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                                                </div>
                                                <h3 className="font-bold text-gray-900 mb-2 text-sm lg:text-base">EmpleaWorks</h3>
                                                <div className="space-y-1.5 lg:space-y-2">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="h-2 lg:h-3 bg-gray-200 rounded"></div>
                                                    ))}
                                                </div>
                                                <div className="mt-3 lg:mt-4 h-6 lg:h-8 bg-[#7c28eb] rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-xs font-semibold">Ver Ofertas</span>
                                                </div>
                                                <div className="mt-8 lg:mt-10 flex justify-center">
                                                    <img 
                                                        src="/images/icons8-android-os(1).svg" 
                                                        alt="Android" 
                                                        className="w-24 h-24 lg:w-35 lg:h-33 opacity-50"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Phone Button */}
                                        <div className="absolute bottom-1.5 lg:bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 lg:w-12 lg:h-1 bg-gray-600 rounded-full"></div>
                                    </motion.div>

                                    {/* Floating Elements */}
                                    <motion.div
                                        animate={{
                                            y: [0, -15, 0],
                                            rotate: [0, 5, 0],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg"
                                    >
                                        <Star className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                                    </motion.div>

                                    <motion.div
                                        animate={{
                                            y: [0, 10, 0],
                                            rotate: [0, -5, 0],
                                        }}
                                        transition={{
                                            duration: 3.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 1,
                                        }}
                                        className="absolute -bottom-4 -left-2 lg:-bottom-6 lg:-left-4 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg"
                                    >
                                        <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                                    </motion.div>
                                </div>

                                {/* Features List */}
                                <div className="space-y-3 lg:space-y-4">
                                    {features.map((feature, index) => (
                                        <motion.div
                                            key={feature.title}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + index * 0.1 }}
                                            className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-purple-100/50 dark:border-purple-800/30"
                                        >
                                            <div className="flex items-start gap-3 lg:gap-4">
                                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#7c28eb] to-[#9645f4] rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 lg:mb-2 text-sm lg:text-base">
                                                        {feature.title}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-300 text-xs lg:text-sm">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Bottom CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="text-center mt-16"
                        >
                            <div className="bg-gradient-to-r from-[#7c28eb]/10 to-[#FDC231]/10 rounded-3xl p-8 border border-purple-100/50 dark:border-purple-800/30">
                                <h2 className="text-3xl font-bold text-[#7c28eb] dark:text-purple-300 mb-4">
                                    {t("ready_find_job")}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                                    {t("join_thousands_users")}
                                </p>
                                <Button
                                    onClick={handleDownload}
                                    className="bg-gradient-to-r from-[#7c28eb] to-[#9645f4] hover:from-[#6a1fd0] hover:to-[#8a3ae0] text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                >
                                    {t("download_now")}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </AppLayout>
        </>
    )
}
