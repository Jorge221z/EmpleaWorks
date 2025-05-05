import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BriefcaseIcon, CalendarIcon, MapPinIcon, BuildingIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { useState, useMemo } from 'react';
import { Offer, Company } from "@/types/types";
import { useTranslation } from '@/utils/i18n';
import ClipLoader from "react-spinners/ClipLoader";
import { cn } from '@/lib/utils';

interface ApplyFormProps {
    offer: Offer;  // Recibimos la oferta como prop
}

export default function ApplyForm({ offer }: ApplyFormProps) {
    // ----- HOOKS & STATE -----
    const { company } = offer;
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;

    // ----- COLOR THEMING SYSTEM -----
    // Constantes de color para el tema de Candidato
    const primaryColor = '#EB7C28';   // Naranja para candidatos
    const accentColor = '#F5A46A';    // Naranja más claro

    // ----- TAILWIND CLASS MODIFIERS -----
    // Clases CSS para aplicar el tema de Candidato
    const borderColor = 'border-orange-100 dark:border-orange-600/30';
    const bgAccentColor = 'bg-orange-50/50 dark:bg-orange-950/20';
    const cardBgColor = 'bg-orange-50/70 dark:bg-orange-900/10';
    const badgeBgClass = 'bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/40';
    const badgeTextClass = 'text-orange-800 dark:text-orange-300';

    // ----- FORM STATE -----
    const [agreed, setAgreed] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    // ----- FORM DATA & HANDLERS -----
    const { data, setData, post, processing, errors } = useForm({
        phone: '',
        email: '',
        cl: '',
        offer_id: offer.id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSpinner(true);
        setTimeout(() => {
            post('/apply', {
                onSuccess: () => {
                    setShowSpinner(false);
                    console.log("Application submitted successfully");
                }
            });
        }, 600); // Muestra el spinner al menos 1 segundo
    };

    // ----- CONFIGURATION -----
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard'),
            href: '/dashboard',
        },
        {
            title: offer.name,
            href: `/offers/${offer.id}`,
        },
        {
            title: t('apply'),
            href: `/apply-form/${offer.id}`,
        },
    ];

    // ----- RENDER COMPONENT -----
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('apply_for')} ${offer.name} - EmpleaWorks`} />
            
            {/* Spinner Overlay */}
            {showSpinner && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(255,255,255,0.1)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <ClipLoader size={80} color={primaryColor} />
                </div>
            )}
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Cabecera de la página */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="mb-4"
                        style={{ color: primaryColor }}
                    >
                        <Link href={`/offers/${offer.id}`}>
                            <ArrowLeftIcon className="mr-2 h-4 w-4" />
                            {t('back_to_offer_details')}
                        </Link>
                    </Button>

                    <h1 
                        className="text-2xl font-bold mb-2"
                        style={{ color: primaryColor }}
                    >
                        {t('apply_for')}: {offer.name}
                    </h1>
                    <div className="flex items-center mb-4">
                        <span className="text-lg font-medium text-muted-foreground">{company.name}</span>
                        <Badge 
                            className={cn("ml-3", badgeBgClass, badgeTextClass)}
                            style={{
                                backgroundColor: !badgeBgClass ? `${primaryColor}20` : undefined,
                                color: !badgeTextClass ? primaryColor : undefined
                            }}
                        >
                            {offer.category}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario de Aplicación */}
                    <div className="lg:col-span-2">
                        <Card className={cn(borderColor)}>
                            <CardHeader className={cn(bgAccentColor, "rounded-t-xl")}>
                                <CardTitle style={{ color: primaryColor }}>{t('application_form')}</CardTitle>
                                <CardDescription>
                                    {t('complete_all_fields')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label 
                                            htmlFor="phone" 
                                            style={{ color: primaryColor }}
                                        >
                                            {t('phone_number')}
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder={t('enter_phone')}
                                            required
                                            className={cn("focus-visible:ring-[#EB7C28]")}
                                        />
                                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label 
                                            htmlFor="email"
                                            style={{ color: primaryColor }}
                                        >
                                            {t('email')}
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder={t('enter_email')}
                                            required
                                            className={cn("focus-visible:ring-[#EB7C28]")}
                                        />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label 
                                            htmlFor="cl"
                                            style={{ color: primaryColor }}
                                        >
                                            {t('cover_letter')}
                                        </Label>
                                        <Textarea
                                            id="cl"
                                            value={data.cl}
                                            onChange={e => setData('cl', e.target.value)}
                                            placeholder={t('why_apply')}
                                            rows={5}
                                            required
                                            className={cn("focus-visible:ring-[#EB7C28]")}
                                        />
                                        {errors.cl && <p className="text-sm text-red-500">{errors.cl}</p>}
                                    </div>

                                    {/* Checkbox de términos y condiciones */}
                                    <div className="flex items-start gap-2 mt-4">
                                        <Checkbox 
                                            id="terms" 
                                            name="terms" 
                                            checked={acceptTerms} 
                                            onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                                            required
                                            className="data-[state=checked]:bg-[#EB7C28] data-[state=checked]:border-[#EB7C28]"
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label 
                                                htmlFor="terms" 
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {t('agree_terms_extended')}
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                {t('data_processing_notice')} 
                                                <Link 
                                                    href={route('terms')} 
                                                    className="hover:underline"
                                                    style={{ color: primaryColor }}
                                                >
                                                    {t('terms_and_conditions')}
                                                </Link>
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full mt-4"
                                        disabled={processing || !acceptTerms}
                                        style={{ 
                                            backgroundColor: primaryColor,
                                            color: 'white'
                                        }}
                                    >
                                        {processing ? t('submitting') : t('submit_application')}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resumen del Trabajo */}
                    <div>
                        <Card className={cn(borderColor)}>
                            <CardHeader className={cn(bgAccentColor, "rounded-t-xl")}>
                                <CardTitle style={{ color: primaryColor }}>{t('job_summary')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center">
                                    {company.logo ? (
                                        <img
                                            src={`/storage/${company.logo}`}
                                            alt={company.name}
                                            className="size-16 rounded-md object-cover mr-4"
                                        />
                                    ) : (
                                        <div 
                                            className="size-16 rounded-md flex items-center justify-center mr-4"
                                            style={{ backgroundColor: `${primaryColor}15` }}
                                        >
                                            <BuildingIcon 
                                                className="size-8"
                                                style={{ color: primaryColor }}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-lg">{company.name}</h3>
                                    </div>
                                </div>

                                <Separator style={{ backgroundColor: `${primaryColor}20` }} />

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <div 
                                            className="size-9 flex items-center justify-center rounded-full mr-3"
                                            style={{ backgroundColor: `${primaryColor}15` }}
                                        >
                                            <BriefcaseIcon 
                                                className="size-5" 
                                                style={{ color: primaryColor }}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('contract_type')}</p>
                                            <p className="font-medium">{offer.contract_type}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div 
                                            className="size-9 flex items-center justify-center rounded-full mr-3"
                                            style={{ backgroundColor: `${primaryColor}15` }}
                                        >
                                            <MapPinIcon 
                                                className="size-5" 
                                                style={{ color: primaryColor }}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('location')}</p>
                                            <p className="font-medium">{offer.job_location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div 
                                            className="size-9 flex items-center justify-center rounded-full mr-3"
                                            style={{ backgroundColor: `${primaryColor}15` }}
                                        >
                                            <CalendarIcon 
                                                className="size-5" 
                                                style={{ color: primaryColor }}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('deadline')}</p>
                                            <p className="font-medium">{new Date(offer.closing_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}