import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarIcon, MapPinIcon, BriefcaseIcon, EyeIcon, ArrowRightIcon } from 'lucide-react';
import { Offer, Company } from '@/types/types';
import SearchBar from '@/SearchBar/SearchBar';
import { useState, useCallback, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from '@/utils/i18n';

interface DashboardProps {
    offers?: Offer[];
    categories?: string[];
    contractTypes?: string[];
}

export default function Dashboard({ offers = [], categories = [], contractTypes = [] }: DashboardProps) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const isAuthenticated = !!auth.user;

    const [filteredOffers, setFilteredOffers] = useState<Offer[]>(offers);
    
    // Si no se proporcionan categorías y tipos de contrato desde el backend,
    // extraemos los valores únicos de las ofertas
    const availableCategories = useMemo(() => {
        if (categories.length > 0) return categories;
        return [...new Set(offers.map(offer => offer.category).filter(Boolean))];
    }, [categories, offers]);
    
    const availableContractTypes = useMemo(() => {
        if (contractTypes.length > 0) return contractTypes;
        return [...new Set(offers.map(offer => offer.contract_type).filter(Boolean))];
    }, [contractTypes, offers]);

    // Function to handle direct navigation without Inertia
    const navigateToLogin = () => {
        window.location.href = route('login');
    };

    const navigateToRegister = () => {
        window.location.href = route('register');
    };

    // Use useCallback to memoize the function
    const handleFilteredResults = useCallback((results: Offer[]) => {
        setFilteredOffers(results);
    }, []);

    // Mostramos los mensajes flash del backend
    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
        if (flash && flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard'),
            href: '/dashboard',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
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
                {!isAuthenticated && (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative bg-card p-6 overflow-hidden rounded-xl border mb-2">
                        <div className="flex flex-col gap-2 relative z-10">
                            <h2 className="text-xl font-semibold">{t('welcome_title')}</h2>
                            <p className="text-muted-foreground">{t('welcome_subtitle')}</p>
                            <div className="flex gap-2 mt-2">
                                <Button
                                    variant="default"
                                    onClick={navigateToLogin}
                                >
                                    {t('sign_in')}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={navigateToRegister}
                                >
                                    {t('create_account')}
                                </Button>
                            </div>
                        </div>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5" />
                    </div>
                )}

                {/* Título de las ofertas */}
                <div className="px-2">
                    <h2 className="text-2xl font-semibold mb-2">{t('recent_jobs')}</h2>
                    <p className="text-muted-foreground">{t('explore_opportunities')}</p>
                </div>

                {/* Barra de búsqueda con selectores */}
                <div className="mb-6 relative">
                    {/* Acento de color más fino */}
                    <div className="absolute -left-1 top-6 bottom-6 w-0.5 bg-primary rounded-full" />

                    <div className="pb-5 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg ml-1.5 border border-gray-100 dark:border-gray-700 transform hover:translate-y-[-2px] transition-transform duration-300">
                        <SearchBar
                            data={offers}
                            onFilteredResults={handleFilteredResults}
                            categories={availableCategories}
                            contractTypes={availableContractTypes}
                        />
                    </div>
                </div>

                {/* Mostrar ofertas en el grid */}
                {filteredOffers && filteredOffers.length > 0 ? (
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        {filteredOffers.map((offer) => (
                            <div
                                key={offer.id}
                                className="border-sidebar-border/70 dark:border-sidebar-border bg-card relative overflow-hidden rounded-xl border p-4 flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Link
                                        href={route('offer.show', offer.id)}
                                        className="font-semibold text-lg line-clamp-2"
                                    >
                                        {offer.name}
                                    </Link>
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                        {offer.category}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                        <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"></path>
                                        <path d="M18 5V3a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path>
                                        <path d="M21 5H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                                    </svg>
                                    <span>
                                        {offer.company ? (offer.company as any).name : t('company_not_available')}
                                    </span>
                                </p>

                                <p className="text-sm line-clamp-3 mb-4 flex-grow">
                                    {offer.description}
                                </p>

                                <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1">
                                        <BriefcaseIcon className="size-3.5" />
                                        <span>{offer.contract_type}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPinIcon className="size-3.5" />
                                        <span>{offer.job_location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CalendarIcon className="size-3.5" />
                                        <span>{t('until')}: {new Date(offer.closing_date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-auto">
                                    <Link
                                        href={route('offer.show', offer.id)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary/90 text-sm font-medium transition-colors"
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
                    // Mostrar mensaje cuando no hay ofertas que coincidan con la búsqueda o mostrar placeholders si no hay ofertas
                    filteredOffers.length === 0 ? (
                        <div className="text-center p-8">
                            <div className="text-xl font-medium mb-2">{t('no_offers_found')}</div>
                            <p className="text-muted-foreground">{t('try_other_terms')}</p>
                        </div>
                    ) : (
                        // Placeholders para cuando no hay ofertas en absoluto
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    {t('no_offers_available')}
                                </div>
                            </div>
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </div>
                    )
                )}
            </div>
        </AppLayout>
    );
}