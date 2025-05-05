import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo } from 'react';
import { BriefcaseIcon, CalendarIcon, MapPinIcon, BuildingIcon, MailIcon, GlobeIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { ShowOfferProps } from '@/types/types';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from '@/utils/i18n';
import { cn } from '@/lib/utils';

export default function ShowOffer({ offer }: ShowOfferProps) {
  // ----- HOOKS & STATE -----
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
  const { auth } = usePage<SharedData>().props;
  const { t } = useTranslation();
  const { company } = offer;

  // ----- COLOR THEMING SYSTEM -----
  const userRole = auth.user?.role_id;
  const primaryColor = useMemo(() => {
    if (userRole === 1) return '#EB7C28';
    if (userRole === 2) return '#28EB7C';
    return '#7c28eb';
  }, [userRole]);

  const accentColor = useMemo(() => {
    if (primaryColor === '#EB7C28') return '#F5A46A';
    if (primaryColor === '#28EB7C') return '#71F1A9';
    return '#9645f4';
  }, [primaryColor]);

  const borderColor = useMemo(() => {
    if (primaryColor === '#EB7C28') return 'border-orange-100 dark:border-orange-600/30';
    if (primaryColor === '#28EB7C') return 'border-green-100 dark:border-green-600/30';
    return 'border-purple-100 dark:border-purple-600/30';
  }, [primaryColor]);

  const bgAccentColor = useMemo(() => {
    if (primaryColor === '#EB7C28') return 'bg-orange-50/50 dark:bg-orange-950/20';
    if (primaryColor === '#28EB7C') return 'bg-green-50/50 dark:bg-green-950/20';
    return 'bg-purple-50/50 dark:bg-purple-950/20';
  }, [primaryColor]);

  const badgeBgClass = useMemo(() => {
    if (primaryColor === '#EB7C28') return 'bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/40';
    if (primaryColor === '#28EB7C') return 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/40';
    return '';
  }, [primaryColor]);

  const badgeTextClass = useMemo(() => {
    if (primaryColor === '#EB7C28') return 'text-orange-800 dark:text-orange-300';
    if (primaryColor === '#28EB7C') return 'text-green-800 dark:text-green-300';
    return '';
  }, [primaryColor]);

  // ----- CONFIGURATION -----
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('dashboard'),
      href: '/dashboard',
    },
    {
      title: offer.name,
      href: `/offers/${offer.id}`,
    },
  ];

  // ----- SIDE EFFECTS -----
  useEffect(() => {
    if (flash && flash.success) {
      toast.success(flash.success);
    }
    if (flash && flash.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  // ----- RENDER COMPONENT -----
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
      <Head title={`${offer.name} - EmpleaWorks`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mb-4 hover:text-foreground/80"
            style={{ color: primaryColor }}
          >
            <Link href={route('dashboard')}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              {t('back_to_offers')}
            </Link>
          </Button>
          
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ color: primaryColor }}
          >
            {offer.name}
          </h1>
          <div className="flex items-center mb-4">
            <span className="text-lg font-medium text-muted-foreground">{company.name}</span>
            <Badge 
              className={cn(
                "ml-3", 
                badgeBgClass, 
                badgeTextClass
              )}
              style={{ 
                backgroundColor: !badgeBgClass ? `${primaryColor}20` : undefined,
                color: !badgeTextClass ? primaryColor : undefined
              }}
            >
              {offer.category}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className={cn(borderColor)}>
              <CardHeader className={cn(bgAccentColor, "rounded-t-xl")}>
                <CardTitle style={{ color: primaryColor }}>{t('job_description')}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="whitespace-pre-line">{offer.description}</p>
              </CardContent>
            </Card>
            
            <Card className={cn(borderColor)}>
              <CardHeader className={cn(bgAccentColor, "rounded-t-xl")}>
                <CardTitle style={{ color: primaryColor }}>{t('job_details')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="size-9 flex items-center justify-center rounded-full mr-3" 
                      style={{ backgroundColor: `${primaryColor}15` }}>
                      <BriefcaseIcon className="size-5" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('contract_type')}</p>
                      <p className="font-medium">{offer.contract_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="size-9 flex items-center justify-center rounded-full mr-3" 
                      style={{ backgroundColor: `${primaryColor}15` }}>
                      <MapPinIcon className="size-5" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('location')}</p>
                      <p className="font-medium">{offer.job_location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="size-9 flex items-center justify-center rounded-full mr-3" 
                      style={{ backgroundColor: `${primaryColor}15` }}>
                      <CalendarIcon className="size-5" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('deadline')}</p>
                      <p className="font-medium">{new Date(offer.closing_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="size-9 flex items-center justify-center rounded-full mr-3" 
                      style={{ backgroundColor: `${primaryColor}15` }}>
                      <span className="text-lg font-bold" style={{ color: primaryColor }}>D</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('required_degree')}</p>
                      <p className="font-medium">{offer.degree || t('not_specified')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  style={{ backgroundColor: primaryColor, color: 'white' }}
                  asChild
                >
                  <Link href={route('apply.form', offer.id)}>
                    {t('apply_to_this_offer')}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card className={cn(borderColor)}>
              <CardHeader className={cn(bgAccentColor, "rounded-t-xl")}>
                <CardTitle style={{ color: primaryColor }}>{t('about_company')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center">
                  {company.logo ? (
                    <img 
                      src={`/storage/${company.logo}`} 
                      alt={company.name} 
                      className="size-16 rounded-md object-cover mr-4"
                    />
                  ) : (
                    <div className="size-16 rounded-md flex items-center justify-center mr-4" 
                      style={{ backgroundColor: `${primaryColor}15` }}>
                      <BuildingIcon className="size-8" style={{ color: primaryColor }} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{company.name}</h3>
                  </div>
                </div>
                
                <Separator style={{ backgroundColor: `${primaryColor}20` }} />
                
                {company.description && (
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: primaryColor }}>{t('description')}</h4>
                    <p className="text-sm text-muted-foreground">{company.description}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="font-medium mb-1" style={{ color: primaryColor }}>{t('contact')}</h4>
                  
                  <div className="flex items-center">
                    <MailIcon className="size-4 mr-2" style={{ color: primaryColor }} />
                    <a 
                      href={`mailto:${company.email}`} 
                      className="text-sm hover:underline"
                      style={{ color: primaryColor }}
                    >
                      {company.email}
                    </a>
                  </div>
                  
                  {company.web_link && (
                    <div className="flex items-center">
                      <GlobeIcon className="size-4 mr-2" style={{ color: primaryColor }} />
                      <a 
                        href={company.web_link}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-sm hover:underline"
                        style={{ color: primaryColor }}
                      >
                        {company.web_link.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  
                  {company.address && (
                    <div className="flex items-center">
                      <MapPinIcon className="size-4 mr-2" style={{ color: primaryColor }} />
                      <span className="text-sm">{company.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}