<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

// Página principal accesible para todos
Route::get('/', function () {
    $user = Auth::user();
    
    // Pasar información de autenticación al componente dashboard
    return Inertia::render('dashboard', [
        'isAuthenticated' => !!$user,
        'userRole' => $user ? ($user->role ? $user->role->name : null) : null
    ]);
})->name('home');

require __DIR__.'/auth.php';

// Rutas para usuarios autenticados (dashboard genérico)
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard principal que redirige según el rol
    Route::get('/dashboard', function () {
        $user = Auth::user();
        
        if (!$user->role) {
            // Si el usuario no tiene rol asignado
            return Inertia::render('dashboard', [
                'isAuthenticated' => true,
                'userRole' => null
            ]);
        }
        
        if ($user->role->name === 'candidate') {
            return redirect()->route('candidate.dashboard');
        } 
        
        if ($user->role->name === 'company') {
            return redirect()->route('company.dashboard');
        }
        
        return Inertia::render('dashboard', [
            'isAuthenticated' => true,
            'userRole' => 'unknown'
        ]);
    })->name('dashboard');
    
    // Configuraciones para todos los usuarios autenticados
    require __DIR__.'/settings.php';
});

// Rutas para candidatos - NOTA: cambié el path para evitar conflictos
Route::middleware(['auth', 'verified', 'candidate'])->group(function () {
    Route::get('/candidate/dashboard', function () {
        return Inertia::render('dashboard', [
            'isAuthenticated' => true,
            'userRole' => 'candidate'
        ]);
    })->name('candidate.dashboard');
    
    // Otras rutas específicas para candidatos
});

// Rutas para empresas - NOTA: cambié el path para evitar conflictos
Route::middleware(['auth', 'verified', 'company'])->group(function () {
    Route::get('/company/dashboard', function () {
        return Inertia::render('dashboard', [
            'isAuthenticated' => true,
            'userRole' => 'company'
        ]);
    })->name('company.dashboard');
    
    // Otras rutas específicas para empresas
});
