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
                        <SidebarMenuButton className="group/lang">
                            <Globe className="h-4 w-4 text-[#9645f4] dark:text-[#c79dff] group-hover/lang:text-[#7c28eb] dark:group-hover/lang:text-purple-200" />
                            <span className="sidebar-menu-button-text text-gray-700 dark:text-gray-300 group-hover/lang:text-[#7c28eb] dark:group-hover/lang:text-purple-200">
                                {locale?.available[locale?.current] || 'Idioma'}
                            </span>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40 border-purple-100 dark:border-purple-600/50 dark:bg-gray-900">
                        {locale?.available && Object.entries(locale.available).map(([code, name]) => (
                            <DropdownMenuItem key={code} asChild>
                                <Link 
                                    href={route('locale.change', code)} 
                                    method="get"
                                    as="button"
                                    type="button"
                                    preserveState={false}
                                    preserveScroll={false}
                                    className={`flex items-center w-full px-2 py-1 ${
                                        locale.current === code 
                                            ? 'font-semibold text-[#7c28eb] dark:text-purple-300' 
                                            : 'text-gray-700 dark:text-gray-300 hover:text-[#7c28eb] dark:hover:text-purple-300 font-medium'
                                    }`}
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
                <SidebarMenuButton 
                    asChild
                    className="group/terms"
                >
                    <Link 
                        href={route('terms')} 
                        className="flex items-center w-full"
                        preserveState
                    >
                        <FileText className="h-4 w-4 text-[#9645f4] dark:text-[#c79dff] group-hover/terms:text-[#7c28eb] dark:group-hover/terms:text-purple-200" />
                        <span className="sidebar-menu-button-text text-gray-700 dark:text-gray-300 group-hover/terms:text-[#7c28eb] dark:group-hover/terms:text-purple-200">
                            {t('terms_and_conditions')}
                        </span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    return (
        <Sidebar 
            collapsible="icon" 
            variant="inset"
            className="border-r border-purple-100 dark:border-purple-600/30 bg-gradient-to-b from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-950/40"
        >
            <SidebarHeader className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="group/logo">
                            <Link href="/dashboard" prefetch className="flex items-center gap-2 justify-center">
                                <AppLogo className="h-12 w-8 bg-transparent p-0 m-0" />
                                {state !== 'collapsed' && (
                                    <span className="text-xl font-bold tracking-tight group-hover/logo:text-purple-600 dark:group-hover/logo:text-purple-300 transition-colors -ml-1">
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

            <SidebarFooter className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm">
                <SidebarMenu className="mt-auto">
                    <TermsAndConditions />
                    <LanguageSelector />
                </SidebarMenu>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
