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

interface CreateJobOfferProps {
    categories: string[];
    contractTypes: string[];
    company?: {
        id: number;
        name: string;
    };
}

export default function CreateJobOffer({ categories = [], contractTypes = [], company }: CreateJobOfferProps) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const [date, setDate] = useState<Date | undefined>(
        // Set default date to 30 days from now
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );

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
                    <h2 className="text-2xl font-semibold mb-2">{t('create_new_job')}</h2>
                    <p className="text-muted-foreground">{t('fill_job_details')}</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('job_information')}</CardTitle>
                        <CardDescription>
                            {t('provide_position_details')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
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

                                {/* Job Category */}
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

                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Required Degree */}
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

                                {/* Job Location */}
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
                                            disabled={(date) => date < new Date()}
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.closing_date && <p className="text-red-500 text-sm">{errors.closing_date}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" type="button" asChild>
                                    <Link href={route('company.dashboard')}>{t('cancel')}</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
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