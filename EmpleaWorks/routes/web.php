<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\Auth\GoogleController;

/**
 * Archivo principal de rutas web de la aplicación
 * 
 * Este archivo define las rutas públicas principales y puntos de entrada
 * de la aplicación. Incluye rutas para páginas generales, acceso al dashboard,
 * autenticación con Google y otras funcionalidades públicas.
 */

/**
 * Rutas principales de acceso a la aplicación
 */
Route::get('/', [DashboardController::class, 'index'])->name('home');
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

/**
 * Rutas de respaldo para autenticación
 * Proporcionan acceso directo a las vistas de login/registro en caso
 * de problemas con las rutas definidas en auth.php
 */
Route::get('/login-direct', [AuthenticatedSessionController::class, 'create'])
    ->name('login.direct');

Route::get('/register-direct', [RegisteredUserController::class, 'create'])
    ->name('register.direct');

/**
 * Ruta para cambio de idioma de la aplicación
 * Permite a los usuarios cambiar entre los idiomas disponibles
 */
Route::get('/locale/{locale}', [LocaleController::class, 'changeLocale'])
    ->name('locale.change');

/**
 * Rutas de páginas estáticas informativas
 * Proporcionan información legal y de contacto
 */
// Ruta terminos y condiciones
Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

// Ruta contacto
Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

// Ruta descarga de app móvil
Route::get('/download-app', function () {
    return Inertia::render('MobileDownload');
})->name('download.app');

/**
 * Ruta para procesamiento del formulario de contacto
 * Permite a los usuarios enviar mensajes a través del formulario de contacto
 */
Route::post('/contact', [App\Http\Controllers\ContactController::class, 'submit'])
    ->name('contact.submit');

/**
 * Rutas para autenticación mediante Google OAuth
 * Implementa el flujo completo de OAuth2 para registro/login con Google
 * y selección de rol tras la autenticación
 */
Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])->name('google.redirect');
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('google.callback');
Route::get('auth/google/select-role', [GoogleController::class, 'showRoleSelectionForm'])->name('google.select.role');
Route::post('auth/google/process-role', [GoogleController::class, 'processRoleSelection'])->name('google.process.role');

/**
 * Inclusión de rutas adicionales desde archivos externos
 * Organiza las rutas en archivos separados según su propósito
 */
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

/**
 * Ruta segura para descarga de CV
 * Utiliza firma temporal para proteger el acceso a documentos privados
 */
Route::get('/cv/download/{candidate}', [\App\Http\Controllers\CvController::class, 'download'])
    ->name('cv.download')
    ->middleware('signed');