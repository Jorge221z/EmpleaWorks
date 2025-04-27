<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (Session::has('locale')) {
            $locale = Session::get('locale');
        } else {
            // Usar el idioma predeterminado de la configuración
            $locale = config('app.locale', 'es');
            Session::put('locale', $locale);
        }
        
        // Asegurarnos de que el idioma es válido
        $availableLocales = array_keys(config('app.available_locales', ['es' => 'Español']));
        if (in_array($locale, $availableLocales)) {
            App::setLocale($locale);
        }
        
        return $next($request);
    }
}
