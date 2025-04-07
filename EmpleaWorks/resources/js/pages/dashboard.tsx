import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { offers = [] } = usePage<{
        offers: string[];
    }>().props;



    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth.user;

    // Function to handle direct navigation without Inertia
    const navigateToLogin = () => {
        window.location.href = route('login');
    };
    
    const navigateToRegister = () => {
        window.location.href = route('register');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {!isAuthenticated && (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative bg-card p-6 overflow-hidden rounded-xl border mb-2">
                        <div className="flex flex-col gap-2 relative z-10">
                            <h2 className="text-xl font-semibold">Welcome to EmpleaWorks</h2>
                            <p className="text-muted-foreground">Sign in to access all features and personalize your experience.</p>
                            <div className="flex gap-2 mt-2">
                                <Button 
                                    variant="default"
                                    onClick={navigateToLogin}
                                >
                                    Sign in
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={navigateToRegister}
                                >
                                    Create account
                                </Button>
                            </div>
                        </div>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5" />
                    </div>
                )}
                
                <div className="grid auto-rows-min gap-4 lg:grid-cols-1">
                    {offers.length > 0 ? (
                        offers.map((offer, index) => (
                            <div key={index} className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <Link href={`/offers/${offer}`} className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                    {offer}
                                </Link>
                            </div>
                        ))
                    ) : (
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border text-gray-500 dark:text-gray-400 text-center py-10">
                                <p>There are no offers available at the moment.</p>
                                
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-950/20 dark:stroke-neutral-100/20" />
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
