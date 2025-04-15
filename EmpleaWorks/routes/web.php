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

// Fallback routes in case auth.php routes aren't working properly
Route::get('/login-direct', [AuthenticatedSessionController::class, 'create'])
    ->name('login.direct');

Route::get('/register-direct', [RegisteredUserController::class, 'create'])
    ->name('register.direct');

// Application form route 
Route::get('/apply-form/{offer}', [DashboardController::class, 'showForm'])->name('apply.form');

// Submit application route
Route::post('/apply', [OfferController::class, 'apply'])->name('apply');



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

//mostramos cada oferta en concreto para ver sus detalles y poder aplicar //
Route::get('/offers/{offer}', [DashboardController::class, 'showOffer'])->name('offer.show');


// Test de API para obtener ofertas (solo datos)
Route::get('/offers', [OfferController::class, 'list'])->name('offers.list');

