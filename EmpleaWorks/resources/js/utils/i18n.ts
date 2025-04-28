import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

// Objeto que contendrá las traducciones
const translations: Record<string, Record<string, string>> = {
    en: {
        // Sidebar
        'dashboard': 'Dashboard',
        'company_dashboard': 'Company Dashboard',
        'my_offers': 'My Offers',
        'repository': 'Repository',
        'documentation': 'Documentation',
        'language': 'Language',

        // Dashboard - Pagina principal
        'welcome_title': 'Welcome to EmpleaWorks',
        'welcome_subtitle': 'Sign in to access all features and personalize your experience.',
        'sign_in': 'Sign in',
        'create_account': 'Create account',
        'recent_jobs': 'Recent job offers',
        'explore_opportunities': 'Explore the latest available opportunities',
        'search_jobs': 'Search jobs',
        'contract_type': 'Contract type',
        'location': 'Location',
        'until': 'Until',
        'view_details': 'View details',
        'no_offers_found': 'No offers found',
        'try_other_terms': 'Try with other search terms',
        'no_offers_available': 'No offers available',
        'company_not_available': 'Company not available',

        // Candidate Dashboard
        'candidate_dashboard_title': 'Candidate Dashboard',
        'candidate_dashboard_subtitle': 'Track your applications and profile',
        'your_applications': 'Your Applications',
        'jobs_applied_to': 'Jobs you\'ve applied to',
        'closed_in': 'Closed in',
        'closed': 'Closed',
        'days_remaining': '{days} day',
        'days_remaining_plural': '{days} days',
        'company_info': 'Company Info',
        'company_information': 'Company Information',
        'company_details': 'Details about the company offering this position',
        'about_company': 'About the company',
        'contact_information': 'Contact Information',
        'visit_website': 'Visit Website',
        'no_applications_yet': 'No Applications Yet',
        'no_applications_message': 'You haven\'t applied to any job offers yet. Browse available jobs to get started.',
        'browse_available_jobs': 'Browse Available Jobs',
        'applications': 'Applications',
        'track_applications': 'Track your job applications',
        'active_applications': 'Active application',
        'active_applications_plural': 'Active applications',
        'find_jobs': 'Find Jobs',
        'profile': 'Profile',
        'your_information': 'Your candidate information',
        'complete_profile': 'Complete profile',
        'edit_profile': 'Edit Profile',
        
        // Tarjetas de empresa
        'job_listings': 'Job Listings',
        'manage_jobs': 'Manage your active job listings',
        'active_positions': 'Active positions',
        'new_job': 'New Job',
        'applicants': 'Applicants',
        'applications_to_jobs': 'Applications to your jobs',
        'total_candidates': 'Total candidates',
        'company_profile': 'Company Profile',
        'update_profile': 'Update your profile information'
    },
    es: {
        // Sidebar
        'dashboard': 'Ofertas',
        'company_dashboard': 'Panel de Empresa',
        'my_offers': 'Mis Ofertas',
        'repository': 'Repositorio',
        'documentation': 'Documentación',
        'language': 'Idioma',

        // Dashboard - Pagina principal
        'welcome_title': 'Bienvenido a EmpleaWorks',
        'welcome_subtitle': 'Inicia sesión para acceder a todas las funciones y personalizar tu experiencia.',
        'sign_in': 'Iniciar sesión',
        'create_account': 'Crear cuenta',
        'recent_jobs': 'Ofertas de empleo recientes',
        'explore_opportunities': 'Explora las últimas oportunidades disponibles',
        'search_jobs': 'Buscar empleos',
        'contract_type': 'Tipo de contrato',
        'location': 'Ubicación',
        'until': 'Hasta',
        'view_details': 'Ver detalles',
        'no_offers_found': 'No se encontraron ofertas',
        'try_other_terms': 'Intenta con otros términos de búsqueda',
        'no_offers_available': 'No hay ofertas disponibles',
        'company_not_available': 'Empresa no disponible',

        // Dashboard de candidato
        'candidate_dashboard_title': 'Mis Ofertas',
        'candidate_dashboard_subtitle': 'Gestiona tus solicitudes y perfil',
        'your_applications': 'Tus Solicitudes',
        'jobs_applied_to': 'Empleos a los que has aplicado',
        'closed_in': 'Cierra en',
        'closed': 'Cerrado',
        'days_remaining': '{days} día',
        'days_remaining_plural': '{days} días',
        'company_info': 'Info de Empresa',
        'company_information': 'Información de la Empresa',
        'company_details': 'Detalles sobre la empresa que ofrece este puesto',
        'about_company': 'Acerca de la empresa',
        'contact_information': 'Información de Contacto',
        'visit_website': 'Visitar Sitio Web',
        'no_applications_yet': 'Aún No Hay Solicitudes',
        'no_applications_message': 'Todavía no has aplicado a ninguna oferta de empleo. Explora los empleos disponibles para comenzar.',
        'browse_available_jobs': 'Explorar Empleos Disponibles',
        'applications': 'Solicitudes',
        'track_applications': 'Seguimiento de tus solicitudes',
        'active_applications': 'Solicitud activa',
        'active_applications_plural': 'Solicitudes activas',
        'find_jobs': 'Buscar Empleo',
        'profile': 'Perfil',
        'your_information': 'Completa el perfil con tus datos',
        'complete_profile': 'Completar perfil',
        'edit_profile': 'Editar Perfil',
        
        // Tarjetas de empresa
        'job_listings': 'Ofertas de Empleo',
        'manage_jobs': 'Gestiona tus ofertas activas',
        'active_positions': 'Posiciones activas',
        'new_job': 'Nueva Oferta',
        'applicants': 'Candidatos',
        'applications_to_jobs': 'Solicitudes a tus empleos',
        'total_candidates': 'Total de candidatos',
        'company_profile': 'Perfil de Empresa',
        'update_profile': 'Actualiza la información de tu empresa'
    }
};

export function useTranslation() {
    const { locale } = usePage<SharedData>().props;
    const currentLocale = locale?.current || 'es'; // Default a español
    
    // Función para traducir un texto
    const t = (key: string, params?: Record<string, any>): string => {
        let text = translations[currentLocale]?.[key] || key;
        
        // Si hay parámetros, reemplazarlos en el texto
        if (params) {
            Object.entries(params).forEach(([paramKey, value]) => {
                text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(value));
            });
        }
        
        return text;
    };
    
    return { t, currentLocale };
}