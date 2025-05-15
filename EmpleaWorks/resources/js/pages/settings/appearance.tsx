import { Head, usePage } from '@inertiajs/react';
import { useEffect, useCallback } from 'react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { useTranslation } from '@/utils/i18n';
import { Toaster, showToast } from '@/components/toast';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { cn } from '@/lib/utils';

export default function Appearance() {
    const { t } = useTranslation();
    const { flash } = usePage<{ flash: { success?: string; error?: string; theme?: string } }>().props;
    
    // Colores principales
    const primaryColor = '#7c28eb';
    const accentColor = '#FDC231';
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('appearance_settings'),
            href: '/settings/appearance',
        },
    ];

    // Show toast when theme changes from flash (server-side)
    useEffect(() => {
        if (flash?.theme) {
            const themeKey = `theme_${flash.theme}`;
            showToast.success(t('theme_changed', { theme: t(themeKey) }));
        }
    }, [flash]);

    // Handle theme change from client-side
    const handleThemeChange = useCallback((theme: string) => {
        const themeKey = `theme_${theme}`;
        showToast.success(t('theme_changed', { theme: t(themeKey) }));
    }, [t]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('appearance_settings')} />
            <Toaster />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="text-[#7c28eb] dark:text-purple-300">
                        <HeadingSmall 
                            title={t('appearance_settings')} 
                            description={t('update_appearance_settings')}
                        />
                    </div>
                    
                    {/* Pass the handleThemeChange function to AppearanceTabs */}
                    <div className="py-2">
                        <AppearanceTabs 
                            className="mt-2" 
                            onThemeChange={handleThemeChange}
                        />
                    </div>
                    
                    {/* Decorative element */}
                    <div 
                        className="h-1 w-full rounded-full opacity-80 mt-8"
                        style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})` }}
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
