import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
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
    const { state } = useSidebar();

    const mainNavItems: ExtendedNavItem[] = [
        {
            title: t('dashboard'),
            href: '/dashboard',
            icon: LayoutGrid,
        }       
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

    // Componente de Términos y Condiciones
    const TermsAndConditions = () => {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link 
                        href={route('terms')} 
                        className="flex items-center w-full"
                        preserveState
                    >
                        <FileText className="h-4 w-4" />
                        <span className="sidebar-menu-button-text">
                            {t('terms_and_conditions')}
                        </span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch className="flex items-center gap-2 group justify-center">
                                <AppLogo className="h-12 w-8 bg-transparent p-0 m-0" />
                                {state !== 'collapsed' && (
                                    <span className="text-xl font-bold tracking-tight hover:text-purple-600 transition-colors -ml-1">
                                        EmpleaWorks
                                    </span>
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="mt-6">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu className="mt-auto">
                    <TermsAndConditions />
                    <LanguageSelector />
                </SidebarMenu>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
