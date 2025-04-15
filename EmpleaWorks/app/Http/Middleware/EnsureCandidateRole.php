<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EnsureCandidateRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // Check if the user has the candidate role
        // Use the isCandidate() method from your User model for consistency
        if (Auth::user()->isCandidate()) {
            return $next($request);
        }

        // For authenticated users with wrong role, redirect to dashboard
        // Add a flash message to inform the user why they were redirected
        return redirect()->route('dashboard')->with('message', 'This section is only available for candidates');
    }
}
