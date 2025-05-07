import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormEvent, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from '@/utils/i18n';
import { cn } from '@/lib/utils';

interface CreateJobOfferProps {
    categories: string[];
    contractTypes: string[];
    company?: {
        id: number;
        name: string;
    };
}

export default function CreateJobOffer({ categories = [], contractTypes = [], company }: CreateJobOfferProps) {
    // ----- HOOKS & STATE -----
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const [date, setDate] = useState<Date | undefined>(
        // Set default date to 30 days from now
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );

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
    // Clases CSS para aplicar el tema púrpura con acentos ámbar
    const borderColor = 'border-purple-100 dark:border-purple-600/30';
    const bgAccentColor = 'bg-purple-50/50 dark:bg-purple-950/20';
    const cardBgColor = 'bg-white dark:bg-gray-900';

    // ----- CONFIGURATION -----
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('company_dashboard'),
            href: '/company/dashboard',
        },
        {
            title: t('create_new_job'),
            href: '/company/create-job',
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category: '',
        degree: '',
        email: auth.user.email,
        contract_type: '',
        job_location: '',
        closing_date: date ? format(date, 'yyyy-MM-dd') : '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // Update the closing_date in case the date picker changed
        setData('closing_date', date ? format(date, 'yyyy-MM-dd') : '');
        
        post(route('offers.store'), {
            onSuccess: () => {
                toast.success(t('job_created_success'));
                // Redirect to company dashboard after success
                window.location.href = route('company.dashboard');
            },
            onError: () => {
                toast.error(t('job_created_error'));
            }
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
            <Head title={t('create_job_listing')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="px-2">
                    <h2 className="text-2xl font-semibold mb-2 text-[#7c28eb] dark:text-purple-300">
                        {t('create_new_job')}
                    </h2>
                    <p className="text-muted-foreground">{t('fill_job_details')}</p>
                </div>

                <Card className={cn(borderColor)}>
                    <CardHeader className={cn(bgAccentColor, "rounded-t-xl")}>
                        <CardTitle className="text-[#7c28eb] dark:text-purple-300">
                            {t('job_information')}
                        </CardTitle>
                        <CardDescription className="dark:text-gray-300">
                            {t('provide_position_details')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
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

                                {/* Job Category */}
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

                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Required Degree */}
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

                                {/* Job Location */}
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
                                                variant="outline"
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

                            <div className="flex justify-end gap-2 pt-4">
                                <Button 
                                    variant="outline" 
                                    type="button" 
                                    asChild
                                    className={cn(
                                        "border-purple-200 dark:border-purple-700",
                                        "text-[#7c28eb] dark:text-white",
                                        "hover:bg-purple-50 dark:hover:bg-purple-900/30",
                                        "hover:border-[#7c28eb] dark:hover:border-purple-500",
                                        "hover:text-[#6620c5] dark:hover:text-white"
                                    )}
                                >
                                    <Link href={route('company.dashboard')}>{t('cancel')}</Link>
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="text-white"
                                    style={{ backgroundColor: primaryColor }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = primaryHoverColor;
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = primaryColor;
                                    }}
                                >
                                    {processing ? t('creating') : t('create_job_listing')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}