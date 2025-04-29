import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";
import { LogOut, Settings, User } from "lucide-react";
import { useTranslation } from "@/utils/i18n";

interface UserMenuContentProps {
    user: {
        name: string;
        email: string;
    } | null;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const { t } = useTranslation();
    
    // Function to handle direct navigation without Inertia
    const navigateToLogin = () => {
        window.location.href = route('login');
    };

    const navigateToRegister = () => {
        window.location.href = route('register');
    };

    if (!user) {
        return (
            <>
                <DropdownMenuLabel>{t('account')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={navigateToLogin}>
                        <User className="mr-2 size-4" />
                        <span>{t('log_in')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={navigateToRegister}>
                        <User className="mr-2 size-4" />
                        <span>{t('register')}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </>
        );
    }

    return (
        <>
            <DropdownMenuLabel>{t('my_account')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link href={route('profile.edit')}>
                        <User className="mr-2 size-4" />
                        <span>{t('profile')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={route('password.edit')}>
                        <Settings className="mr-2 size-4" />
                        <span>{t('password')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={route('appearance')}>
                        <Settings className="mr-2 size-4" />
                        <span>{t('appearance')}</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={route('logout')} method="post" as="button" className="w-full">
                    <LogOut className="mr-2 size-4" />
                    <span>{t('log_out')}</span>
                </Link>
            </DropdownMenuItem>
        </>
    );
}
