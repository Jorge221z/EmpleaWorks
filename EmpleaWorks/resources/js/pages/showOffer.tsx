import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { BriefcaseIcon, CalendarIcon, MapPinIcon, BuildingIcon, MailIcon, GlobeIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { ShowOfferProps } from '@/types/types';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from '@/utils/i18n';

export default function ShowOffer({ offer }: ShowOfferProps) {
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
  const { t } = useTranslation();
  
  const { company } = offer;
  
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

  // Show flash messages
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
        }}
      />
      <Head title={`${offer.name} - EmpleaWorks`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mb-4"
          >
            <Link href={route('dashboard')}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              {t('back_to_offers')}
            </Link>
          </Button>
          
          <h1 className="text-2xl font-bold mb-2">{offer.name}</h1>
          <div className="flex items-center mb-4">
            <span className="text-lg font-medium text-muted-foreground">{company.name}</span>
            <Badge className="ml-3">{offer.category}</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalles de la oferta */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('job_description')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{offer.description}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('job_details')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <BriefcaseIcon className="size-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('contract_type')}</p>
                      <p className="font-medium">{offer.contract_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPinIcon className="size-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('location')}</p>
                      <p className="font-medium">{offer.job_location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <CalendarIcon className="size-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('deadline')}</p>
                      <p className="font-medium">{new Date(offer.closing_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="size-5 mr-2 flex items-center justify-center text-muted-foreground">
                      <span className="text-lg font-bold">D</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('required_degree')}</p>
                      <p className="font-medium">{offer.degree || t('not_specified')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={route('apply.form', offer.id)}>
                    {t('apply_to_this_offer')}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Información de la empresa */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t('about_company')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  {company.logo ? (
                    <img 
                      src={`/storage/${company.logo}`} 
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
                
                {company.description && (
                  <div>
                    <h4 className="font-medium mb-2">{t('description')}</h4>
                    <p className="text-sm text-muted-foreground">{company.description}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="font-medium mb-1">{t('contact')}</h4>
                  
                  <div className="flex items-center">
                    <MailIcon className="size-4 mr-2 text-muted-foreground" />
                    <a 
                      href={`mailto:${company.email}`} 
                      className="text-sm text-primary hover:underline"
                    >
                      {company.email}
                    </a>
                  </div>
                  
                  {company.web_link && (
                    <div className="flex items-center">
                      <GlobeIcon className="size-4 mr-2 text-muted-foreground" />
                      <a 
                        href={company.web_link}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-sm text-primary hover:underline"
                      >
                        {company.web_link.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  
                  {company.address && (
                    <div className="flex items-center">
                      <MapPinIcon className="size-4 mr-2 text-muted-foreground" />
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