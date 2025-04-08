import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface ExtendedNavItem extends NavItem {
    disabled?: boolean;
    onClick?: () => void;
}

export function NavMain({ items = [] }: { items: ExtendedNavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            {/*<SidebarGroupLabel>Platform</SidebarGroupLabel>*/}
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                    {item.disabled ? (
                        // Renderiza un botón deshabilitado que sigue siendo clicable
                        <SidebarMenuButton
                            isActive={false}
                            tooltip={{ children: "Inicia sesión para acceder" }}
                            onClick={item.onClick}
                            className="opacity-50 hover:opacity-75 cursor-pointer"
                        >
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                        </SidebarMenuButton>
                    ) : (
                        // Renderiza el Link normal cuando no está deshabilitado
                        <SidebarMenuButton  
                            asChild 
                            isActive={item.href === page.url}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    )}
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
