import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { CalendarIcon, MapPinIcon, BriefcaseIcon, FileIcon, UserIcon } from 'lucide-react';
import { Offer } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast, { Toaster } from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { BuildingIcon, ExternalLinkIcon } from "lucide-react";
import { useTranslation } from '@/utils/i18n';
import { cn } from '@/lib/utils';

export default function CandidateDashboard({ candidateOffers = [] }: { candidateOffers?: Offer[] }) {
    // ----- HOOKS & STATE -----
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const user = auth.user;

    // ----- COLOR THEMING SYSTEM -----
    // Constantes de color para el tema de Candidato
    const primaryColor = '#EB7C28';  // Naranja para candidatos
    const accentColor = '#F5A46A';   // Naranja más claro
    const hoverColor = '#C26725';    // Naranja más oscuro

    // ----- TAILWIND CLASS MODIFIERS -----
    // Clases CSS para aplicar el tema de Candidato
    const borderColor = 'border-orange-100 dark:border-orange-600/30';
    const bgAccentColor = 'bg-orange-50/50 dark:bg-orange-950/20';
    const cardBgColor = 'bg-orange-50/70 dark:bg-orange-900/10';
    const cardHoverBgColor = 'hover:bg-orange-100/80 dark:hover:bg-orange-900/15';

    // ----- SIDE EFFECTS -----
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
            title: t('candidate_dashboard_title'),
            href: '/candidate/dashboard',
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
            <Head title={t('candidate_dashboard_title')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Título del Dashboard */}
                <div className="px-2">
                    <h2 
                        className="text-2xl font-semibold mb-2"
                        style={{ color: primaryColor }}
                    >
                        {t('candidate_dashboard_title')}
                    </h2>
                    <p className="text-muted-foreground">{t('candidate_dashboard_subtitle')}</p>
                </div>
                
                {/* Acciones Rápidas */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {/* Tarjeta de Aplicaciones */}
                    <Card className={cn(
                        "overflow-hidden flex flex-col", 
                        borderColor,
                        cardBgColor
                    )} 
                    style={{ borderTop: `4px solid ${primaryColor}` }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileIcon 
                                    className="h-5 w-5" 
                                    style={{ color: `${primaryColor}cc` }}
                                />
                                {t('applications')}
                            </CardTitle>
                            <CardDescription>{t('track_applications')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                            <div>
                                <div 
                                    className="text-3xl font-bold"
                                    style={{ color: primaryColor }}
                                >
                                    {candidateOffers.length}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {candidateOffers.length !== 1 ? t('active_applications_plural') : t('active_applications')}
                                </div>
                            </div>
                            
                            <Button 
                                size="sm" 
                                className="gap-1 w-full mt-4"
                                style={{ backgroundColor: primaryColor, color: 'white' }}
                            >
                                <Link href={route('dashboard')} className="w-full flex items-center justify-center gap-1">                                  
                                    {t('find_jobs')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Tarjeta de Perfil */}
                    <Card className={cn(
                        "overflow-hidden flex flex-col", 
                        borderColor,
                        cardBgColor
                    )} 
                    style={{ borderTop: `4px solid ${accentColor}` }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon 
                                    className="h-5 w-5"
                                    style={{ color: `${accentColor}` }}
                                />
                                {t('profile')}
                            </CardTitle>
                            <CardDescription>{t('your_information')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="flex flex-col h-full justify-between">
                                {/* Bloque de perfil con imagen */}
                                <div className="flex items-center gap-3">
                                    {/* Avatar del usuario */}
                                    {user?.image ? (
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                                            <img
                                                src={`/storage/${user.image}`}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div 
                                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700"
                                            style={{ backgroundColor: `${accentColor}30` }}
                                        >
                                            <UserIcon 
                                                className="h-6 w-6" 
                                                style={{ color: accentColor }}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-lg font-medium truncate max-w-[200px]">{user?.name}</div>
                                        <div className="text-sm text-muted-foreground">{t('complete_profile')}</div>
                                        {/* Estado de verificación de correo */}
                                        {user?.email_verified_at === null ? (
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
                                        {/* Estado de CV */}
                                        {user?.candidate ? (
                                            user.candidate.cv ? (
                                                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V7.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 1H7a2 2 0 00-2 2v16a2 2 0 002 2z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6M9 13h6M9 17h3" />
                                                    </svg>
                                                    {t('cv_uploaded')}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V7.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 1H7a2 2 0 00-2 2v16a2 2 0 002 2z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6M9 13h6M9 17h3" />
                                                    </svg>
                                                    {t('cv_not_uploaded')}
                                                </div>
                                            )
                                        ) : null}
                                    </div>
                                </div>
                                
                                {/* Botón de editar perfil */}
                                <div className="mt-4">
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className={cn(
                                            "w-full",
                                            "border-orange-200 dark:border-orange-800/30",
                                            "hover:bg-orange-50 dark:hover:bg-orange-950/20"
                                        )}
                                        style={{ color: primaryColor }}
                                        asChild
                                    >
                                        <Link href={'/settings/profile'} className="w-full flex items-center justify-center gap-1.5">
                                            <UserIcon className="h-4 w-4" />
                                            {t('edit_profile')}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Título de Aplicaciones */}
                <div className="px-2 mt-4">
                    <h2 
                        className="text-2xl font-semibold mb-2"
                        style={{ color: primaryColor }}
                    >
                        {t('your_applications')}
                    </h2>
                    <p className="text-muted-foreground">{t('jobs_applied_to')}</p>
                </div>

                {/* Lista de Ofertas Aplicadas */}
                {candidateOffers && candidateOffers.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {candidateOffers.map((offer) => (
                            <div
                                key={offer.id}
                                className={cn(
                                    "relative overflow-hidden rounded-xl border p-4 flex flex-col md:flex-row md:items-center md:gap-4",
                                    "transition-colors duration-200",
                                    borderColor,
                                    cardBgColor,
                                    cardHoverBgColor
                                )}
                            >
                                <div className="flex-1">
                                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                        <h3 
                                            className="font-semibold text-lg"
                                            style={{ color: primaryColor }}
                                        >
                                            {offer.name}
                                        </h3>
                                        <span 
                                            className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
                                            style={{ 
                                                backgroundColor: `${primaryColor}15`, 
                                                color: primaryColor 
                                            }}
                                        >
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

                                    <p className="text-sm mb-4 line-clamp-2">
                                        {offer.description}
                                    </p>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                                    <div className="flex flex-wrap md:flex-col gap-3 md:gap-1 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <BriefcaseIcon className="size-3.5" style={{ color: primaryColor }} />
                                            <span>{offer.contract_type}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPinIcon className="size-3.5" style={{ color: primaryColor }} />
                                            <span>{offer.job_location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="size-3.5" style={{ color: primaryColor }} />
                                            {(() => {
                                                const closingDate = new Date(offer.closing_date);
                                                const currentDate = new Date();
                                                const daysLeft = Math.ceil((closingDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

                                                return (
                                                    <span className={daysLeft < 3 ? "text-red-500 font-medium" : ""}>
                                                        {t('closed_in')}: {daysLeft <= 0 
                                                            ? t('closed') 
                                                            : daysLeft === 1 
                                                                ? t('days_remaining', {days: daysLeft}) 
                                                                : t('days_remaining_plural', {days: daysLeft})
                                                        }
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 self-end md:self-center mt-4 md:mt-0">
                                        {/* Contenedor para botones */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                                            {/* Diálogo de Información de Empresa */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className={cn(
                                                            "gap-1.5 text-sm w-full",
                                                            "border-orange-200 dark:border-orange-800/30",
                                                            "hover:bg-orange-50 dark:hover:bg-orange-950/20"
                                                        )}
                                                        style={{ color: primaryColor }}
                                                    >
                                                        <BuildingIcon className="size-3.5" />
                                                        {t('company_info')}
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className={cn("sm:max-w-md", borderColor)}>
                                                    <DialogHeader className={cn(bgAccentColor, "rounded-t-lg")}>
                                                        <DialogTitle style={{ color: primaryColor }}>
                                                            {offer.company ? (offer.company as any).name : t('company_information')}
                                                        </DialogTitle>
                                                        <DialogDescription>{t('company_details')}</DialogDescription>
                                                    </DialogHeader>

                                                    <div className="py-4 space-y-4">
                                                        {/* Company Logo (if available) */}
                                                        {offer.company && (offer.company as any).logo && (
                                                            <div className="flex justify-center mb-4">
                                                                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border"
                                                                     style={{ borderColor: `${primaryColor}30` }}>
                                                                    <img
                                                                        src={`/storage/${(offer.company as any).logo}`}
                                                                        alt={(offer.company as any).name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Company Description */}
                                                        {offer.company && (offer.company as any).description && (
                                                            <div className="space-y-1">
                                                                <h4 
                                                                    className="text-sm font-semibold"
                                                                    style={{ color: primaryColor }}
                                                                >
                                                                    {t('about_company')}
                                                                </h4>
                                                                <p className="text-sm">{(offer.company as any).description}</p>
                                                            </div>
                                                        )}

                                                        {/* Company Contact Info */}
                                                        <div className="space-y-2">
                                                            <h4 
                                                                className="text-sm font-semibold"
                                                                style={{ color: primaryColor }}
                                                            >
                                                                {t('contact_information')}
                                                            </h4>

                                                            {offer.company && (offer.company as any).address && (
                                                                <div className="flex items-start gap-2 text-sm">
                                                                    <MapPinIcon 
                                                                        className="size-4 mt-0.5 flex-shrink-0"
                                                                        style={{ color: primaryColor }}
                                                                    />
                                                                    <span>{(offer.company as any).address}</span>
                                                                </div>
                                                            )}

                                                            {offer.company && (offer.company as any).email && (
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 flex-shrink-0" style={{ color: primaryColor }}>
                                                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                                                    </svg>
                                                                    <a 
                                                                        href={`mailto:${(offer.company as any).email}`} 
                                                                        className="hover:underline"
                                                                        style={{ color: primaryColor }}
                                                                    >
                                                                        {(offer.company as any).email}
                                                                    </a>
                                                                </div>
                                                            )}

                                                            {offer.company && (offer.company as any).web_link && (
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <ExternalLinkIcon 
                                                                        className="size-4 flex-shrink-0"
                                                                        style={{ color: primaryColor }}
                                                                    />
                                                                    <a
                                                                        href={(offer.company as any).web_link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="hover:underline"
                                                                        style={{ color: primaryColor }}
                                                                    >
                                                                        {t('visit_website')}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            {/* Link para ver detalles */}
                                            <Link
                                                href={route('offer.show', offer.id)}
                                                className="px-3 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1.5 w-full transition-colors"
                                                style={{ 
                                                    backgroundColor: primaryColor,
                                                    color: 'white'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = hoverColor;
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = primaryColor;
                                                }}
                                            >
                                                {t('view_details')}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                                    <path d="M5 12h14"></path>
                                                    <path d="m12 5 7 7-7 7"></path>
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Estado vacío cuando no hay aplicaciones
                    <div className={cn(
                        "relative p-8 overflow-hidden rounded-xl border text-center my-6",
                        borderColor,
                        cardBgColor
                    )}>
                        <div className="flex flex-col items-center gap-2 relative z-10">
                            <FileIcon 
                                className="h-12 w-12 mb-2 text-muted-foreground"
                                style={{ color: `${primaryColor}60` }}
                            />
                            <h2 
                                className="text-xl font-semibold"
                                style={{ color: primaryColor }}
                            >
                                {t('no_applications_yet')}
                            </h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-4">
                                {t('no_applications_message')}
                            </p>
                            <Button 
                                className="gap-1"
                                style={{ 
                                    backgroundColor: primaryColor,
                                    color: 'white'
                                }}
                                asChild
                            >
                                <Link href={route('dashboard')}>
                                    {t('browse_available_jobs')}
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