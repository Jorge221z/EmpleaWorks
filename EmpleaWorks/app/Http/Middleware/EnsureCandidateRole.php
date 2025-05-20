<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Middleware que verifica que el usuario tenga el rol de candidato.
 * 
 * Este middleware garantiza que solo los usuarios con rol de candidato
 * puedan acceder a las rutas protegidas específicas para candidatos.
 */
class EnsureCandidateRole
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

        // Verifica si el usuario tiene el rol de candidato
        // Utiliza el método isCandidate() del modelo User para mantener consistencia
        if (Auth::user()->isCandidate()) {
            return $next($request);
        }

        // Para usuarios autenticados con rol incorrecto, redirecciona al dashboard
        // Agrega un mensaje flash para informar al usuario del motivo de la redirección
        return redirect()->route('dashboard')->with('error', 'This section is only available for candidates');
    }
}
