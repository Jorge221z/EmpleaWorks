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
        // Check if the user is authenticated AND if they have a role property AND if that role's name is 'company'
        if (Auth::check() && Auth::user()->role && Auth::user()->role->name === 'company') {
            return $next($request);
        }

        // If not logged in, redirect to login page
        // if (!Auth::check()) {
        //     return redirect()->route('login');
        // }

        // Otherwise, show access denied with 403 status
        // return Inertia::render('dashboard', [
        //     'error' => 'Access denied: Company role required'
        // ])->toResponse($request)->setStatusCode(403);
        return $next($request);
    }
}
