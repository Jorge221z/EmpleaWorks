import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { ComponentType, useEffect, useState } from 'react';
import { useMobileSidebarClose } from "@/components/mobile-sidebar";

interface NavMainProps {
    items: (NavItem & {
        disabled?: boolean;
        onClick?: () => void;
    })[];
    onNavigate?: () => void;
}

export function NavMain({ items, onNavigate }: NavMainProps) {
    const { url } = usePage(); 
    const { state } = useSidebar();
    const [isMobile, setIsMobile] = useState(false);
    const closeSidebar = useMobileSidebarClose();

    // Detectar si es dispositivo móvil
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Verificar si un ítem está activo
    const isItemActive = (item: NavItem) => {
        const currentPath = url;
        return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
    };

    // Determinar si se debe mostrar el texto
    const shouldShowText = isMobile || state !== 'collapsed';

    return (
        <SidebarMenu>
            <SidebarGroup>
                {items.map((item, index) => {
                    const isActive = isItemActive(item);
                    const Icon = item.icon as ComponentType<{ className?: string }>;
                    const groupName = `nav-item-${index}`; 

                    // Función simplificada para manejar clics
                    const handleItemClick = (e: React.MouseEvent) => {
                        // Detener el evento para evitar propagación
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Para elementos deshabilitados
                        if (item.disabled) {
                            if (item.onClick) item.onClick();
                            return;
                        }
                        
                        // Ejecutar onClick personalizado si existe
                        if (item.onClick) {
                            item.onClick();
                        }
                        
                        // Notificar al componente padre
                        if (onNavigate) {
                            onNavigate();
                        }
                        
                        // Navegar directamente sin más lógica
                        router.visit(item.href);
                    };

                    return (
                        <SidebarMenuItem key={item.href}>
                            {item.disabled ? (
                                <SidebarMenuButton
                                    size="default"
                                    disabled={item.disabled}
                                    className={`group/${groupName}`}
                                    onClick={item.onClick}
                                >
                                    {Icon && (
                                        <Icon 
                                            className={cn(
                                                "h-4 w-4",
                                                "text-[#9645f4] dark:text-[#c79dff]",
                                                `group-hover/${groupName}:text-[#7c28eb] dark:group-hover/${groupName}:text-purple-200`
                                            )} 
                                        />
                                    )}
                                    {shouldShowText && (
                                        <span 
                                            className={cn(
                                                "sidebar-menu-button-text",
                                                "text-gray-700 dark:text-gray-300",
                                                `group-hover/${groupName}:text-[#7c28eb] dark:group-hover/${groupName}:text-purple-200`,
                                                "opacity-60"
                                            )}
                                        >
                                            {item.title}
                                        </span>
                                    )}
                                </SidebarMenuButton>
                            ) : (
                                <SidebarMenuButton
                                    size="default"
                                    asChild
                                    className={cn(
                                        `group/${groupName}`, 
                                        isActive && "bg-purple-100 dark:bg-purple-800/50"
                                    )}
                                >
                                    <button 
                                        onClick={handleItemClick}
                                        className="flex items-center w-full"
                                    >
                                        {Icon && (
                                            <Icon 
                                                className={cn(
                                                    "h-4 w-4",
                                                    isActive 
                                                        ? "text-[#7c28eb] dark:text-purple-300 drop-shadow-sm" 
                                                        : `text-[#9645f4] dark:text-[#c79dff] group-hover/${groupName}:text-[#7c28eb] dark:group-hover/${groupName}:text-purple-200`
                                                )} 
                                            />
                                        )}
                                        {shouldShowText && (
                                            <span 
                                                className={cn(
                                                    "sidebar-menu-button-text",
                                                    isActive 
                                                        ? "text-[#7c28eb] dark:text-purple-300 font-semibold" 
                                                        : `text-gray-700 dark:text-gray-300 group-hover/${groupName}:text-[#7c28eb] dark:group-hover/${groupName}:text-purple-200`
                                                )}
                                            >
                                                {item.title}
                                            </span>
                                        )}
                                    </button>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarGroup>
        </SidebarMenu>
    );
}
