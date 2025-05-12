<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocaleController;

// Home y Dashboard (mostrar ofertas)
Route::get('/', [DashboardController::class, 'index'])->name('home');
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Fallback routes in case auth.php routes aren't working properly
Route::get('/login-direct', [AuthenticatedSessionController::class, 'create'])
    ->name('login.direct');

Route::get('/register-direct', [RegisteredUserController::class, 'create'])
    ->name('register.direct');

// Ruta para el cambio de idioma
Route::get('/locale/{locale}', [LocaleController::class, 'changeLocale'])
    ->name('locale.change');

// Ruta terminos y condiciones
Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

// Ruta contacto
Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

// Ruta para descargar CV de candidato (protegida con firma temporal)
Route::get('/cv/download/{candidate}', [\App\Http\Controllers\CvController::class, 'download'])
    ->name('cv.download')
    ->middleware('signed');