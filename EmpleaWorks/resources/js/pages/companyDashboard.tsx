import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarIcon, MapPinIcon, BriefcaseIcon, PlusCircleIcon, UsersIcon, BuildingIcon } from 'lucide-react';
import { Offer } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast, { Toaster } from 'react-hot-toast';
import { TrashIcon } from "lucide-react";
import { router } from "@inertiajs/react";
import { useTranslation } from '@/utils/i18n';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CompanyDashboard({ companyOffers = [], totalApplicants = 0 }: { companyOffers?: Offer[], totalApplicants?: number }) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('company_dashboard'),
            href: '/company/dashboard',
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
            <Head title={t('company_dashboard')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Título del Dashboard */}
                <div className="px-2">
                    <h2 className="text-2xl font-semibold mb-2">{t('company_dashboard')}</h2>
                    <p className="text-muted-foreground">{t('manage_company_listings')}</p>
                </div>
                
                {/* Acciones rápidas */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Tarjeta de Job Listings */}
                    <Card className="overflow-hidden border-t-4 border-t-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/80">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                                {t('job_listings')}
                            </CardTitle>
                            <CardDescription>{t('manage_jobs')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <div>
                                <div className="text-3xl font-bold">{companyOffers.length}</div>
                                <div className="text-sm text-muted-foreground">{t('active_positions')}</div>
                            </div>
                            <Button size="sm" className="gap-1">
                                <PlusCircleIcon className="h-4 w-4" />
                                <Link href={route('company.create-job')}>                                  
                                    {t('new_job')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Tarjeta de Aplicantes */}
                    <Card className="overflow-hidden border-t-4 border-t-blue-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UsersIcon className="h-5 w-5 text-blue-500/80" />
                                {t('applicants')}
                            </CardTitle>
                            <CardDescription>{t('applications_to_jobs')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalApplicants}</div>
                            <div className="text-sm text-muted-foreground">{t('total_candidates')}</div>
                        </CardContent>
                    </Card>

                    {/* Tarjeta de Perfil de Empresa */}
                    <Card className="overflow-hidden border-t-4 border-t-green-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BuildingIcon className="h-5 w-5 text-green-500/80" />
                                {t('company_profile')}
                            </CardTitle>
                            <CardDescription>{t('update_profile')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <div>
                                <div className="text-lg font-medium truncate max-w-[150px]">{auth.user.name}</div>
                                <div className="text-sm text-muted-foreground">{t('complete_profile')}</div>
                            </div>
                            <Button size="sm" variant="outline" className="gap-1">
                                <BuildingIcon className="h-4 w-4" />
                                <Link href={'/settings/profile'}>                                  
                                    {t('edit_profile')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Título de las ofertas */}
                <div className="px-2 mt-4">
                    <h2 className="text-2xl font-semibold mb-2">{t('your_job_listings')}</h2>
                    <p className="text-muted-foreground">{t('manage_current_postings')}</p>
                </div>

                {/* Mostrar ofertas en el grid */}
                {companyOffers && companyOffers.length > 0 ? (
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        {companyOffers.map((offer) => (
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
                                    {t('posted')}: {new Date(offer.created_at).toLocaleDateString()}
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

                                <div className="flex flex-col gap-2 w-full">
                                    {/* Primera fila: View Details */}
                                    <Link
                                        href={route('offer.show', offer.id)}
                                        className="w-full px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
                                    >
                                        {t('view_details')}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                            <path d="M5 12h14"></path>
                                            <path d="m12 5 7 7-7 7"></path>
                                        </svg>
                                    </Link>
                                    
                                    {/* Segunda fila: Edit y Delete */}
                                    <div className="flex gap-2 w-full">
                                        {/* Edit Button */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-sm rounded-full border-primary/30 dark:border-primary/40 hover:bg-primary/10 hover:border-primary dark:hover:bg-primary/20 hover:text-primary transition-colors"
                                            asChild
                                        >
                                            <Link href={route('company.edit-job', offer.id)} className="flex items-center justify-center gap-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                                {t('edit')}
                                            </Link>
                                        </Button>
                                        
                                        {/* Delete Button with Confirmation Dialog */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-sm rounded-full border-red-300/30 dark:border-red-400/20 hover:bg-red-500/10 hover:border-red-500/50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                >
                                                    <span className="flex items-center justify-center gap-1.5">
                                                        <TrashIcon className="size-3.5" />
                                                        {t('delete')}
                                                    </span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{t('are_you_sure')}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {t('delete_confirmation')} 
                                                        <span className="font-semibold"> "{offer.name}"</span> {t('and_remove_applications')}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                                    <AlertDialogAction 
                                                        className="bg-red-500 hover:bg-red-600 text-white"
                                                        onClick={() => {
                                                            router.delete(route('offers.destroy', offer.id), {
                                                                onSuccess: () => {
                                                                    toast.success(t('job_deleted_success'));
                                                                },
                                                                onError: () => {
                                                                    toast.error(t('job_deleted_error'));
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        {t('delete')}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Card para añadir nueva oferta */}
                        <div className="border-sidebar-border/70 dark:border-sidebar-border bg-card/50 relative overflow-hidden rounded-xl border p-4 flex flex-col justify-center items-center min-h-[250px]">
                            <PlusCircleIcon className="h-10 w-10 mb-2 text-muted-foreground" />
                            <h3 className="font-medium text-lg mb-1">{t('create_new_job')}</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                                {t('add_job_opportunity')}
                            </p>
                            <Button asChild>
                                <Link href={route('company.create-job')}>
                                {t('create_job_listing')}
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Si no hay ofertas publicadas por la empresa
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative bg-card/50 p-8 overflow-hidden rounded-xl border text-center my-6">
                        <div className="flex flex-col items-center gap-2 relative z-10">
                            <BuildingIcon className="h-12 w-12 mb-2 text-muted-foreground" />
                            <h2 className="text-xl font-semibold">{t('no_job_listings_yet')}</h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-4">
                                {t('no_job_listings_message')}
                            </p>
                            <Button className="gap-1">
                                <PlusCircleIcon className="h-4 w-4" />
                                <Link href={route('company.create-job')}>                                
                                    {t('create_first_job')}
                                </Link>
                            </Button>
                        </div>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5" />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}