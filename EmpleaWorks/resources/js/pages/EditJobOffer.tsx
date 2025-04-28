import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
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
import { useForm, Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { FormEvent, useState, useEffect } from 'react';
import { Offer } from '@/types/types';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from '@/utils/i18n';

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
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    
    // Inicializar con la fecha de cierre existente
    const [date, setDate] = useState<Date | undefined>(
        offer.closing_date ? new Date(offer.closing_date) : undefined
    );

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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('edit_job_listing')}</CardTitle>
                        <CardDescription>{t('update_job_details')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Job Title */}
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('job_title')}</Label>
                                <Input
                                    id="name"
                                    placeholder={t('job_title_placeholder')}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

                            {/* Job Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">{t('job_description')}</Label>
                                <Textarea
                                    id="description"
                                    placeholder={t('job_description_placeholder')}
                                    rows={5}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">{t('category')}</Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                    >
                                        <SelectTrigger>
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
                                    <Label htmlFor="degree">{t('required_degree')}</Label>
                                    <Input
                                        id="degree"
                                        placeholder={t('degree_placeholder')}
                                        value={data.degree}
                                        onChange={(e) => setData('degree', e.target.value)}
                                    />
                                    {errors.degree && <p className="text-red-500 text-sm">{errors.degree}</p>}
                                </div>

                                {/* Contact Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t('contact_email')}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {/* Contract Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="contract_type">{t('contract_type')}</Label>
                                    <Select
                                        value={data.contract_type}
                                        onValueChange={(value) => setData('contract_type', value)}
                                    >
                                        <SelectTrigger>
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
                                    <Label htmlFor="job_location">{t('job_location')}</Label>
                                    <Input
                                        id="job_location"
                                        placeholder={t('location_placeholder')}
                                        value={data.job_location}
                                        onChange={(e) => setData('job_location', e.target.value)}
                                    />
                                    {errors.job_location && <p className="text-red-500 text-sm">{errors.job_location}</p>}
                                </div>

                                {/* Closing Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="closing_date">{t('application_deadline')}</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, 'PPP') : <span>{t('pick_date')}</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
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
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.closing_date && <p className="text-red-500 text-sm">{errors.closing_date}</p>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    {t('cancel')}
                                </Button>
                                <Button type="submit" disabled={processing}>
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