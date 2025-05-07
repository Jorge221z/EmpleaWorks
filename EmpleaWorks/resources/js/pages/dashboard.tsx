import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarIcon, MapPinIcon, BriefcaseIcon, ArrowRightIcon } from 'lucide-react';
import { Offer } from '@/types/types';
import SearchBar from '@/SearchBar/SearchBar';
import { useState, useCallback, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from '@/utils/i18n';
import { cn } from '@/lib/utils';

interface DashboardProps {
    offers?: Offer[];
    categories?: string[];
    contractTypes?: string[];
}

export default function Dashboard({ offers = [], categories = [], contractTypes = [] }: DashboardProps) {
    // ----- HOOKS & STATE -----
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const isAuthenticated = !!auth.user;

    // ----- COLOR THEMING SYSTEM -----
    // Colores principales (púrpura)
    const primaryColor = '#7c28eb';
    const primaryHoverColor = '#6620c5';
    const primaryLightColor = '#9645f4';
    
    // Colores de acento (ámbar)
    const accentColor = '#FDC231';
    const accentDarkColor = '#E3B100';
    const accentLightColor = '#FFDE7A';

    // ----- TAILWIND CLASS MODIFIERS -----
    // Clases CSS para el tema púrpura con acentos ámbar
    const borderColor = 'border-purple-100 dark:border-purple-600/30';
    const bgAccentColor = 'bg-purple-50/50 dark:bg-purple-950/20';
    const cardBgColor = 'bg-white dark:bg-gray-900';
    const cardHoverBgColor = 'hover:bg-purple-50/70 dark:hover:bg-purple-900/15';
    
    // ----- DATA MANAGEMENT -----
    // Estado y procesamiento de datos para las ofertas
    const [filteredOffers, setFilteredOffers] = useState<Offer[]>(offers);
    
    const availableCategories = useMemo(() => {
        if (categories.length > 0) return categories;
        return [...new Set(offers.map(offer => offer.category).filter(Boolean))];
    }, [categories, offers]);
    
    const availableContractTypes = useMemo(() => {
        if (contractTypes.length > 0) return contractTypes;
        return [...new Set(offers.map(offer => offer.contract_type).filter(Boolean))];
    }, [contractTypes, offers]);

    // ----- EVENT HANDLERS -----
    // Funciones para manejar interacciones del usuario
    const navigateToLogin = () => {
        window.location.href = route('login');
    };

    const navigateToRegister = () => {
        window.location.href = route('register');
    };

    const handleFilteredResults = useCallback((results: Offer[]) => {
        setFilteredOffers(results);
    }, []);

    // ----- SIDE EFFECTS -----
    // Efectos para notificaciones y otros comportamientos
    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
        if (flash && flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // ----- CONFIGURATION -----
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard'),
            href: '/dashboard',
        },
    ];

    // ----- RENDER COMPONENT -----
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Sistema de notificaciones */}
            <Toaster
                position="bottom-center"
                toastOptions={{
                    className: 'toast-offers',
                    style: {
                        background: '#363636',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '20px 28px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                    id: 'unique-toast',
                }}
            />
            <Head title={t('dashboard')} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Banner de bienvenida para usuarios no autenticados */}
                {!isAuthenticated && (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative bg-card p-6 overflow-hidden rounded-xl border mb-2">
                        <div className="flex flex-col gap-2 relative z-10">
                            <h2 className="text-xl font-semibold">{t('welcome_title')}</h2>
                            <p className="text-muted-foreground">{t('welcome_subtitle')}</p>
                            <div className="flex gap-2 mt-2">
                                <Button
                                    variant="default"
                                    onClick={navigateToLogin}
                                    className="bg-[#7c28eb] hover:bg-[#6620c5] text-white"
                                >
                                    {t('sign_in')}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={navigateToRegister}
                                    className="border-purple-100 dark:border-purple-600/30 hover:text-[#7c28eb] hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
                                >
                                    {t('create_account')}
                                </Button>
                            </div>
                        </div>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5" />
                    </div>
                )}

                {/* Cabecera de la sección de ofertas */}
                <div className="px-2">
                    <h2 
                        className="text-2xl font-semibold mb-2 text-[#7c28eb] dark:text-purple-300"
                    >
                        {t('recent_jobs')}
                    </h2>
                    <p className="text-muted-foreground">{t('explore_opportunities')}</p>
                </div>

                {/* Barra de búsqueda y filtros */}
                <div className="mb-6 relative">
                    {/* Indicador visual - Borde ámbar a la izquierda */}
                    <div 
                        className="absolute -left-1 top-6 bottom-6 w-1 rounded-full" 
                        style={{ backgroundColor: accentColor }}
                    />

                    <div className={cn(
                        "pb-5 bg-white dark:bg-[#171717] rounded-xl p-4 shadow-lg ml-1.5 border transform hover:translate-y-[-2px] transition-transform duration-300",
                        borderColor
                    )}>
                        <SearchBar
                            data={offers}
                            onFilteredResults={handleFilteredResults}
                            categories={availableCategories}
                            contractTypes={availableContractTypes}
                            primaryColor={primaryColor}
                            accentColor={accentColor}
                        />
                    </div>
                </div>

                {/* Listado de ofertas de empleo */}
                {filteredOffers && filteredOffers.length > 0 ? (
                    <div className="grid auto-rows-min gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {filteredOffers.map((offer) => (
                            <div
                                key={offer.id}
                                className={cn(
                                    "relative overflow-hidden rounded-xl border p-4 flex flex-col transition-colors duration-200",
                                    borderColor,
                                    cardBgColor,
                                    cardHoverBgColor
                                )}
                            >
                                {/* Elemento decorativo ámbar */}
                                <div 
                                    className="absolute top-0 right-0 w-12 h-1 rounded-bl" 
                                    style={{ backgroundColor: accentColor }}
                                />
                                
                                {/* Encabezado de la tarjeta */}
                                <div className="flex justify-between items-start mb-2">
                                    <Link
                                        href={route('offer.show', offer.id)}
                                        className="font-semibold text-lg line-clamp-2 text-[#7c28eb] dark:text-purple-300 hover:text-[#6620c5] dark:hover:text-purple-200 transition-colors"
                                    >
                                        {offer.name}
                                    </Link>
                                    <span 
                                        className="text-xs px-2 py-1 rounded-full"
                                        style={{ 
                                            backgroundColor: `${accentColor}20`, 
                                            color: accentDarkColor 
                                        }}
                                    >
                                        {offer.category}
                                    </span>
                                </div>

                                {/* Información de la empresa */}
                                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" style={{ color: accentColor }}>
                                        <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"></path>
                                        <path d="M18 5V3a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path>
                                        <path d="M21 5H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                                    </svg>
                                    <span>
                                        {offer.company ? (offer.company as any).name : t('company_not_available')}
                                    </span>
                                </p>

                                {/* Descripción de la oferta */}
                                <p className="text-sm line-clamp-3 mb-4 flex-grow">
                                    {offer.description}
                                </p>

                                {/* Detalles adicionales de la oferta */}
                                <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1">
                                        <BriefcaseIcon className="size-3.5" style={{ color: primaryLightColor }} />
                                        <span>{offer.contract_type}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPinIcon className="size-3.5" style={{ color: primaryLightColor }} />
                                        <span>{offer.job_location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CalendarIcon className="size-3.5" style={{ color: primaryLightColor }} />
                                        <span>{t('until')}: {new Date(offer.closing_date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Botón de acción */}
                                <div className="flex justify-end mt-auto">
                                    <Link
                                        href={route('offer.show', offer.id)}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                            "border border-purple-200 dark:border-purple-700",
                                            "text-[#7c28eb] dark:text-white",
                                            "hover:bg-purple-50 dark:hover:bg-purple-900/30",
                                            "hover:border-[#7c28eb] dark:hover:border-purple-500",
                                            "hover:text-[#6620c5] dark:hover:text-white"
                                        )}
                                        title={t('view_details')}
                                    >
                                        {t('view_details')}
                                        <ArrowRightIcon className="size-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Estados alternativos: sin resultados o sin datos
                    filteredOffers.length === 0 ? (
                        // Estado de "No se encontraron resultados" cuando la búsqueda no arroja coincidencias
                        <div className="text-center p-8">
                            <div className="text-xl font-medium mb-2 text-[#7c28eb] dark:text-purple-300">
                                {t('no_offers_found')}
                            </div>
                            <p className="text-muted-foreground">{t('try_other_terms')}</p>
                        </div>
                    ) : (
                        // Estado de "No hay ofertas disponibles" cuando no hay datos iniciales
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            <div className={cn(
                                "relative aspect-video overflow-hidden rounded-xl border",
                                borderColor,
                                "bg-purple-50/30 dark:bg-purple-900/10"
                            )}>
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    {t('no_offers_available')}
                                </div>
                            </div>
                            <div className={cn(
                                "relative aspect-video overflow-hidden rounded-xl border",
                                borderColor,
                                "bg-purple-50/30 dark:bg-purple-900/10"
                            )}>
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                            <div className={cn(
                                "relative aspect-video overflow-hidden rounded-xl border",
                                borderColor,
                                "bg-purple-50/30 dark:bg-purple-900/10"
                            )}>
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </div>
                    )
                )}
            </div>
        </AppLayout>
    );
}