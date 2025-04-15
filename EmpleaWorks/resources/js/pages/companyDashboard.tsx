import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarIcon, MapPinIcon, BriefcaseIcon, PlusCircleIcon, UsersIcon, BuildingIcon } from 'lucide-react';
import { Offer, Company } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast, { Toaster } from 'react-hot-toast';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Company Dashboard',
        href: '/company/dashboard',
    },
];

export default function CompanyDashboard({ companyOffers = [] }: { companyOffers?: Offer[] }) {
    const { auth } = usePage<SharedData>().props;
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Company Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Título del Dashboard */}
                <div className="px-2">
                    <h2 className="text-2xl font-semibold mb-2">Company Dashboard</h2>
                    <p className="text-muted-foreground">Manage your job listings and applicants</p>
                </div>
                
                {/* Acciones rápidas */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Listings</CardTitle>
                            <CardDescription>Manage your active job listings</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <div className="text-3xl font-bold">{companyOffers.length}</div>
                            <Button size="sm" className="gap-1">
                                <PlusCircleIcon className="h-4 w-4" />
                                New Job
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Applicants</CardTitle>
                            <CardDescription>Manage job applications</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <div className="text-3xl font-bold">0</div>
                            <Button size="sm" variant="outline" className="gap-1">
                                <UsersIcon className="h-4 w-4" />
                                View All
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Company Profile</CardTitle>
                            <CardDescription>Update your profile information</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <div className="text-lg font-medium truncate max-w-[150px]">{auth.user.name}</div>
                            <Button size="sm" variant="outline" className="gap-1">
                                <BuildingIcon className="h-4 w-4" />
                                Edit Profile
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Título de las ofertas */}
                <div className="px-2 mt-4">
                    <h2 className="text-2xl font-semibold mb-2">Your Job Listings</h2>
                    <p className="text-muted-foreground">Manage your current job postings</p>
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
                                    {offer.company ? offer.company.name : 'Empresa no disponible'}
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
                                        <span>Hasta: {new Date(offer.closing_date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={route('offers.show', offer.id)}
                                        className="text-primary hover:text-primary/80 text-sm font-medium"
                                    >
                                        Ver detalles →
                                    </Link>
                                    <Button variant="ghost" size="sm" className="ml-auto text-sm">
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        ))}
                        
                        {/* Card para añadir nueva oferta */}
                        <div className="border-sidebar-border/70 dark:border-sidebar-border bg-card/50 relative overflow-hidden rounded-xl border p-4 flex flex-col justify-center items-center min-h-[250px]">
                            <PlusCircleIcon className="h-10 w-10 mb-2 text-muted-foreground" />
                            <h3 className="font-medium text-lg mb-1">Create New Job Posting</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                                Add a new job opportunity to your listings
                            </p>
                            <Button>
                                Create Job Listing
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Si no hay ofertas publicadas por la empresa
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative bg-card/50 p-8 overflow-hidden rounded-xl border text-center my-6">
                        <div className="flex flex-col items-center gap-2 relative z-10">
                            <BuildingIcon className="h-12 w-12 mb-2 text-muted-foreground" />
                            <h2 className="text-xl font-semibold">No Job Listings Yet</h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-4">
                                You haven't created any job listings yet. Start attracting talent by posting your first job opportunity.
                            </p>
                            <Button className="gap-1">
                                <PlusCircleIcon className="h-4 w-4" />
                                Create Your First Job Listing
                            </Button>
                        </div>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5" />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}