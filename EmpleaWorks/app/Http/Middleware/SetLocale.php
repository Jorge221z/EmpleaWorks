<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

/**
 * Middleware para establecer el idioma de la aplicación.
 * 
 * Gestiona la configuración del idioma de la aplicación basándose en
 * la preferencia almacenada en la sesión del usuario o en el valor
 * predeterminado de la configuración.
 */
class SetLocale
{
    /**
     * Procesa la solicitud y establece el idioma apropiado.
     *
     * @param  \Illuminate\Http\Request  $request  Solicitud HTTP entrante
     * @param  \Closure  $next  Callback para continuar con la cadena de middleware
     * @return mixed  Respuesta HTTP procesada
     */
    public function handle(Request $request, Closure $next)
    {
        // Recuperar el idioma de la sesión
        if (Session::has('locale')) {
            $locale = Session::get('locale');
        } else {
            $locale = config('app.locale', 'es');
            Session::put('locale', $locale);
        }
        
        // Validar que el idioma esté entre los disponibles antes de establecerlo
        $availableLocales = array_keys(config('app.available_locales', ['es' => 'Español']));
        if (in_array($locale, $availableLocales)) {
            App::setLocale($locale);
        }
        
        return $next($request);
    }
}
