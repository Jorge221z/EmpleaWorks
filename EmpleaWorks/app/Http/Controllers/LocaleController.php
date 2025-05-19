<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class LocaleController extends Controller
{
    /**
     * Cambia el idioma de la aplicación si está disponible
     *
     * @param string $locale Código del idioma a establecer
     * @return \Illuminate\Http\RedirectResponse Redirección a la página anterior
     */
    public function changeLocale($locale)
    {
        // Obtiene los idiomas configurados en la aplicación
        $availableLocales = config('app.available_locales', ['es' => 'Español']);

        // Verifica si el idioma solicitado está disponible
        if (array_key_exists($locale, $availableLocales)) {
            // Establece el nuevo idioma en la sesión y la aplicación
            Session::put('locale', $locale);
            App::setLocale($locale);

            // Registra el cambio de idioma para seguimiento
            \Log::info("Cambiando idioma a: {$locale}");
        } else {
            // Registra el intento fallido de cambio de idioma
            \Log::warning("Intento de cambiar a un idioma no disponible: {$locale}");
        }

        // Redirecciona a la página anterior indicando el cambio de idioma
        return redirect()->back()->with('locale_changed', true);
    }
}
