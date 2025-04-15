import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Lock, BuildingIcon, BookOpenCheck } from 'lucide-react';
import AppLogo from './app-logo';

interface ExtendedNavItem extends NavItem {
    disabled?: boolean;
    onClick?: () => void;
  }

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth.user;
    const isCompany = isAuthenticated && auth.user.role_id === 2;
    
    const mainNavItems: ExtendedNavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        }       
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/Jorge221z/EmpleaWorks',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits',
            icon: BookOpen,
        },
    ];
    // Mostrar diferentes opciones según el rol del usuario
    if (isCompany) {
        mainNavItems.push({
            title: 'Company Dashboard',
            href: '/company/dashboard',
            icon: BuildingIcon,
        });
    } else {
        mainNavItems.push({
            title: 'Mis Ofertas',
            href: '/candidate/dashboard',
            icon: isAuthenticated ? BookOpenCheck : Lock,
            disabled: !isAuthenticated,
            onClick: !isAuthenticated ? () => {
                window.location.href = route('login');
            } : undefined,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
