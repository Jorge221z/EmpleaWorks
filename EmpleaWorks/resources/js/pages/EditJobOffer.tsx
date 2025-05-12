import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { useForm, Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { FormEvent, useState, useEffect } from 'react';
import { Offer } from '@/types/types';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from '@/utils/i18n';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface EditJobOfferProps {
    offer: Offer;
    categories: string[];
    contractTypes: string[];
    company?: {
        id: number;
        name: string;
    };
}

export default function EditJobOffer({ offer, categories = [], contractTypes = [], company }: EditJobOfferProps) {
    // ----- HOOKS & STATE -----
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    
    // Inicializar con la fecha de cierre existente
    const [date, setDate] = useState<Date | undefined>(
        offer.closing_date ? new Date(offer.closing_date) : undefined
    );

    // ----- COLOR THEMING SYSTEM -----
    // Colores principales (púrpura)
    const primaryColor = '#7c28eb';
    const primaryHoverColor = '#6620c5';
    const primaryLightColor = '#9645f4';
    
    // Colores de acento (ámbar)
    const accentColor = '#FDC231';

    // ----- TAILWIND CLASS MODIFIERS -----
    // Clases CSS para aplicar el tema púrpura con acentos ámbar
    const borderColor = 'border-purple-100 dark:border-purple-600/30';
    const bgAccentColor = 'bg-purple-50/50 dark:bg-purple-950/20';

    // Breadcrumbs con traducciones
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('company_dashboard'),
            href: '/company/dashboard',
        },
        {
            title: t('edit_job_listing'),
            href: '#',
        },
    ];

    const { data, setData, errors, put, processing } = useForm({
        name: offer.name || '',
        description: offer.description || '',
        category: offer.category || '',
        degree: offer.degree || '',
        email: offer.email || auth.user.email,
        contract_type: offer.contract_type || '',
        job_location: offer.job_location || '',
        closing_date: offer.closing_date || '',
    });

    useEffect(() => {
        // Si la oferta tiene cambios, actualizar el formulario
        if (offer) {
            setData({
                name: offer.name || '',
                description: offer.description || '',
                category: offer.category || '',
                degree: offer.degree || '',
                email: offer.email || auth.user.email,
                contract_type: offer.contract_type || '',
                job_location: offer.job_location || '',
                closing_date: offer.closing_date || '',
            });
            
            if (offer.closing_date) {
                setDate(new Date(offer.closing_date));
            }
        }
    }, [offer]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        put(route('offers.update', offer.id), {
            onSuccess: () => {
                toast.success(t('job_updated_success'));
            },
        });
    };

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
                }}
            />
            <Head title={t('edit_job_listing')} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 bg-[#FEFBF2] dark:bg-transparent">
                <div className="px-2">
                    <h2 className="text-2xl font-semibold mb-2 text-[#7c28eb] dark:text-purple-300">
                        {t('edit_job_listing')}
                    </h2>
                    <p className="text-muted-foreground">{t('update_job_details')}</p>
                </div>
                
                <Card className={cn(
                    borderColor,
                    "bg-white dark:bg-gray-900/90"
                )}>
                    <CardHeader className={cn(
                        bgAccentColor, 
                        "px-6 py-4"
                    )}>
                        <CardTitle className="text-[#7c28eb] dark:text-purple-300">
                            {t('job_information')}
                        </CardTitle>
                        <CardDescription className="dark:text-gray-300">
                            {t('update_job_details')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Job Title */}
                            <div className="space-y-2">
                                <Label 
                                    htmlFor="name" 
                                    className="text-[#7c28eb] dark:text-purple-300"
                                >
                                    {t('job_title')}
                                </Label>
                                <Input
                                    id="name"
                                    placeholder={t('job_title_placeholder')}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

                            {/* Job Description */}
                            <div className="space-y-2">
                                <Label 
                                    htmlFor="description" 
                                    className="text-[#7c28eb] dark:text-purple-300"
                                >
                                    {t('job_description')}
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder={t('job_description_placeholder')}
                                    rows={5}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                                />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {/* Category */}
                                <div className="space-y-2">
                                    <Label 
                                        htmlFor="category" 
                                        className="text-[#7c28eb] dark:text-purple-300"
                                    >
                                        {t('category')}
                                    </Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                    >
                                        <SelectTrigger className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500">
                                            <SelectValue placeholder={t('select_category')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                                </div>

                                {/* Education Level */}
                                <div className="space-y-2">
                                    <Label 
                                        htmlFor="degree" 
                                        className="text-[#7c28eb] dark:text-purple-300"
                                    >
                                        {t('required_degree')}
                                    </Label>
                                    <Input
                                        id="degree"
                                        placeholder={t('degree_placeholder')}
                                        value={data.degree}
                                        onChange={(e) => setData('degree', e.target.value)}
                                        className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                                    />
                                    {errors.degree && <p className="text-red-500 text-sm">{errors.degree}</p>}
                                </div>

                                {/* Contact Email */}
                                <div className="space-y-2">
                                    <Label 
                                        htmlFor="email" 
                                        className="text-[#7c28eb] dark:text-purple-300"
                                    >
                                        {t('contact_email')}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {/* Contract Type */}
                                <div className="space-y-2">
                                    <Label 
                                        htmlFor="contract_type" 
                                        className="text-[#7c28eb] dark:text-purple-300"
                                    >
                                        {t('contract_type')}
                                    </Label>
                                    <Select
                                        value={data.contract_type}
                                        onValueChange={(value) => setData('contract_type', value)}
                                    >
                                        <SelectTrigger className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500">
                                            <SelectValue placeholder={t('select_contract_type')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contractTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.contract_type && <p className="text-red-500 text-sm">{errors.contract_type}</p>}
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label 
                                        htmlFor="job_location" 
                                        className="text-[#7c28eb] dark:text-purple-300"
                                    >
                                        {t('job_location')}
                                    </Label>
                                    <Input
                                        id="job_location"
                                        placeholder={t('location_placeholder')}
                                        value={data.job_location}
                                        onChange={(e) => setData('job_location', e.target.value)}
                                        className="focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                                    />
                                    {errors.job_location && <p className="text-red-500 text-sm">{errors.job_location}</p>}
                                </div>

                                {/* Closing Date */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="closing_date"
                                        className="text-[#7c28eb] dark:text-purple-300"
                                    >
                                        {t('application_deadline')}
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="closing_date"
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    "border-purple-200 dark:border-purple-700",
                                                    !date && "text-muted-foreground",
                                                    "hover:bg-purple-50 dark:hover:bg-purple-900/30",
                                                    "hover:border-[#7c28eb] dark:hover:border-purple-500",
                                                    "focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500"
                                                )}
                                            >
                                                <CalendarIcon
                                                    className="mr-2 h-4 w-4"
                                                    style={{ color: accentColor }}
                                                />
                                                {date ? format(date, "PPP") : <span>{t('pick_date')}</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(newDate) => {
                                                    setDate(newDate);
                                                    if (newDate) {
                                                        setData('closing_date', format(newDate, 'yyyy-MM-dd'));
                                                    }
                                                }}
                                                initialFocus
                                                disabled={(date) => date < new Date()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.closing_date && <p className="text-red-500 text-sm">{errors.closing_date}</p>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                        "border-purple-200 dark:border-purple-700",
                                        "text-[#7c28eb] dark:text-white",
                                        "hover:bg-purple-50 dark:hover:bg-purple-900/30",
                                        "hover:border-[#7c28eb] dark:hover:border-purple-500",
                                        "hover:text-[#6620c5] dark:hover:text-white",
                                        "w-full sm:w-auto mt-2 sm:mt-0"
                                    )}
                                    onClick={() => window.history.back()}
                                >
                                    {t('cancel')}
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="text-white w-full sm:w-auto"
                                    style={{ backgroundColor: primaryColor }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = primaryHoverColor;
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = primaryColor;
                                    }}
                                >
                                    {processing ? t('updating') : t('update_job_listing')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}