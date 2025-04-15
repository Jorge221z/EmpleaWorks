<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EnsureCompanyRole
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // Check if the user has the company role
        if (Auth::user()->isCompany()) {
            return $next($request);
        }

        // For authenticated users with wrong role (candidates), redirect to dashboard
        // Add a flash message to inform the user why they were redirected
        return redirect()->route('dashboard')->with('message', 'This section is only available for companies');
    }
}
