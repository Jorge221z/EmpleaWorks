"use client"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import type { NavItem, SharedData } from "@/types"
import { Link, usePage } from "@inertiajs/react"
import { FileText, LayoutGrid, Lock, BuildingIcon, BookOpenCheck, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/utils/i18n"
import AppLogo from "./app-logo"
import { useEffect, useState } from "react"

interface ExtendedNavItem extends NavItem {
    disabled?: boolean
    onClick?: () => void
}

export function AppSidebar() {
    const { auth, locale } = usePage<SharedData>().props
    const { t } = useTranslation()
    const isAuthenticated = !!auth.user
    const isCompany = isAuthenticated && auth.user.role_id === 2
    const { state } = useSidebar()
    const [isMobile, setIsMobile] = useState(false)
    const { url } = usePage()

    // Detectar si es dispositivo móvil
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768) // 768px es el breakpoint típico para móvil
        }

        // Establecer el estado inicial
        handleResize()

        // Añadir el event listener
        window.addEventListener("resize", handleResize)

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    // Determinar si se debe mostrar el texto del título
    const shouldShowTitle = isMobile || state !== "collapsed"

    const mainNavItems: ExtendedNavItem[] = [
        {
            title: t("dashboard"),
            href: "/dashboard",
            icon: LayoutGrid,
        },
    ]

    // Mostrar diferentes opciones según el rol del usuario
    if (isCompany) {
        mainNavItems.push({
            title: t("company_dashboard"),
            href: "/company/dashboard",
            icon: BuildingIcon,
        })
    } else {
        mainNavItems.push({
            title: t("my_offers"),
            href: "/candidate/dashboard",
            icon: isAuthenticated ? BookOpenCheck : Lock,
            disabled: !isAuthenticated,
            onClick: !isAuthenticated
                ? () => {
                    window.location.href = route("login")
                }
                : undefined,
        })
    }

    // Componente para el selector de idioma
    const LanguageSelector = () => {
        return (
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="group/lang relative overflow-hidden transition-all duration-300 hover:translate-x-1">
                            <Globe className="h-4 w-4 text-[#9645f4] dark:text-[#c79dff] group-hover/lang:text-[#7c28eb] dark:group-hover/lang:text-purple-200" />
                            <span className="sidebar-menu-button-text text-gray-700 dark:text-gray-300 group-hover/lang:text-[#7c28eb] dark:group-hover/lang:text-purple-200">
                                {locale?.available[locale?.current] || "Idioma"}
                            </span>
                            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-purple-500 to-purple-300 transition-all duration-300 group-hover/lang:w-full"></span>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="w-40 border-purple-100 dark:border-purple-600/50 dark:bg-gray-900 animate-in slide-in-from-left-5 duration-200"
                    >
                        {locale?.available &&
                            Object.entries(locale.available).map(([code, name]) => (
                                <DropdownMenuItem key={code} asChild>
                                    <Link
                                        href={route("locale.change", code)}
                                        method="get"
                                        as="button"
                                        type="button"
                                        preserveState={false}
                                        preserveScroll={false}
                                        className={`flex items-center w-full px-2 py-1 transition-all duration-200 ${locale.current === code
                                                ? "font-semibold text-[#7c28eb] dark:text-purple-300"
                                                : "text-gray-700 dark:text-gray-300 hover:text-[#7c28eb] dark:hover:text-purple-300 font-medium"
                                            }`}
                                    >
                                        {name}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        )
    }

    // Componente de Términos y Condiciones
    const TermsAndConditions = () => {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    className="group/terms relative overflow-hidden transition-all duration-300 hover:translate-x-1"
                >
                    <Link href={route("terms")} className="flex items-center w-full" preserveState>
                        <FileText className="h-4 w-4 text-[#9645f4] dark:text-[#c79dff] group-hover/terms:text-[#7c28eb] dark:group-hover/terms:text-purple-200" />
                        <span className="sidebar-menu-button-text text-gray-700 dark:text-gray-300 group-hover/terms:text-[#7c28eb] dark:group-hover/terms:text-purple-200">
                            {t("terms_and_conditions")}
                        </span>
                        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-purple-500 to-purple-300 transition-all duration-300 group-hover/terms:w-full"></span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    return (
        <>
            {/* Estilos globales para animar los elementos de navegación */}
            <style>{`
        /* Gradiente en movimiento sutil */
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Estilo para el contenedor principal */
        [data-sidebar="sidebar"] {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,235,255,0.95) 100%);
          position: relative;
          overflow: hidden;
          border-right: 1px solid rgba(150, 69, 244, 0.2);
        }
        
        .dark [data-sidebar="sidebar"] {
          background: linear-gradient(135deg, rgba(30,30,40,0.95) 0%, rgba(50,30,70,0.95) 100%);
        }
        
        /* Gradiente animado para el fondo */
        [data-sidebar="sidebar"]::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, 
            rgba(150, 69, 244, 0.03) 0%, 
            rgba(236, 72, 153, 0.03) 25%, 
            rgba(150, 69, 244, 0.03) 50%, 
            rgba(236, 72, 153, 0.03) 75%, 
            rgba(150, 69, 244, 0.03) 100%);
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
          pointer-events: none;
          z-index: 0;
        }
        
        /* Estilos para los elementos del menú */
        [data-sidebar="menu-button"] {
          position: relative;
          transition: all 0.3s ease;
          z-index: 1;
          border-radius: 6px;
        }
        
        [data-sidebar="menu-button"]:hover {
          transform: translateX(4px);
          background: rgba(150, 69, 244, 0.08);
        }
        
        [data-sidebar="menu-item"] {
          position: relative;
          margin: 2px 0;
        }
        
        /* Indicador de barra lateral */
        [data-sidebar="menu-item"]::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 0;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: linear-gradient(to bottom, #9645f4, #a855f7);
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        [data-sidebar="menu-item"]:hover::before {
          opacity: 0.7;
          height: 70%;
        }
        
        /* Estilo para elementos activos basado en la URL actual */
        [data-sidebar="menu-item"] a[href^="${url}"] {
          background: rgba(150, 69, 244, 0.1);
          font-weight: 500;
        }
        
        [data-sidebar="menu-item"] a[href^="${url}"]::after {
          content: '';
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #9645f4;
          box-shadow: 0 0 5px 0 rgba(150, 69, 244, 0.5);
        }
        
        [data-sidebar="menu-item"] a[href^="${url}"]::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 70%;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: linear-gradient(to bottom, #9645f4, #a855f7);
          opacity: 1;
        }
        
        /* Animación de pulso para el indicador */
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(150, 69, 244, 0.5);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(150, 69, 244, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(150, 69, 244, 0);
          }
        }
        
        /* Efecto de brillo para el logo */
        .logo-glow {
          position: relative;
        }
        
        .logo-glow::after {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(150, 69, 244, 0.3) 0%, rgba(150, 69, 244, 0) 70%);
          opacity: 0;
          z-index: -1;
          filter: blur(8px);
          transition: opacity 0.3s ease;
        }
        
        .logo-glow:hover::after {
          opacity: 1;
        }
        
        /* Estilo para la barra de desplazamiento */
        [data-sidebar="content"]::-webkit-scrollbar {
          width: 5px;
        }
        
        [data-sidebar="content"]::-webkit-scrollbar-track {
          background: rgba(150, 69, 244, 0.05);
          border-radius: 10px;
        }
        
        [data-sidebar="content"]::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #9645f4, #a855f7);
          border-radius: 10px;
        }
      `}</style>

            <Sidebar collapsible="icon" variant="inset" className="transition-all duration-300 shadow-sm">
                <SidebarHeader className="bg-transparent pb-4 transition-all duration-300 z-10 relative">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild className="group/logo">
                                <Link href="/dashboard" prefetch className="flex items-center gap-2 justify-center">
                                    <div className="logo-glow">
                                        <AppLogo className="h-12 w-8 bg-transparent p-0 m-0 transition-transform duration-300 hover:scale-105" />
                                    </div>
                                    {shouldShowTitle && (
                                        <span className="text-xl font-bold tracking-tight group-hover/logo:text-purple-600 dark:group-hover/logo:text-purple-300 transition-colors -ml-1">
                                            EmpleaWorks
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent className="bg-transparent pt-4 pb-4 transition-all duration-300 z-10 relative">
                    <NavMain items={mainNavItems} />
                </SidebarContent>

                <SidebarFooter className="bg-transparent pt-4 transition-all duration-300 z-10 relative">
                    <SidebarMenu className="mt-auto">
                        <TermsAndConditions />
                        <LanguageSelector />
                    </SidebarMenu>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
        </>
    )
}

