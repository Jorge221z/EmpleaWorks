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
import { cn } from '@/lib/utils';
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
    // ----- HOOKS & STATE -----
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    
    // ----- COLOR THEMING SYSTEM -----
    // Constantes de color para el tema de Empresa
    const primaryColor = '#28EB7C';   // Verde para empresas
    const accentColor = '#71F1A9';    // Verde más claro
    const hoverColor = '#22C569';     // Verde más oscuro

    // ----- TAILWIND CLASS MODIFIERS -----
    // Clases CSS para aplicar el tema de Empresa
    const borderColor = 'border-green-100 dark:border-green-600/30';
    const bgAccentColor = 'bg-green-50/50 dark:bg-green-950/20';
    const cardBgColor = 'bg-green-50/70 dark:bg-green-900/10';
    const cardHoverBgColor = 'hover:bg-green-100/80 dark:hover:bg-green-900/15';

    // ----- CONFIGURATION -----
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('company_dashboard'),
            href: '/company/dashboard',
        },
    ];
    
    // ----- RENDER COMPONENT -----
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
                    <h2 
                        className="text-2xl font-semibold mb-2"
                        style={{ color: primaryColor }}
                    >
                        {t('company_dashboard')}
                    </h2>
                    <p className="text-muted-foreground">{t('manage_company_listings')}</p>
                </div>
                
                {/* Acciones rápidas */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Tarjeta de Job Listings */}
                    <Card className={cn(
                        "overflow-hidden flex flex-col",
                        borderColor
                    )}
                    style={{ borderTop: `4px solid ${primaryColor}` }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="20" 
                                    height="20" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    className="text-primary/80"
                                    style={{ color: primaryColor }}
                                >
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                                {t('job_listings')}
                            </CardTitle>
                            <CardDescription>{t('manage_jobs')}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="flex-grow flex flex-col justify-between">
                            <div>
                                <div 
                                    className="text-3xl font-bold"
                                    style={{ color: primaryColor }}
                                >
                                    {companyOffers.length}
                                </div>
                                <div className="text-sm text-muted-foreground">{t('active_positions')}</div>
                            </div>
                            
                            <Button 
                                size="sm" 
                                className="gap-1 w-full mt-4"
                                style={{ backgroundColor: primaryColor, color: 'white' }}
                                asChild
                            >
                                <Link href={route('company.create-job')} className="flex items-center justify-center">                                  
                                    <PlusCircleIcon className="h-4 w-4 mr-1" />
                                    {t('new_job')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Tarjeta de Aplicantes */}
                    <Card className={cn(
                        "overflow-hidden flex flex-col",
                        borderColor
                    )}
                    style={{ borderTop: `4px solid ${accentColor}` }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UsersIcon 
                                    className="h-5 w-5" 
                                    style={{ color: accentColor }}
                                />
                                {t('applicants')}
                            </CardTitle>
                            <CardDescription>{t('applications_to_jobs')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                            <div>
                                <div 
                                    className="text-3xl font-bold"
                                    style={{ color: accentColor }}
                                >
                                    {totalApplicants}
                                </div>
                                <div className="text-sm text-muted-foreground">{t('total_candidates')}</div>
                            </div>
                            
                            <Button 
                                size="sm" 
                                className="gap-1 w-full mt-4"
                                style={{ 
                                    backgroundColor: `${accentColor}`, 
                                    color: '#065f46' 
                                }}
                                asChild
                            >
                                <Link href={route('company.applicants')} className="flex items-center justify-center">
                                    <UsersIcon className="h-4 w-4 mr-1" />
                                    {t('view_applicants')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Tarjeta de Perfil de Empresa */}
                    <Card className={cn(
                        "overflow-hidden flex flex-col",
                        borderColor
                    )} 
                    style={{ borderTop: `4px solid ${primaryColor}95` }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BuildingIcon 
                                    className="h-5 w-5" 
                                    style={{ color: `${primaryColor}95` }}
                                />
                                {t('company_profile')}
                            </CardTitle>
                            <CardDescription>{t('update_profile')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="flex flex-col h-full justify-between">
                                {/* Bloque de perfil */}
                                <div className="flex items-center gap-3">
                                    {/* Logo de la empresa */}
                                    {auth.user.image ? (
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                                            <img
                                                src={`/storage/${auth.user.image}`}
                                                alt={auth.user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div 
                                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700"
                                            style={{ backgroundColor: `${primaryColor}30` }}
                                        >
                                            <BuildingIcon 
                                                className="h-6 w-6" 
                                                style={{ color: primaryColor }}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-lg font-medium truncate max-w-[200px]">{auth.user.name}</div>
                                        <div className="text-sm text-muted-foreground">{t('complete_profile')}</div>
                                        {/* Estado de verificación de correo */}
                                        {auth.user?.email_verified_at === null ? (
                                            <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414-1.414A9 9 0 105.636 18.364l1.414 1.414A9 9 0 1018.364 5.636z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-6 6M9 9l6 6" />
                                                </svg>
                                                {t('email_not_verified')}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {t('email_verified')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Botón de editar */}
                                <div className="mt-4">
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className={cn(
                                            "gap-1 w-full",
                                            "border-green-200 dark:border-green-800/30",
                                            "hover:bg-green-50 dark:hover:bg-green-950/20"
                                        )}
                                        style={{ color: primaryColor }}
                                        asChild
                                    >
                                        <Link href={'/settings/profile'} className="flex items-center justify-center">                                  
                                            <BuildingIcon className="h-4 w-4 mr-1" />
                                            {t('edit_profile')}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Título de las ofertas */}
                <div className="px-2 mt-4">
                    <h2 
                        className="text-2xl font-semibold mb-2"
                        style={{ color: primaryColor }}
                    >
                        {t('your_job_listings')}
                    </h2>
                    <p className="text-muted-foreground">{t('manage_current_postings')}</p>
                </div>

                {/* Mostrar ofertas en el grid */}
                {companyOffers && companyOffers.length > 0 ? (
                    <div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                        {companyOffers.map((offer) => (
                            <div
                                key={offer.id}
                                className={cn(
                                    "relative overflow-hidden rounded-xl border p-4 flex flex-col",
                                    borderColor,
                                    cardBgColor,
                                    cardHoverBgColor
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 
                                        className="font-semibold text-lg line-clamp-2"
                                        style={{ color: primaryColor }}
                                    >
                                        {offer.name}
                                    </h3>
                                    <span 
                                        className="text-xs px-2 py-1 rounded-full"
                                        style={{ 
                                            backgroundColor: `${primaryColor}20`, 
                                            color: primaryColor 
                                        }}
                                    >
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
                                        <BriefcaseIcon 
                                            className="size-3.5" 
                                            style={{ color: primaryColor }}
                                        />
                                        <span>{offer.contract_type}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPinIcon 
                                            className="size-3.5" 
                                            style={{ color: primaryColor }}
                                        />
                                        <span>{offer.job_location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CalendarIcon 
                                            className="size-3.5" 
                                            style={{ color: primaryColor }}
                                        />
                                        <span>{t('until')}: {new Date(offer.closing_date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 w-full">
                                    {/* Botón View Details */}
                                    <Button 
                                        className="w-full"
                                        style={{ backgroundColor: primaryColor, color: 'white' }}
                                        asChild
                                    >
                                        <Link
                                            href={route('offer.show', offer.id)}
                                            className="flex items-center justify-center gap-1.5"
                                        >
                                            {t('view_details')}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                                <path d="M5 12h14"></path>
                                                <path d="m12 5 7 7-7 7"></path>
                                            </svg>
                                        </Link>
                                    </Button>
                                    
                                    {/* Segunda fila: Edit y Delete */}
                                    <div className="flex flex-wrap gap-2 w-full">
                                        {/* Edit Button */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={cn(
                                                "flex-1 min-w-[80px] text-sm rounded-full",
                                                "border-green-300/30 dark:border-green-400/20",
                                                "hover:bg-green-500/10 hover:border-green-500/50",
                                                "dark:hover:bg-green-500/10 hover:text-green-600"
                                            )}
                                            style={{ color: primaryColor }}
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
                                        
                                        {/* Delete Button */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 min-w-[80px] text-sm rounded-full border-red-300/30 dark:border-red-400/20 hover:bg-red-500/10 hover:border-red-500/50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
                                                >
                                                    <span className="flex items-center justify-center gap-1.5">
                                                        <TrashIcon className="size-3.5" />
                                                        {t('delete')}
                                                    </span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className={borderColor}>
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
                                                        className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
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
                        <div 
                            className={cn(
                                "relative overflow-hidden rounded-xl border p-4 flex flex-col justify-center items-center min-h-[250px]",
                                borderColor,
                                cardBgColor
                            )}
                        >
                            <PlusCircleIcon 
                                className="h-10 w-10 mb-2" 
                                style={{ color: `${primaryColor}80` }}
                            />
                            <h3 
                                className="font-medium text-lg mb-1"
                                style={{ color: primaryColor }}
                            >
                                {t('create_new_job')}
                            </h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                                {t('add_job_opportunity')}
                            </p>
                            <Button 
                                style={{ backgroundColor: primaryColor, color: 'white' }}
                                asChild
                            >
                                <Link href={route('company.create-job')}>
                                    {t('create_job_listing')}
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Si no hay ofertas publicadas por la empresa
                    <div 
                        className={cn(
                            "relative p-8 overflow-hidden rounded-xl border text-center my-6",
                            borderColor,
                            cardBgColor
                        )}
                    >
                        <div className="flex flex-col items-center gap-2 relative z-10">
                            <BuildingIcon 
                                className="h-12 w-12 mb-2" 
                                style={{ color: `${primaryColor}60` }}
                            />
                            <h2 
                                className="text-xl font-semibold"
                                style={{ color: primaryColor }}
                            >
                                {t('no_job_listings_yet')}
                            </h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-4">
                                {t('no_job_listings_message')}
                            </p>
                            <Button 
                                className="gap-1"
                                style={{ backgroundColor: primaryColor, color: 'white' }}
                                asChild
                            >
                                <Link href={route('company.create-job')} className="flex items-center justify-center">                                
                                    <PlusCircleIcon className="h-4 w-4 mr-1" />
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