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
import { usePage, router } from "@inertiajs/react"
import { FileText, LayoutGrid, Lock, BuildingIcon, BookOpenCheck, Globe, MessageSquare, PanelLeft, BookmarkIcon, UsersIcon, Home, Smartphone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/utils/i18n"
import AppLogo from "./app-logo"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef } from "react"
import { MobileNavDialog } from "@/components/mobile-nav-dialog"

interface ExtendedNavItem extends NavItem {
    disabled?: boolean
    onClick?: () => void
    isActive?: boolean
}

export function AppSidebar() {
    // ----- HOOKS & STATE -----
    const { auth, locale } = usePage<SharedData>().props
    const { t } = useTranslation()
    const isAuthenticated = !!auth.user
    const isCompany = isAuthenticated && auth.user.role_id === 2
    const { state, openMobile, setOpenMobile } = useSidebar()
    const [isMobile, setIsMobile] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { url } = usePage()
    const userMenuContainerRef = useRef<HTMLDivElement>(null)

    // ----- SIDE EFFECTS -----
    // Detectar cambios en el tamaño de pantalla para responsive
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()

        window.addEventListener("resize", handleResize)

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    // ----- UTILITY FUNCTIONS -----
    const shouldShowTitle = isMobile || state !== "collapsed"

    const isRouteActive = (href: string): boolean => {
        if (href === '/dashboard') {
            return url === '/dashboard';
        }
        
        return url.startsWith(href);
    };

    // ----- NAVIGATION DATA -----
    const mainNavItems: ExtendedNavItem[] = [
        {
            title: t("dashboard"),
            href: "/dashboard",
            icon: LayoutGrid,
            isActive: isRouteActive("/dashboard"),
        },
    ]

    // Configurar elementos de navegación según el rol del usuario
    if (isCompany) {
        mainNavItems.push({
            title: t("company_dashboard"),
            href: "/company/dashboard",
            icon: BuildingIcon,
            isActive: isRouteActive("/company/dashboard"),
        });
        
        mainNavItems.push({
            title: t("applicants"),
            href: "/company/applicants",
            icon: UsersIcon,
            isActive: isRouteActive("/company/applicants"),
        });
    } else if (isAuthenticated){
        mainNavItems.push({
            title: t("my_offers"),
            href: "/candidate/dashboard",
            icon: Home,
            isActive: isRouteActive("/candidate/dashboard"),
        });

        mainNavItems.push({
            title: t("your_applications"),
            href: "/candidate/applications",
            icon: BookOpenCheck,
            isActive: isRouteActive("/candidate/applications"),
        });

        mainNavItems.push({
            title: t("saved_offers"),
            href: "/candidate/saved-offers",
            icon: BookmarkIcon,
            isActive: isRouteActive("/candidate/saved-offers"),
        });
    } else {
        mainNavItems.push({
            title: t("my_offers"),
            href: "/candidate/dashboard",
            icon: isAuthenticated ? BookOpenCheck : Lock,
            disabled: !isAuthenticated,
            isActive: isRouteActive("/candidate/dashboard"),
            onClick: !isAuthenticated
                ? () => {
                    window.location.href = route("login")
                }
                : undefined,
        });
    }

    // ----- COMPONENT DEFINITIONS -----
    // Componente selector de idioma
    const LanguageSelector = () => {
        // Detectar si estamos en mobile sidebar abierta
        const isMobileSidebarOpen = mobileMenuOpen && isMobile;
        return (
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="group/lang relative overflow-visible transition-all duration-300 hover:translate-x-1">
                            <Globe className="h-4 w-4 text-[#9645f4] dark:text-[#c79dff] group-hover/lang:text-[#7c28eb] dark:group-hover/lang:text-purple-200" />
                            {shouldShowTitle && (
                                <span className="sidebar-menu-button-text text-gray-700 dark:text-gray-300 group-hover/lang:text-[#7c28eb] dark:group-hover/lang:text-purple-200">
                                    {locale?.available[locale?.current] || "Idioma"}
                                </span>
                            )}
                            {shouldShowTitle && (
                                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-purple-500 to-purple-300 transition-all duration-300 group-hover/lang:w-full"></span>
                            )}
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="w-40 border-purple-100 dark:border-purple-600/50 dark:bg-gray-900 animate-in slide-in-from-left-5 duration-200"
                        style={isMobileSidebarOpen ? { zIndex: 13000 } : undefined}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {locale?.available &&
                            Object.entries(locale.available).map(([code, name]) => (
                                <DropdownMenuItem key={code} asChild>
                                    <button
                                        className={`flex items-center w-full px-2 py-1 transition-all duration-200 ${locale.current === code
                                                ? "font-semibold text-[#7c28eb] dark:text-purple-300"
                                                : "text-gray-700 dark:text-gray-300 hover:text-[#7c28eb] dark:hover:text-purple-300 font-medium"
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (isMobileSidebarOpen) setMobileMenuOpen(false);
                                            router.visit(route("locale.change", code));
                                        }}
                                    >
                                        {name}
                                    </button>
                                </DropdownMenuItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        )
    }

    // Componente enlace a términos y condiciones
    const TermsAndConditions = () => {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    className="group/terms relative overflow-visible transition-all duration-300 hover:translate-x-1"
                >
                    <button
                        className="flex items-center w-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.visit(route("terms"));
                        }}
                    >
                        <FileText className="h-4 w-4 text-[#9645f4] dark:text-[#c79dff] group-hover/terms:text-[#7c28eb] dark:group-hover/terms:text-purple-200" />
                        {shouldShowTitle && (
                            <span className="sidebar-menu-button-text text-gray-700 dark:text-gray-300 group-hover/terms:text-[#7c28eb] dark:group-hover/terms:text-purple-200">
                                {t("terms_and_conditions")}
                            </span>
                        )}
                        {shouldShowTitle && (
                            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-purple-500 to-purple-300 transition-all duration-300 group-hover/terms:w-full"></span>
                        )}
                    </button>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    // Componente enlace de contacto
    const ContactLink = () => {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    className="group/contact relative overflow-visible transition-all duration-300 hover:translate-x-1"
                >
                    <button
                        className="flex items-center w-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.visit(route("contact"));
                        }}
                    >
                        <MessageSquare className="h-4 w-4 text-[#9645f4] dark:text-[#c79dff] group-hover/contact:text-[#7c28eb] dark:group-hover/contact:text-purple-200" />
                        {shouldShowTitle && (
                            <span className="sidebar-menu-button-text text-gray-700 dark:text-gray-300 group-hover/contact:text-[#7c28eb] dark:group-hover/contact:text-purple-200">
                                {t("contact_us")}
                            </span>
                        )}
                        {shouldShowTitle && (
                            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-purple-500 to-purple-300 transition-all duration-300 group-hover/contact:w-full"></span>
                        )}
                    </button>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    // Componente enlace de descarga de app móvil
    const MobileAppDownload = () => {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    className="group/download relative overflow-visible transition-all duration-300 hover:translate-x-1"
                >
                    <button
                        className="flex items-center w-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.visit(route("download.app"));
                        }}
                    >
                        <Smartphone className="h-4 w-4 text-[#9645f4] dark:text-[#c79dff] group-hover/download:text-[#7c28eb] dark:group-hover/download:text-purple-200" />
                        {shouldShowTitle && (
                            <span className="sidebar-menu-button-text text-gray-700 dark:text-gray-300 group-hover/download:text-[#7c28eb] dark:group-hover/download:text-purple-200">
                                {t("download_app")}
                            </span>
                        )}
                        {shouldShowTitle && (
                            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-purple-500 to-purple-300 transition-all duration-300 group-hover/download:w-full"></span>
                        )}
                    </button>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    // ----- RENDER COMPONENT -----
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
          overflow: visible !important; /* Prevenir scroll */
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
          overflow: visible !important;
        }

        /* Mejorar el espaciado entre iconos y texto - Reducido */
        [data-sidebar="menu-button"]:not(.logo-button) a svg,
        [data-sidebar="menu-button"]:not(.logo-button) button svg {
          margin-right: 6px; /* Reducido de 10px a 6px */
        }
        
        /* Especificamente para el texto de los items de navegación */
        .sidebar-menu-button-text {
          margin-left: 0px; /* Eliminado el margen adicional de 4px */
        }
        
        /* Mantener espaciado en el logo */
        .logo-button svg,
        .logo-button button svg {
          margin-right: 10px;
        }
        
        /* Aplicar overflow visible a todos los contenedores principales */
        [data-sidebar="menu"],
        [data-sidebar="menu-item"],
        [data-sidebar="menu-container"],
        [data-sidebar="content"],
        [data-sidebar="header"],
        [data-sidebar="footer"] {
          overflow: visible !important;
        }
        
        [data-sidebar="menu-button"]:hover {
          transform: translateX(4px);
          background: rgba(150, 69, 244, 0.08);
        }

        /* Centrar iconos cuando la barra está colapsada - Mejorado */
        [data-sidebar-state="collapsed"] [data-sidebar="menu-button"],
        [data-sidebar-state="collapsed"] [data-sidebar="menu-button"] > a,
        [data-sidebar-state="collapsed"] [data-sidebar="menu-button"] > button {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        
        /* Asegurar centrado correcto para los main nav items */
        [data-sidebar-state="collapsed"] [data-sidebar="menu-button"] > a > svg,
        [data-sidebar-state="collapsed"] [data-sidebar="menu-button"] > button > svg,
        [data-sidebar-state="collapsed"] [data-sidebar="menu-button"] > svg {
          margin: 0 !important;
        }

        /* Centrar el contenido del texto cuando está colapsado */
        [data-sidebar-state="collapsed"] [data-sidebar="menu-item"] {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        /* Mantener ancho adecuado para los botones */
        [data-sidebar-state="collapsed"] [data-sidebar="menu-button"] {
          width: 100%;
        }
        
        /* Ajustar posición de los iconos en estado colapsado */
        [data-sidebar-state="collapsed"] [data-sidebar="menu-button"] a,
        [data-sidebar-state="collapsed"] [data-sidebar="menu-button"] button {
          width: 100%;
        }

        /* Estilos específicos para los indicadores - con mejor manejo de overflow */
        /* Solo aplicamos overflow visible a los elementos que necesitan mostrar los indicadores */
        [data-sidebar="menu-button"].menu-item-active,
        [data-sidebar="menu-button"]:not(.user-profile-button) {
          overflow: visible !important;
        }

        /* Preservar comportamiento normal para estado colapsado */
        [data-sidebar-state="collapsed"] [data-sidebar="menu"],
        [data-sidebar-state="collapsed"] [data-sidebar="menu-item"] {
          overflow: visible !important;
        }
        
        /* Barra vertical izquierda en hover */
        [data-sidebar="menu-button"]:not(.user-profile-button)::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          height: 0;
          width: 3px;
          background: linear-gradient(to bottom, #9645f4, #c48eff);
          transform: translateY(-50%);
          opacity: 0;
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 8px rgba(150, 69, 244, 0.2);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 5;
        }
        
        [data-sidebar="menu-button"]:not(.user-profile-button):hover::before {
          height: 70%;
          opacity: 1;
          box-shadow: 0 0 12px rgba(150, 69, 244, 0.4);
        }
        
        /* Efecto especial para elementos activos */
        .menu-item-active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          height: 70% !important;
          width: 3px;
          background: linear-gradient(to bottom, #8a34ef, #b368ff) !important;
          transform: translateY(-50%);
          opacity: 1 !important;
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 12px rgba(150, 69, 244, 0.6) !important;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 5;
        }

        /* Estilo para el indicador de activo en los elementos del menú */
        .menu-item-active::after {
          content: '';
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(45deg, #9645f4, #b368ff);
          box-shadow: 0 0 8px rgba(150, 69, 244, 0.7);
          animation: pulse 2s infinite;
          transition: all 0.3s ease;
          z-index: 5;
        }

        /* Ajustes para el estado colapsado - Ocultar el indicador (la bola) */
        [data-sidebar-state="collapsed"] .menu-item-active::after {
          display: none; /* Ocultar el indicador en estado colapsado */
        }

        [data-sidebar-state="collapsed"] [data-sidebar="menu-button"]::before {
          left: 50%;
          top: auto;
          bottom: 0;
          transform: translateX(-50%);
          width: 0;
          height: 3px;
        }

        [data-sidebar-state="collapsed"] [data-sidebar="menu-button"]:hover::before {
          width: 70%;
          height: 3px;
        }

        [data-sidebar-state="collapsed"] .menu-item-active::before {
          left: 50%;
          top: auto;
          bottom: 0;
          transform: translateX(-50%);
          width: 70% !important;
          height: 3px !important;
        }

        /* Restablecer transformación en hover para estado colapsado */
        [data-sidebar-state="collapsed"] [data-sidebar="menu-button"]:hover {
          transform: translateY(-4px);
        }

        /* Animación para el punto de activo */
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(150, 69, 244, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(150, 69, 244, 0); }
          100% { box-shadow: 0 0 0 0 rgba(150, 69, 244, 0); }
        }

        /* Efecto hover en el punto para que resalte */
        .menu-item-active:hover::after {
          transform: translateY(-50%) scale(1.2);
          background: linear-gradient(45deg, #8a34ef, #c48eff);
        }

        /* Eliminar también el hover del punto en estado colapsado */
        [data-sidebar-state="collapsed"] .menu-item-active:hover::after {
          display: none;
        }
        
        /* Agregar cursor pointer a todos los botones en la sidebar de desktop */
        @media (min-width: 768px) {
          [data-sidebar="sidebar"] button,
          [data-sidebar="sidebar"] a,
          [data-sidebar="menu-button"],
          .logo-button,
          .sidebar-menu-button-text,
          [data-sidebar="menu-item"] button,
          [data-sidebar="menu-item"] a {
            cursor: pointer;
          }
          
          /* Cursor pointer para los elementos del dropdown */
          [role="menu"] [role="menuitem"],
          .DropdownMenuContent button,
          .DropdownMenuContent a,
          [data-radix-dropdown-menu-content] button,
          [data-radix-dropdown-menu-content] a,
          .dropdown-menu-content *,
          [class*="dropdown"] button,
          [class*="dropdown"] a,
          [class*="dropdown-menu"] *,
          [id*="radix-"] button,
          [id*="radix-"] a,
          [data-state="open"] ~ div button,
          [data-state="open"] ~ div a {
            cursor: pointer !important;
          }
        }
        
        /* Clase de depuración para hacer muy visible el sidebar móvil */
        .fixed-mobile-sidebar-debug {
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          bottom: 0 !important;
          width: 85% !important;
          max-width: 300px !important;
          z-index: 9999 !important;
          background: white !important;
          border-right: 2px solid purple !important;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5) !important;
        }
        
        /* Asegurar que el contenido de Radix Sheet es visible */
        [role="dialog"] {
          z-index: 10000 !important;
        }

        /* Fondo redondeado y suave para el trigger mobile sidebar */
        .mobile-sidebar-trigger-bg {
          background: #FFFFFF; /* Fondo sólido blanco en tema light */
          border-radius: 9999px;
          border: 2px solid #000000; /* Borde negro más gordo en tema light */
          box-shadow: 0 2px 8px 0 rgba(150,69,244,0.08);
          transition: background 0.2s, box-shadow 0.2s, border 0.2s;
        }
        .dark .mobile-sidebar-trigger-bg {
          background: #000000; /* Fondo sólido negro en tema dark */
          border: 2px solid #FFFFFF; /* Borde blanco más gordo en tema dark */
        }

        /* Forzar el z-index del contenedor del menú de usuario en mobile */
        .mobile-user-menu-z {
          position: relative;
          z-index: 11000 !important;
        }
        /* Forzar el z-index del dropdown del usuario y moverlo a la derecha en mobile */
        .user-dropdown-z {
          z-index: 12000 !important;
          left: 56px !important; /* Ajusta este valor según el ancho de tu sidebar */
        }
        /* Asegurar que el Sheet y overlay no tapen el menú */
        [role="dialog"] {
          z-index: 10000 !important;
        }
        .radix-portal {
          z-index: 12000 !important;
        }
      `}</style>

            {/* Mobile Menu Trigger - Solo visible en móvil */}
            <div className="fixed top-1 left-3 z-50 md:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    className="min-h-[40px] min-w-[40px] h-10 w-10 rounded-full shadow-md mobile-sidebar-trigger-bg flex items-center justify-center"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <PanelLeft className="h-6 w-6 text-black dark:text-white" />
                    <span className="sr-only">Abrir menú</span>
                </Button>
            </div>

            {/* Mobile Navigation - Usar nuestro componente personalizado */}
            <MobileNavDialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-4 overflow-hidden">
                        <NavMain 
                            items={mainNavItems} 
                            onNavigate={() => setMobileMenuOpen(false)}
                            isMobile={true}
                        />
                        <div className="pt-10 mt-38">
                            <SidebarMenu className="mt-4">
                                <LanguageSelector />
                                <TermsAndConditions />
                                <ContactLink />
                                <MobileAppDownload />
                            </SidebarMenu>
                        </div>
                    </div>
                    {/* Footer fijo abajo para el perfil */}
                    <div className="pt-4 pb-6 px-2">
                        <div ref={userMenuContainerRef} className="mobile-user-menu-z">
                            <NavUser 
                                dropdownContainer={userMenuContainerRef.current}
                                dropdownClassName="user-dropdown-z"
                                dropdownAlign="start"
                                dropdownSideOffset={16}
                            />
                        </div>
                    </div>
                </div>
            </MobileNavDialog>
            
            {/* Desktop Sidebar */}
            <Sidebar 
                collapsible="icon" 
                variant="inset" 
                className="transition-all duration-300 shadow-sm hidden md:flex"
                data-sidebar-state={state}
                mobileSidebarDisabled={true}
            >
                <SidebarHeader className="bg-transparent pb-4 transition-all duration-300 z-10 relative">
                    <SidebarMenu>
                        <SidebarMenuItem className="logo-menu-item">
                            <SidebarMenuButton size="lg" asChild className="group/logo logo-button">
                                <button 
                                    onClick={() => router.visit('/dashboard')} 
                                    className="flex items-center gap-2 justify-center"
                                >
                                    <div className="logo-glow">
                                        <AppLogo className="h-12 w-8 bg-transparent p-0 m-0 transition-transform duration-300" />
                                    </div>
                                    {shouldShowTitle && (
                                        <span className="text-xl font-bold tracking-tight group-hover/logo:text-purple-600 dark:group-hover/logo:text-purple-300 transition-colors -ml-1">
                                            EmpleaWorks
                                        </span>
                                    )}
                                </button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent className="bg-transparent pt-4 pb-4 transition-all duration-300 z-10 relative">
                    <NavMain 
                        items={mainNavItems}
                        isMobile={isMobile}
                    />
                </SidebarContent>

                <SidebarFooter className="bg-transparent pt-4 transition-all duration-300 z-10 relative">
                    <SidebarMenu className="mt-auto">
                        <LanguageSelector />
                        <TermsAndConditions />
                        <ContactLink />
                        <MobileAppDownload />
                    </SidebarMenu>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
        </>
    )
}

