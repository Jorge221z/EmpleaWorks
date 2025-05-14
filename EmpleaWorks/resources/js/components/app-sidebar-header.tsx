import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="bg-[#FEFBF2] dark:bg-transparent border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                {/* SidebarTrigger oculto en móvil, visible en escritorio */}
                <SidebarTrigger className="-ml-1 hidden md:flex" />
                {/* Agregamos margen a la izquierda (ml-12) solo en móvil y lo quitamos (ml-0) en tabletas/desktop */}
                <div className="ml-12 md:ml-0">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
        </header>
    );
}
