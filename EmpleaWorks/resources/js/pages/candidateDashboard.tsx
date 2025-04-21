import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { CalendarIcon, MapPinIcon, BriefcaseIcon, FileIcon, UserIcon, UsersIcon } from 'lucide-react';
import { Offer } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast, { Toaster } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Candidate Dashboard',
        href: '/candidate/dashboard',
    },
];

export default function CandidateDashboard({ candidateOffers = [] }: { candidateOffers?: Offer[] }) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
        if (flash && flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

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
            <Head title="Candidate Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Dashboard Title */}
                <div className="px-2">
                    <h2 className="text-2xl font-semibold mb-2">Candidate Dashboard</h2>
                    <p className="text-muted-foreground">Track your applications and profile</p>
                </div>
                
                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Applications</CardTitle>
                            <CardDescription>Track your job applications</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <div className="text-3xl font-bold">{candidateOffers.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Your candidate information</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <div className="text-lg font-medium truncate max-w-[150px]">{user?.name}</div>
                            <Button size="sm" variant="outline" className="gap-1">
                                <UserIcon className="h-4 w-4" />
                                <Link href={'/settings/profile'}>                                  
                                    Edit Profile
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Applications Heading */}
                <div className="px-2 mt-4">
                    <h2 className="text-2xl font-semibold mb-2">Your Applications</h2>
                    <p className="text-muted-foreground">Jobs you've applied to</p>
                </div>

                {/* Applied Offers Grid */}
                {candidateOffers && candidateOffers.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {candidateOffers.map((offer) => (
                            <div
                                key={offer.id}
                                className="border-sidebar-border/70 dark:border-sidebar-border bg-card relative overflow-hidden rounded-xl border p-4 flex flex-col md:flex-row md:items-center md:gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg">{offer.name}</h3>
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                            {offer.category}
                                        </span>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-2">
                                        {offer.company ? offer.company.name : 'Company not available'}
                                    </p>

                                    <p className="text-sm mb-4">
                                        {offer.description}
                                    </p>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
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
                                            {(() => {
                                                const closingDate = new Date(offer.closing_date);
                                                const currentDate = new Date();
                                                const daysLeft = Math.ceil((closingDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
                                                // Apply red text if less than 3 days left
                                                return (
                                                    <span className={daysLeft < 3 ? "text-red-500 font-medium" : ""}>
                                                        Closed in: {daysLeft <= 0 ? "Closed" : `${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    <Link
                                        href={route('offer.show', offer.id)}
                                        className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-1.5 self-end md:self-center whitespace-nowrap"
                                    >
                                        View details
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                            <path d="M5 12h14"></path>
                                            <path d="m12 5 7 7-7 7"></path>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Empty state when no applications
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative bg-card/50 p-8 overflow-hidden rounded-xl border text-center my-6">
                        <div className="flex flex-col items-center gap-2 relative z-10">
                            <FileIcon className="h-12 w-12 mb-2 text-muted-foreground" />
                            <h2 className="text-xl font-semibold">No Applications Yet</h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-4">
                                You haven't applied to any job offers yet. Browse available jobs to get started.
                            </p>
                            <Button 
                                className="gap-1"
                                asChild
                            >
                                <Link href={route('dashboard')}>
                                    Browse Available Jobs
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