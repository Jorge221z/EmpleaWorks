import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface ExtendedNavItem extends NavItem {
    disabled?: boolean;
    onClick?: () => void;
}

export function NavMain({ items = [] }: { items: ExtendedNavItem[] }) {
    const page = usePage();
    const { state } = useSidebar();

    // Estilos:
    const activeStyles = "bg-purple-100 dark:bg-purple-800/50";
    
    const hoverStyles = "hover:bg-purple-50 dark:hover:bg-purple-800/40 group";
    
    const iconBaseStyles = "text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb] dark:group-hover:text-purple-200";
    const iconActiveStyles = "text-[#7c28eb] dark:text-purple-300 drop-shadow-sm";

    const textBaseStyles = "text-[#9645f4] dark:text-[#c79dff] font-medium group-hover:text-[#7c28eb] dark:group-hover:text-purple-200";
    const textActiveStyles = "text-[#7c28eb] dark:text-purple-300 font-semibold";

    const disabledStyles = "opacity-60 cursor-pointer";

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                    {item.disabled ? (
                        <SidebarMenuButton
                            isActive={false}
                            tooltip={{ children: "Inicia sesión para acceder" }}
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                item.onClick?.();
                            }}
                            className={cn(
                                disabledStyles,
                                hoverStyles
                            )}
                        >
                            {item.icon && <item.icon className={iconBaseStyles} />}
                            <span className={textBaseStyles}>{item.title}</span>
                        </SidebarMenuButton>
                    ) : (
                        <SidebarMenuButton  
                            asChild 
                            isActive={item.href === page.url}
                            tooltip={{ children: item.title }}
                            className={cn(
                                "transition-colors duration-200",
                                item.href === page.url ? activeStyles : "",
                                hoverStyles
                            )}
                        >
                            <Link href={item.href} prefetch className="w-full">
                                {item.icon && <item.icon className={item.href === page.url ? iconActiveStyles : iconBaseStyles} />}
                                <span className={item.href === page.url ? textActiveStyles : textBaseStyles}>
                                    {item.title}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    )}
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
