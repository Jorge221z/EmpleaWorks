"use client";

import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { useTranslation } from "@/utils/i18n";
import { useEffect } from "react";

export function NotFoundPage() {
  const { t } = useTranslation();
  
  // Fuerza tema claro para la página 404
  useEffect(() => {
    // Guardar configuración del tema original
    const originalTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const originalThemeInStorage = localStorage.getItem('appearance') || 'system';
    
    // Guardar tema original en localStorage para su posterior restauración
    localStorage.setItem('original-theme', originalTheme);
    localStorage.setItem('original-appearance', originalThemeInStorage);
    
    // Aplicar tema claro
    document.documentElement.classList.remove('dark');
    localStorage.setItem('appearance', 'light');
    
    // Función para restaurar el tema original
    const restoreTheme = () => {
      const savedTheme = localStorage.getItem('original-theme');
      const savedAppearance = localStorage.getItem('original-appearance');
      
      // Restaurar modo oscuro si estaba activo previamente
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Restaurar configuración original de apariencia
      if (savedAppearance) {
        localStorage.setItem('appearance', savedAppearance);
      }
      
      // Manejar preferencia del sistema
      if (savedAppearance === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        prefersDark
          ? document.documentElement.classList.add('dark')
          : document.documentElement.classList.remove('dark');
      }
    };
    
    // Manejar botón 'atrás' del navegador
    const handlePopState = () => restoreTheme();
    
    sessionStorage.setItem('was_on_404_page', 'true');
    
    // Navegación de Inertia para restaurar tema
    const originalVisit = router.visit;
    router.visit = function(...args) {
      restoreTheme();
      return originalVisit.apply(this, args);
    };
    
    // Registrar listener para popstate
    window.addEventListener('popstate', handlePopState);
    
    // Función de limpieza
    return () => {
      window.removeEventListener('popstate', handlePopState);
      router.visit = originalVisit;
      restoreTheme();
    };
  }, []);
  
  // Manejar click en botón de navegación al dashboard
  const handleBackClick = () => {
    const originalTheme = localStorage.getItem('original-theme');
    const originalAppearance = localStorage.getItem('original-appearance');
    
    if (originalTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    
    if (originalAppearance) {
      localStorage.setItem('appearance', originalAppearance);
    }
  };
  
  // Manejador global de navegación 'hacia atrás'
  useEffect(() => {
    if (!window._404BackHandler) {
      window._404BackHandler = true;
      
      // Verificar si se navega de regreso desde página 404
      const checkBackNavigation = () => {
        if (sessionStorage.getItem('was_on_404_page') === 'true') {
          sessionStorage.removeItem('was_on_404_page');
          
          // Restaurar configuración del tema
          const savedTheme = localStorage.getItem('original-theme');
          const savedAppearance = localStorage.getItem('original-appearance');
          
          if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
          }
          
          if (savedAppearance) {
            localStorage.setItem('appearance', savedAppearance);
          }
        }
      };
      
      // Ejecutar después del ciclo de eventos actual
      setTimeout(checkBackNavigation, 0);
    }
  }, []);
  
  return (
    <section className="bg-white text-gray-900 font-sans min-h-screen flex items-center justify-center">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div
              className="bg-[url(/storage/images/404_not_found.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-gray-900 text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8">
                404
              </h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="text-2xl text-gray-900 sm:text-3xl font-bold mb-4">
                {t('page_not_found_title')}
              </h3>
              <p className="mb-6 text-gray-600 sm:mb-5">
                {t('page_not_found_message')}
              </p>

              <Button
                variant="default"
                className="my-5"
                asChild
                onClick={handleBackClick}
              >
                <Link href="/dashboard" preserveState={false}>
                  {t('back_to_dashboard')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Declaración TypeScript para global de window
declare global {
  interface Window {
    _404BackHandler?: boolean;
  }
}
