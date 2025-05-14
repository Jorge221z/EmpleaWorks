"use client"

import React from "react"
import { X } from "lucide-react"
import AppLogo from "./app-logo"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"

interface MobileNavDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function MobileNavDialog({ open, onOpenChange, children }: MobileNavDialogProps) {
  const handleNavigate = (url: string) => {
    onOpenChange(false);
    setTimeout(() => router.visit(url), 50);
  };
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Overlay - cierra la sidebar al hacer clic */}
      <div 
        className="fixed inset-0 bg-black/50"
        style={{animation: "0.2s ease-in fadeIn"}}
        onClick={() => onOpenChange(false)}
      />
      
      {/* Panel lateral */}
      <div 
        className="fixed inset-y-0 left-0 w-[85%] max-w-[300px] bg-white dark:bg-[#2d1f3e] shadow-xl flex flex-col overflow-hidden z-[9999]"
        style={{animation: "0.3s ease-out slideInFromLeft"}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-purple-100/50 dark:border-purple-800/30">
          <button
            className="flex items-center gap-2"
            onClick={() => handleNavigate('/dashboard')}
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
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
      
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
