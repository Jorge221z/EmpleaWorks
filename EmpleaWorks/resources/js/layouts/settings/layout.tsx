import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { LogOut, User, KeyRound, Palette } from "lucide-react";
import { useTranslation } from '@/utils/i18n';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { t } = useTranslation();
    
    // ----- COLOR THEMING SYSTEM -----
    // Colores principales (púrpura)
    const primaryColor = '#7c28eb';
    
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const sidebarNavItems: NavItem[] = [
        {
            title: t('profile'),
            href: '/settings/profile',
            icon: User,
        },
        {
            title: t('password'),
            href: '/settings/password',
            icon: KeyRound,
        },
        {
            title: t('appearance'),
            href: '/settings/appearance',
            icon: Palette,
        },
    ];

    const currentPath = window.location.pathname;
    const { post } = useForm({});

    const handleLogout = () => {
        post(route('logout'));
    };

    return (
        <div className="px-4 py-6 bg-[#FEFBF2] dark:bg-transparent rounded-xl">
            <div className="text-[#7c28eb] dark:text-purple-300 mb-6">
                <Heading 
                    title={t('settings')} 
                    description={t('manage_account_settings')} 
                />
            </div>

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-52 bg-white dark:bg-gray-900 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50 shadow-sm">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = currentPath === item.href;
                            
                            return (
                                <Button
                                    key={`${item.href}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn(
                                        'w-full justify-start text-base py-2.5',
                                        isActive
                                            ? 'bg-purple-50 dark:bg-purple-900/30 text-[#7c28eb] dark:text-purple-300 font-medium'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50/70 dark:hover:bg-purple-900/20 hover:text-[#7c28eb] dark:hover:text-purple-300'
                                    )}
                                >
                                    <Link href={item.href} prefetch className="flex items-center">
                                        {Icon && (
                                            <Icon 
                                                className={cn(
                                                    "mr-2 size-4", 
                                                    isActive 
                                                        ? "text-[#7c28eb] dark:text-purple-300" 
                                                        : "text-gray-500 dark:text-gray-400"
                                                )}
                                            />
                                        )}
                                        {item.title}
                                    </Link>
                                </Button>
                            );
                        })}

                        {/* Separator before logout */}
                        <div className="pt-3">
                            <Separator className="mb-3 bg-purple-100 dark:bg-purple-800/30" />
                        </div>

                        {/* Logout button */}
                        <Button
                            size="sm"
                            variant="ghost"
                            className="w-full text-base py-2.5 justify-start cursor-pointer text-red-500 dark:text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-400/10 flex items-center"
                            onClick={handleLogout}
                        >
                            <LogOut className="size-4 mr-2" />
                            {t('log_out')}
                        </Button>
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden bg-purple-100 dark:bg-purple-800/30" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
