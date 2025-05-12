import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
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
  const { t } = useTranslation();
  const { company } = offer;

  // ----- COLOR THEMING SYSTEM -----
  // Colores principales (púrpura)
  const primaryColor = '#7c28eb';
  const primaryHoverColor = '#6620c5';
  const primaryLightColor = '#9645f4';
  
  // Colores de acento (ámbar)
  const accentColor = '#FDC231';
  
  // Clases para el tema
  const borderColor = 'border-purple-100 dark:border-purple-600/30';
  const bgAccentColor = 'bg-purple-50/50 dark:bg-purple-950/20';

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
      
      {/* Contenedor principal */}
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 bg-[#FEFBF2] dark:bg-transparent">
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
            className="text-2xl font-bold mb-2 text-[#7c28eb] dark:text-purple-300"
          >
            {offer.name}
          </h1>
          <div className="flex items-center mb-4">
            <span className="text-lg font-medium text-muted-foreground">{company.name}</span>
            <Badge 
              className={cn(
                "ml-3",
                "bg-amber-100 text-amber-800 hover:bg-amber-200", 
                "dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/40"
              )}
            >
              {offer.category}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className={cn(
              borderColor,
              "bg-white dark:bg-gray-900/90"
            )}>
              <CardHeader className={cn(
                bgAccentColor, 
                "px-6 py-4"
              )}>
                <CardTitle className="text-[#7c28eb] dark:text-purple-300">{t('job_description')}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="whitespace-pre-line">{offer.description}</p>
              </CardContent>
            </Card>
            
            <Card className={cn(
              borderColor,
              "bg-white dark:bg-gray-900/90"
            )}>
              <CardHeader className={cn(
                bgAccentColor, 
                "px-6 py-4"
              )}>
                <CardTitle className="text-[#7c28eb] dark:text-purple-300">{t('job_details')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="size-9 flex items-center justify-center rounded-full mr-3" 
                      style={{ backgroundColor: `${primaryColor}15` }}>
                      <BriefcaseIcon className="size-5 text-[#9645f4] dark:text-[#c79dff]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('contract_type')}</p>
                      <p className="font-medium">{offer.contract_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="size-9 flex items-center justify-center rounded-full mr-3" 
                      style={{ backgroundColor: `${primaryColor}15` }}>
                      <MapPinIcon className="size-5 text-[#9645f4] dark:text-[#c79dff]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('location')}</p>
                      <p className="font-medium">{offer.job_location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="size-9 flex items-center justify-center rounded-full mr-3" 
                      style={{ backgroundColor: `${primaryColor}15` }}>
                      <CalendarIcon className="size-5 text-[#9645f4] dark:text-[#c79dff]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('deadline')}</p>
                      <p className="font-medium">{new Date(offer.closing_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="size-9 flex items-center justify-center rounded-full mr-3" 
                      style={{ backgroundColor: `${primaryColor}15` }}>
                      <span className="text-lg font-bold text-[#9645f4] dark:text-[#c79dff]">D</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('required_degree')}</p>
                      <p className="font-medium">{offer.degree || t('not_specified')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center md:col-span-2">
                    <div className="size-9 flex items-center justify-center rounded-full mr-3" 
                      style={{ backgroundColor: `${primaryColor}15` }}>
                      <MailIcon className="size-5 text-[#9645f4] dark:text-[#c79dff]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('contact_email')}</p>
                      <a 
                        href={`mailto:${offer.email}`} 
                        className="font-medium hover:underline text-[#7c28eb] dark:text-purple-300"
                      >
                        {offer.email}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full text-white" 
                  style={{ backgroundColor: primaryColor }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = primaryHoverColor;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColor;
                  }}
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
            <Card className={cn(
              borderColor,
              "bg-white dark:bg-gray-900/90"
            )}>
              <CardHeader className={cn(
                bgAccentColor, 
                "px-6 py-4"
              )}>
                <CardTitle className="text-[#7c28eb] dark:text-purple-300">{t('about_company')}</CardTitle>
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
                    <div 
                      className="size-16 rounded-md flex items-center justify-center mr-4"
                      style={{ backgroundColor: `${accentColor}20` }}
                    >
                      <BuildingIcon className="size-8 text-[#FDC231] dark:text-[#FFDE7A]" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{company.name}</h3>
                  </div>
                </div>
                
                <Separator className="bg-purple-100 dark:bg-purple-600/30" />
                
                {company.description && (
                  <div>
                    <h4 className="font-medium mb-2 text-[#7c28eb] dark:text-purple-300">{t('description')}</h4>
                    <p className="text-sm text-muted-foreground">{company.description}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="font-medium mb-1 text-[#7c28eb] dark:text-purple-300">{t('contact')}</h4>
                  
                  <div className="flex items-center">
                    <MailIcon className="size-4 mr-2 text-[#FDC231] dark:text-[#FFDE7A]" />
                    <a 
                      href={`mailto:${company.email}`} 
                      className="text-sm hover:underline text-[#7c28eb] dark:text-purple-300"
                    >
                      {company.email}
                    </a>
                  </div>
                  
                  {company.web_link && (
                    <div className="flex items-center">
                      <GlobeIcon className="size-4 mr-2 text-[#FDC231] dark:text-[#FFDE7A]" />
                      <a 
                        href={company.web_link}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-sm hover:underline text-[#7c28eb] dark:text-purple-300"
                      >
                        {company.web_link.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  
                  {company.address && (
                    <div className="flex items-center">
                      <MapPinIcon className="size-4 mr-2 text-[#FDC231] dark:text-[#FFDE7A]" />
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