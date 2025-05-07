import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";
import { LogOut, Settings, User, KeyRound, SunMoon } from "lucide-react";
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
                <DropdownMenuLabel className="font-medium text-[#7c28eb] dark:text-purple-300">
                    {t('account')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-purple-100 dark:bg-purple-600/30" />
                <DropdownMenuGroup>
                    <DropdownMenuItem 
                        onClick={navigateToLogin}
                        className="cursor-pointer focus:bg-purple-50 dark:focus:bg-purple-900/20 focus:text-[#7c28eb] dark:focus:text-purple-300"
                    >
                        <User className="mr-2 size-4 text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb]" />
                        <span>{t('log_in')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={navigateToRegister}
                        className="cursor-pointer focus:bg-purple-50 dark:focus:bg-purple-900/20 focus:text-[#7c28eb] dark:focus:text-purple-300"
                    >
                        <User className="mr-2 size-4 text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb]" />
                        <span>{t('register')}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </>
        );
    }

    return (
        <>
            <DropdownMenuLabel className="font-medium text-[#7c28eb] dark:text-purple-300">
                {t('my_account')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-purple-100 dark:bg-purple-600/30" />
            <DropdownMenuGroup>
                <DropdownMenuItem 
                    asChild
                    className="focus:bg-purple-50 dark:focus:bg-purple-900/20 focus:text-[#7c28eb] dark:focus:text-purple-300"
                >
                    <Link href={route('profile.edit')} className="flex items-center w-full focus:outline-none">
                        <User className="mr-2 size-4 text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb]" />
                        <span>{t('profile')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    asChild
                    className="focus:bg-purple-50 dark:focus:bg-purple-900/20 focus:text-[#7c28eb] dark:focus:text-purple-300"
                >
                    <Link href={route('password.edit')} className="flex items-center w-full focus:outline-none">
                        <KeyRound className="mr-2 size-4 text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb]" />
                        <span>{t('password')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    asChild
                    className="focus:bg-purple-50 dark:focus:bg-purple-900/20 focus:text-[#7c28eb] dark:focus:text-purple-300"
                >
                    <Link href={route('appearance')} className="flex items-center w-full focus:outline-none">
                        <SunMoon className="mr-2 size-4 text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb]" />
                        <span>{t('appearance')}</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-purple-100 dark:bg-purple-600/30" />
            <DropdownMenuItem 
                asChild
                className="group/logout hover:bg-red-50 focus:bg-red-50 dark:hover:bg-red-900/20 dark:focus:bg-red-900/20 focus:text-red-600 dark:focus:text-red-400 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
                <Link href={route('logout')} method="post" as="button" className="flex items-center w-full focus:outline-none">
                    <LogOut className="mr-2 size-4 text-[#FDC231] dark:text-[#FFDE7A] group-hover/logout:text-red-500 dark:group-hover/logout:text-red-400 transition-colors" />
                    <span>{t('log_out')}</span>
                </Link>
            </DropdownMenuItem>
        </>
    );
}
