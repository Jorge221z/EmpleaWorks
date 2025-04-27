<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class LocaleController extends Controller
{
    public function changeLocale($locale)
    {
        $availableLocales = config('app.available_locales', ['es' => 'Español']);
        
        // Verificar si el idioma solicitado está disponible
        if (array_key_exists($locale, $availableLocales)) {
            Session::put('locale', $locale);
            App::setLocale($locale);
            
            // Log para depuración
            \Log::info("Cambiando idioma a: {$locale}");
        } else {
            \Log::warning("Intento de cambiar a un idioma no disponible: {$locale}");
        }
        
        // Redirigir con un parámetro para forzar la recarga
        return redirect()->back()->with('locale_changed', true);
    }
}
