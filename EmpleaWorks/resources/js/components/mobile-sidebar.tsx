"use client"

import React, { useEffect } from "react"
import { X } from "lucide-react"
import AppLogo from "./app-logo"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"

// Hook simple para navegación directa
export function useMobileSidebarNavigate() {
  return (url: string) => {
    // Navegar directamente - Inertia se encargará de cerrar el sidebar
    router.visit(url);
    return true;
  };
}

// Hook simple para cerrar (compatibilidad con componentes existentes)
export function useMobileSidebarClose() {
  return () => {
    // Esta función ahora está vacía porque la navegación la manejamos directamente
    return true;
  };
}

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileSidebar({ open, onClose, children }: MobileSidebarProps) {
  // Prevenir scroll en body cuando el sidebar está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  
  // Navegación directa sin cerrar primero
  const navigateTo = (url: string) => {
    router.visit(url);
  };
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex" onClick={onClose}>
      {/* El contenedor del sidebar - detenemos la propagación de clics */}
      <div 
        className="fixed inset-y-0 left-0 w-[85%] max-w-[300px] bg-white dark:bg-[#2d1f3e] shadow-xl flex flex-col overflow-hidden"
        style={{ 
          animation: "0.3s ease-out slideInFromLeft",
          borderRight: "1px solid rgba(150, 69, 244, 0.2)" 
        }}
        onClick={(e) => e.stopPropagation()} // Detener propagación de clics
      >
        <div className="flex items-center justify-between p-4 border-b border-purple-100/50 dark:border-purple-800/30">
          <button
            className="flex items-center gap-2"
            onClick={() => navigateTo('/dashboard')}
          >
            <AppLogo className="h-8 w-6" />
            <span className="text-xl font-bold tracking-tight text-[#7c28eb] dark:text-purple-300">
              EmpleaWorks
            </span>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-gray-600 dark:text-gray-300"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
      
      {/* Área para cerrar el sidebar al hacer clic fuera */}
      <div 
        className="fixed inset-0 bg-black/30"
        style={{animation: "0.2s ease-in fadeIn"}}
        aria-hidden="true"
      />
      
      <style>{`
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Para compatibilidad con código existente
export const MobileSidebarContext = React.createContext({
  closeAndNavigate: (url?: string) => {}
});
