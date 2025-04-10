import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { BriefcaseIcon, CalendarIcon, MapPinIcon, BuildingIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type BreadcrumbItem } from '@/types';
import { ShowOfferProps } from '@/types/types';
import { useState } from 'react';
import { Offer, Company } from "@/types/types";

interface ApplyFormProps {
    offer: Offer;  // Recibimos la oferta como prop
}

export default function ApplyForm({ offer }: ApplyFormProps) {
    const { company } = offer;

    // Form state
    const [agreed, setAgreed] = useState(false);

    // aqui definimos como trabajará inertiajs con el formulario //
    const { data, setData, post, processing, errors } = useForm({
        phone: '',
        email: '',
        cl: '',
        offer_id: offer.id,
    });

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/apply', { //peticion a la ruta de guardado del backend //
            onSuccess: () => {
                //el controlador manejará la redirección//
                console.log("Application submitted successfully");
            }
        });
    };

    // Breadcrumbs for navigation
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: offer.name,
            href: `/offers/${offer.id}`,
        },
        {
            title: 'Apply',
            href: `/apply-form/${offer.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Apply for ${offer.name} - EmpleaWorks`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="mb-4"
                    >
                        <Link href={`/offers/${offer.id}`}>
                            <ArrowLeftIcon className="mr-2 h-4 w-4" />
                            Back to offer details
                        </Link>
                    </Button>

                    <h1 className="text-2xl font-bold mb-2">Apply for: {offer.name}</h1>
                    <div className="flex items-center mb-4">
                        <span className="text-lg font-medium text-muted-foreground">{company.name}</span>
                        <Badge className="ml-3">{offer.category}</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Application Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Form</CardTitle>
                                <CardDescription>
                                    Please complete all fields to apply for this position
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="Enter your contact email"
                                            required
                                        />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cl">Cover letter</Label>
                                        <Textarea
                                            id="cl"
                                            value={data.cl}
                                            onChange={e => setData('cl', e.target.value)}
                                            placeholder="Why do you want to apply for this job?"
                                            rows={5}
                                            required
                                        />
                                        {errors.cl && <p className="text-sm text-red-500">{errors.cl}</p>}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="terms"
                                            checked={agreed}
                                            onCheckedChange={(checked) => setAgreed(checked === true)}
                                            required
                                        />
                                        <Label htmlFor="terms" className="text-sm">
                                            I agree to the terms and conditions
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full mt-4"
                                        disabled={processing || !agreed}
                                    >
                                        {processing ? 'Submitting...' : 'Submit Application'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Job Summary */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center">
                                    {company.logo ? (
                                        <img
                                            src={company.logo}
                                            alt={company.name}
                                            className="size-16 rounded-md object-cover mr-4"
                                        />
                                    ) : (
                                        <div className="size-16 bg-primary/10 rounded-md flex items-center justify-center mr-4">
                                            <BuildingIcon className="size-8 text-primary/60" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-lg">{company.name}</h3>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <BriefcaseIcon className="size-5 mr-2 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Contract Type</p>
                                            <p className="font-medium">{offer.contract_type}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <MapPinIcon className="size-5 mr-2 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Location</p>
                                            <p className="font-medium">{offer.job_location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <CalendarIcon className="size-5 mr-2 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Deadline</p>
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