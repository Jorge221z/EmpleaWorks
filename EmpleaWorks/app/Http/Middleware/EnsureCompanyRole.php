<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EnsureCompanyRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && Auth::user()->role->name === 'company') {
            return $next($request);
        }

        return Inertia::render('dashboard', [
            'error' => 'Acceso denegado(company middleware)',
        ])->toResponse($request)->setStatusCode(403);
    }
}
