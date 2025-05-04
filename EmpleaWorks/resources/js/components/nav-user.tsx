import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarFooter } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { User } from 'lucide-react';
import { useTranslation } from '@/utils/i18n';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const { t } = useTranslation();

    return (
        <SidebarFooter className="p-0 border-t border-t-border overflow-visible">
            <div className="flex items-center justify-between px-0 py-2 w-full">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex h-10 w-full items-center gap-2 rounded-md outline-none ring-offset-5 ring-gray-950 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-offset-2">
                        {auth.user ? (
                            <Avatar className="">
                                <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                <AvatarFallback className="text-xs font-semibold">{getInitials(auth.user.name)}</AvatarFallback>
                            </Avatar>
                        ) : (
                            <Avatar className="">
                                <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                                    <User className="size-4" />
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div className="flex start-2 justify-items-start gap-2 overflow-hidden text-ellipsis">
                            <span className="truncate text-sm font-medium leading-tight text-foreground">
                                {auth.user ? auth.user.name : t('guest_user')}
                            </span>
                        </div>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <UserMenuContent user={auth.user} />
                </DropdownMenuContent>
                </DropdownMenu>
                </div>
        </SidebarFooter>
    );
}
