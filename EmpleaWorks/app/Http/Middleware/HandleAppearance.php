<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware para gestionar las preferencias de apariencia de la aplicación.
 * 
 * Se encarga de detectar y aplicar el modo de visualización (claro/oscuro/sistema)
 * según las preferencias guardadas del usuario.
 */
class HandleAppearance
{
    /**
     * Procesa la solicitud y comparte la preferencia de apariencia con todas las vistas.
     * 
     * Extrae el valor de apariencia de las cookies del usuario y lo comparte
     * con todas las vistas de la aplicación mediante View::share.
     *
     * @param  \Illuminate\Http\Request  $request  Solicitud HTTP entrante
     * @param  \Closure  $next  Callback para continuar con la cadena de middleware
     * @return \Symfony\Component\HttpFoundation\Response  Respuesta HTTP procesada
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Obtiene la preferencia de apariencia desde la cookie o usa 'system' como valor predeterminado
        View::share('appearance', $request->cookie('appearance') ?? 'system');

        return $next($request);
    }
}
