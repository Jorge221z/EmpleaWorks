import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ComponentType } from 'react';

interface NavMainProps {
    items: (NavItem & {
        disabled?: boolean;
        onClick?: () => void;
    })[];
}

export function NavMain({ items }: NavMainProps) {
    const { url } = usePage(); // usamos usePage para obtener la URL actual
    const { state } = useSidebar();

    // Verificar si un ítem está activo
    const isItemActive = (item: NavItem) => {
        const currentPath = url;
        return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
    };

    return (
        <SidebarMenu>
            <SidebarGroup>
                {items.map((item, index) => {
                    const isActive = isItemActive(item);
                    const Icon = item.icon as ComponentType<{ className?: string }>;
                    const groupName = `nav-item-${index}`; // nombre único para cada grupo

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
                                    {state !== 'collapsed' && (
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
                                    <Link href={item.href}>
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
                                        {state !== 'collapsed' && (
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
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarGroup>
        </SidebarMenu>
    );
}
