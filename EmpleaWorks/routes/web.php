<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\DashboardController;

// Home y Dashboard (mostrar ofertas)
Route::get('/', [DashboardController::class, 'index'])->name('home');
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/offers/{offer}', [DashboardController::class, 'showOffer'])->name('offers.show');

// Fallback routes in case auth.php routes aren't working properly
Route::get('/login-direct', [AuthenticatedSessionController::class, 'create'])
    ->name('login.direct');

Route::get('/register-direct', [RegisteredUserController::class, 'create'])
    ->name('register.direct');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

// Offer routes
// Test de API para obtener ofertas (solo datos)
Route::get('/offers', [OfferController::class, 'list'])->name('offers.list');
