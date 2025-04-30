import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { UsersIcon, FileIcon, DownloadIcon, BriefcaseIcon, CalendarIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useTranslation } from '@/utils/i18n';
import { type BreadcrumbItem } from '@/types';

interface Applicant {
    id: number;
    name: string;
    email: string;
    image: string | null;
    cv: string | null;
}

interface JobWithApplicants {
    id: number;
    name: string;
    category: string;
    closing_date: string;
    applicants: Applicant[];
    applicants_count: number;
}

interface CompanyApplicantsProps {
    jobsWithApplicants: JobWithApplicants[];
}

export default function CompanyApplicants({ jobsWithApplicants = [] }: CompanyApplicantsProps) {
    const { t } = useTranslation();
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('company_dashboard'),
            href: '/company/dashboard',
        },
        {
            title: t('applicants'),
            href: '/company/applicants',
        },
    ];
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('applicants_by_job')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Título de la página */}
                <div className="px-2">
                    <h2 className="text-2xl font-semibold mb-2">{t('applicants_by_job')}</h2>
                    <p className="text-muted-foreground">{t('applications_to_jobs')}</p>
                </div>
                
                {jobsWithApplicants.length > 0 ? (
                    <div className="grid gap-8">
                        {jobsWithApplicants.map((job) => (
                            <Card key={job.id} className="overflow-hidden">
                                <CardHeader className="bg-muted/50">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <BriefcaseIcon className="h-5 w-5 text-primary/80" />
                                                {job.name}
                                            </CardTitle>
                                            <CardDescription className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                                                <Badge variant="secondary" className="mt-1">
                                                    {job.category}
                                                </Badge>
                                                <span className="flex items-center gap-1 text-xs">
                                                    <CalendarIcon className="h-3.5 w-3.5" />
                                                    {new Date(job.closing_date).toLocaleDateString()}
                                                </span>
                                            </CardDescription>
                                        </div>
                                        <Badge variant="default" className="text-sm">
                                            {job.applicants_count} {job.applicants_count === 1 ? t('candidate') : t('candidates')}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="pt-6">
                                    {job.applicants.length > 0 ? (
                                        <div className="space-y-4">
                                            {job.applicants.map((applicant) => (
                                                <div key={applicant.id} className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b last:border-0">
                                                    <div className="flex items-center gap-3">
                                                        {/* Avatar del candidato */}
                                                        {applicant.image ? (
                                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                                                <img
                                                                    src={`/storage/${applicant.image}`}
                                                                    alt={applicant.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                                <UsersIcon className="h-5 w-5 text-primary/70" />
                                                            </div>
                                                        )}
                                                        
                                                        {/* Información del candidato */}
                                                        <div>
                                                            <div className="font-medium text-sm">{applicant.name}</div>
                                                            <div className="text-xs text-muted-foreground">{applicant.email}</div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Botón para descargar CV */}
                                                    {applicant.cv ? (
                                                        <Button
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="gap-1"
                                                            asChild
                                                        >
                                                            <a 
                                                                href={`/storage/${applicant.cv}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                download
                                                            >
                                                                <FileIcon className="h-3.5 w-3.5" />
                                                                {t('cv_download')}
                                                            </a>
                                                        </Button>
                                                    ) : (
                                                        <Badge variant="outline" className="text-muted-foreground text-xs">
                                                            {t('no_cv_provided')}
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <UsersIcon className="h-10 w-10 text-muted-foreground mb-2" />
                                            <h3 className="font-medium text-lg">{t('no_applicants_yet')}</h3>
                                            <p className="text-sm text-muted-foreground max-w-md">
                                                {t('no_applicants_message')}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    // Mensaje si no hay ofertas con candidatos
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative bg-card/50 p-8 overflow-hidden rounded-xl border text-center my-6">
                        <div className="flex flex-col items-center gap-2 relative z-10">
                            <UsersIcon className="h-12 w-12 mb-2 text-muted-foreground" />
                            <h2 className="text-xl font-semibold">{t('no_applications_yet')}</h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-4">
                                {t('no_applications_message')}
                            </p>
                            <Button asChild>
                                <Link href={route('company.dashboard')}>                                
                                    {t('back_to_dashboard')}
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