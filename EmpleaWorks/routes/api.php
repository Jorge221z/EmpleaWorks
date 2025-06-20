<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\GoogleController;
use App\Http\Controllers\Api\Auth\EmailVerificationController;

use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PasswordController;
use App\Http\Controllers\Api\SavedOfferController;


// Rate Limiting para API
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

// Rutas protegidas por el middleware de throttle
Route::middleware(['throttle:api'])->group(function () {

    // Rutas públicas
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/offers', [OfferController::class, 'list']);
    Route::get('/offers/{offer}', [OfferController::class, 'getOffer']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/offers/{offer}', [DashboardController::class, 'showOffer']);

    /* Rutas para autenticacion con google desde la API */
    Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle'])->name('google.redirect');
    Route::post('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('google.callback');

    // Rutas protegidas con auth:sanctum
    Route::middleware('auth:sanctum')->group(function () {

        // Información del usuario autenticado
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        // Verificación de email para API
        Route::get('/email/verification-status', [EmailVerificationController::class, 'status']);
        Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend']);
        Route::get('/email/verification-notice', [EmailVerificationController::class, 'show']);

        // Perfil
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::post('/profile', [ProfileController::class, 'update']);
        Route::delete('/profile', [ProfileController::class, 'destroy']);

        // Contraseña
        Route::get('/password', [PasswordController::class, 'show']);
        Route::post('/password', [PasswordController::class, 'update']);

        // Candidato
        Route::get('/candidate/dashboard', [CandidateController::class, 'dashboard']);
        Route::get('/candidate/offer/{offer}', [CandidateController::class, 'showOffer']);

        // Ofertas
        Route::post('/offers', [OfferController::class, 'store']);
        Route::post('/offers/{offer}/apply', [OfferController::class, 'apply']);
        Route::put('/offers/{offer}', [OfferController::class, 'update']);
        Route::delete('/offers/{offer}', [OfferController::class, 'destroy']);

        // Ofertas guardadas
        Route::post('/saved-offers/{offer}', [SavedOfferController::class, 'toggle']);
        Route::get('/saved-offers', [SavedOfferController::class, 'getSavedOffers']);
    });
});
