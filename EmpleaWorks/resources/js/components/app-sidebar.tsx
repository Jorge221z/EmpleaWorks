import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { FileText, LayoutGrid, Lock, BuildingIcon, BookOpenCheck, Globe } from 'lucide-react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/utils/i18n';
import AppLogo from './app-logo';

interface ExtendedNavItem extends NavItem {
    disabled?: boolean;
    onClick?: () => void;
}

export function AppSidebar() {
    const { auth, locale } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const isAuthenticated = !!auth.user;
    const isCompany = isAuthenticated && auth.user.role_id === 2;
    
    const mainNavItems: ExtendedNavItem[] = [
        {
            title: t('dashboard'),
            href: '/dashboard',
            icon: LayoutGrid,
        }       
    ];

    const footerNavItems: NavItem[] = [
        {
            title: t('terms_and_conditions'),
            href: route('terms'),
            icon: FileText,
        },
    ];
    
    // Mostrar diferentes opciones según el rol del usuario
    if (isCompany) {
        mainNavItems.push({
            title: t('company_dashboard'),
            href: '/company/dashboard',
            icon: BuildingIcon,
        });
    } else {
        mainNavItems.push({
            title: t('my_offers'),
            href: '/candidate/dashboard',
            icon: isAuthenticated ? BookOpenCheck : Lock,
            disabled: !isAuthenticated,
            onClick: !isAuthenticated ? () => {
                window.location.href = route('login');
            } : undefined,
        });
    }

    // Componente para el selector de idioma
    const LanguageSelector = () => {
        return (
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton>
                            <Globe className="h-4 w-4" />
                            <span className="sidebar-menu-button-text">
                                {locale?.available[locale?.current] || 'Idioma'}
                            </span>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                        {locale?.available && Object.entries(locale.available).map(([code, name]) => (
                            <DropdownMenuItem key={code} asChild>
                                <Link 
                                    href={route('locale.change', code)} 
                                    method="get"
                                    as="button"
                                    type="button"
                                    preserveState={false}
                                    preserveScroll={false}
                                    className={`flex items-center w-full px-2 py-1 ${locale.current === code ? 'font-medium text-primary' : ''}`}
                                >
                                    {name}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        );
    };

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
                {/* Añadir selector de idioma */}
                <SidebarMenu>
                    <LanguageSelector />
                </SidebarMenu>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
