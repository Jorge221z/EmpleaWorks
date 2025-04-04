import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarFooter } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { User } from 'lucide-react';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    return (
        <SidebarFooter className="p-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex h-10 w-full items-center gap-2 rounded-md px-2 outline-none ring-offset-2 ring-neutral-950 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-offset-2">
                        {auth.user ? (
                            <Avatar className="size-7">
                                <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                <AvatarFallback className="text-xs font-semibold">{getInitials(auth.user.name)}</AvatarFallback>
                            </Avatar>
                        ) : (
                            <Avatar className="size-7">
                                <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                                    <User className="size-4" />
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div className="flex flex-1 items-center justify-between">
                            <span className="truncate text-sm">
                                {auth.user ? auth.user.name : 'Guest User'}
                            </span>
                        </div>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <UserMenuContent user={auth.user} />
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
    );
}
