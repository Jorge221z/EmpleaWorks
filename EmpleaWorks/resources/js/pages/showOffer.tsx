import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BriefcaseIcon, CalendarIcon, MapPinIcon, BuildingIcon, MailIcon, GlobeIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Offer, Company } from '@/types/types';

interface ShowOfferProps {
  offer: Offer;
}

export default function ShowOffer({ offer }: ShowOfferProps) {
  const { company } = offer;
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: offer.name,
      href: `/offers/${offer.id}`,
    },
  ];
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
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
              Volver a ofertas
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
                <CardTitle>Descripción de la oferta</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{offer.description}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Detalles del empleo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <BriefcaseIcon className="size-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de contrato</p>
                      <p className="font-medium">{offer.contract_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPinIcon className="size-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ubicación</p>
                      <p className="font-medium">{offer.job_location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <CalendarIcon className="size-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha límite</p>
                      <p className="font-medium">{new Date(offer.closing_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="size-5 mr-2 flex items-center justify-center text-muted-foreground">
                      <span className="text-lg font-bold">D</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Titulación requerida</p>
                      <p className="font-medium">{offer.degree || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Aplicar a esta oferta</Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Información de la empresa */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Sobre la empresa</CardTitle>
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
                
                {company.description && (
                  <div>
                    <h4 className="font-medium mb-2">Descripción</h4>
                    <p className="text-sm text-muted-foreground">{company.description}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="font-medium mb-1">Contacto</h4>
                  
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