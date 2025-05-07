import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';
import { useTranslation } from '@/utils/i18n';

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const { t } = useTranslation();
    
    // Definición de colores
    const purpleColor = '#7c28eb';
    const purpleDarkColor = '#6620c5';
    const amberColor = '#FDC231';
    
    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: t('light') },
        { value: 'dark', icon: Moon, label: t('dark') },
        { value: 'system', icon: Monitor, label: t('system') },
    ];

    return (
        <div 
            className={cn(
                'inline-flex gap-1 rounded-lg p-1', 
                'bg-purple-50 dark:bg-purple-950/30',
                className
            )} 
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                        appearance === value
                            ? 'bg-white dark:bg-purple-900/50 shadow-sm border border-purple-200 dark:border-purple-800 text-[#7c28eb] dark:text-purple-300'
                            : 'text-gray-600 hover:bg-white/80 hover:text-[#7c28eb] dark:text-gray-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-300',
                    )}
                    style={{
                        transition: 'all 0.2s ease-in-out'
                    }}
                >
                    <Icon 
                        className="-ml-1 h-4 w-4" 
                        style={{ 
                            color: appearance === value ? purpleColor : 'currentColor',
                        }}
                    />
                    <span className="ml-1.5 text-sm font-medium">{label}</span>
                </button>
            ))}
        </div>
    );
}
