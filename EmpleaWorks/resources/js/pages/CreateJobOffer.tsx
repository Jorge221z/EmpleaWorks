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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Company Dashboard',
        href: '/company/dashboard',
    },
    {
        title: 'Create New Job',
        href: '/company/create-job',
    },
];

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
    const [date, setDate] = useState<Date | undefined>(
        // Set default date to 30 days from now
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );

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
                toast.success('Job listing created successfully!');
                // Redirect to company dashboard after success
                window.location.href = route('company.dashboard');
            },
            onError: () => {
                toast.error('There was a problem creating your job listing');
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
            <Head title="Create Job Listing" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="px-2">
                    <h2 className="text-2xl font-semibold mb-2">Create New Job Listing</h2>
                    <p className="text-muted-foreground">Fill in the details to post a new job opportunity</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Job Information</CardTitle>
                        <CardDescription>
                            Provide details about the position you're offering
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Job Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Job Title</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Senior Web Developer"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                </div>

                                {/* Job Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select 
                                        value={data.category} 
                                        onValueChange={(value) => setData('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
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
                                <Label htmlFor="description">Job Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the role, responsibilities, and requirements"
                                    rows={5}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Required Degree */}
                                <div className="space-y-2">
                                    <Label htmlFor="degree">Required Degree/Education</Label>
                                    <Input
                                        id="degree"
                                        placeholder="e.g. Bachelor's in Computer Science"
                                        value={data.degree}
                                        onChange={(e) => setData('degree', e.target.value)}
                                    />
                                    {errors.degree && <p className="text-red-500 text-sm">{errors.degree}</p>}
                                </div>

                                {/* Contact Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Contact Email</Label>
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
                                    <Label htmlFor="contract_type">Contract Type</Label>
                                    <Select 
                                        value={data.contract_type} 
                                        onValueChange={(value) => setData('contract_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select contract type" />
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
                                    <Label htmlFor="job_location">Job Location</Label>
                                    <Input
                                        id="job_location"
                                        placeholder="e.g. Barcelona, Spain or Remote"
                                        value={data.job_location}
                                        onChange={(e) => setData('job_location', e.target.value)}
                                    />
                                    {errors.job_location && <p className="text-red-500 text-sm">{errors.job_location}</p>}
                                </div>

                                {/* Closing Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="closing_date">Application Deadline</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, 'PPP') : <span>Pick a date</span>}
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
                                    <Link href={route('company.dashboard')}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Job Listing'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}