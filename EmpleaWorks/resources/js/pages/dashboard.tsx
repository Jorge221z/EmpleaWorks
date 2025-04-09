import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarIcon, MapPinIcon, BriefcaseIcon } from 'lucide-react';
import { Offer, Company } from '@/types/types';
import SearchBar from '@/SearchBar/SearchBar';
import { useState, useCallback } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ offers = [] }: { offers?: Offer[] }) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth.user;

    const [filteredOffers, setFilteredOffers] = useState<Offer[]>(offers);

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {!isAuthenticated && (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative bg-card p-6 overflow-hidden rounded-xl border mb-2">
                        <div className="flex flex-col gap-2 relative z-10">
                            <h2 className="text-xl font-semibold">Welcome to EmpleaWorks</h2>
                            <p className="text-muted-foreground">Sign in to access all features and personalize your experience.</p>
                            <div className="flex gap-2 mt-2">
                                <Button
                                    variant="default"
                                    onClick={navigateToLogin}
                                >
                                    Sign in
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={navigateToRegister}
                                >
                                    Create account
                                </Button>
                            </div>
                        </div>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5" />
                    </div>
                )}

                {/* Título de las ofertas */}
                <div className="px-2">
                    <h2 className="text-2xl font-semibold mb-2">Ofertas de empleo recientes</h2>
                    <p className="text-muted-foreground">Explora las últimas oportunidades disponibles</p>
                </div>

                {/* Barra de búsqueda */}
                <div className="px-4 py-3 mb-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
                    <SearchBar
                        data={offers}
                        onFilteredResults={handleFilteredResults}
                    />
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
                                    <h3 className="font-semibold text-lg line-clamp-2">{offer.name}</h3>
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                        {offer.category}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground mb-2">
                                    {offer.company ? offer.company.name : 'Empresa no disponible'}
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
                                        <span>Hasta: {new Date(offer.closing_date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <Link
                                    href={route('offers.show', offer.id)}
                                    className="text-primary hover:text-primary/80 text-sm font-medium"
                                >
                                    Ver detalles →
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Mostrar mensaje cuando no hay ofertas que coincidan con la búsqueda o mostrar placeholders si no hay ofertas
                    filteredOffers.length === 0 ? (
                        <div className="text-center p-8">
                            <div className="text-xl font-medium mb-2">No se encontraron ofertas</div>
                            <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
                        </div>
                    ) : (
                        // Placeholders para cuando no hay ofertas en absoluto
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    No hay ofertas disponibles
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