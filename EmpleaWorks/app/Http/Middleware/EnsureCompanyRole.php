<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Middleware que verifica que el usuario tenga el rol de empresa.
 * 
 * Este middleware garantiza que solo los usuarios con rol de empresa
 * puedan acceder a las rutas protegidas específicas para empresas.
 */
class EnsureCompanyRole
{
    /**
     * Procesa la solicitud entrante y verifica el rol del usuario.
     *
     * @param  \Illuminate\Http\Request  $request  Solicitud HTTP entrante
     * @param  \Closure  $next  Callback para pasar la solicitud al siguiente middleware
     * @return \Symfony\Component\HttpFoundation\Response  Respuesta HTTP
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verifica si el usuario está autenticado
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // Verifica si el usuario tiene el rol de empresa
        if (Auth::user()->isCompany()) {
            return $next($request);
        }

        // Para usuarios autenticados con rol incorrecto, redirecciona al dashboard
        return redirect()->route('dashboard')->with('error', 'This section is only available for companies');
    }
}
