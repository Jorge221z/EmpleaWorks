import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { SidebarFooter } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type SharedData } from '@/types';
import { usePage, router } from '@inertiajs/react';
import { User } from 'lucide-react';
import { useTranslation } from '@/utils/i18n';
import { cn } from '@/lib/utils';
import { route } from "ziggy-js";
import { useMobileSidebarClose } from '@/components/mobile-sidebar';

interface NavUserProps {
    closeMenu?: () => void;
    dropdownContainer?: HTMLElement | null;
    dropdownClassName?: string;
}

export function NavUser({ closeMenu, dropdownContainer, dropdownClassName }: NavUserProps) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const { t } = useTranslation();
    const closeSidebar = useMobileSidebarClose();

    const handleNavigate = (url: string) => {
        // Cerrar el menú si es necesario
        if (closeMenu) {
            closeMenu();
        }
        
        // Cerrar la barra lateral móvil si es necesario
        if (closeSidebar) {
            closeSidebar();
        }
        
        // Navegar con un pequeño retraso
        setTimeout(() => {
            router.visit(url);
        }, 100);
    };

    // Comprobar si la ruta existe en Ziggy
    const hasProfileRoute = route().hasOwnProperty('settings.profile');

    return (
        <SidebarFooter className="p-0 border-t border-purple-100 dark:border-purple-600/30 overflow-visible">
            <div className="flex items-center justify-between px-0 py-2 w-full">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={cn(
                            "flex h-10 w-full items-center gap-2 rounded-md outline-none group",
                            "ring-offset-5 ring-purple-600 transition-colors",
                            "hover:bg-purple-50 dark:hover:bg-purple-800/40", 
                            "focus-visible:ring-2 focus-visible:ring-offset-2"
                        )}>
                            {auth.user ? (
                                <Avatar className="border-2 border-purple-100 dark:border-purple-500/50">
                                    <AvatarImage
                                        src={auth.user.image ? `/storage/${auth.user.image}` : undefined}
                                        alt={auth.user.name}
                                        className="object-cover aspect-square"
                                    />
                                    <AvatarFallback className="text-xs font-semibold bg-purple-100 dark:bg-purple-800 text-[#7c28eb] dark:text-purple-200">{getInitials(auth.user.name)}</AvatarFallback>
                                </Avatar>
                            ) : (
                                <Avatar className="border-2 border-purple-100 dark:border-purple-500/50">
                                    <AvatarFallback className="text-xs font-semibold bg-[#7c28eb] text-white">
                                        <User className="size-4" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div className="flex start-2 justify-items-start gap-2 overflow-hidden text-ellipsis">
                                <span className="truncate text-sm font-medium leading-tight text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb] dark:group-hover:text-purple-200 transition-colors duration-200">
                                    {auth.user ? auth.user.name : t('guest_user')}
                                </span>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        align="end" 
                        className={dropdownClassName}
                        container={dropdownContainer}
                    >
                        
                        
                        {hasProfileRoute && (
                            <DropdownMenuItem asChild>
                                <button 
                                    className="cursor-pointer w-full text-left"
                                    onClick={() => handleNavigate(route('settings.profile'))}
                                >
                                    {t('profile')}
                                </button>
                            </DropdownMenuItem>
                        )}
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </SidebarFooter>
    );
}
