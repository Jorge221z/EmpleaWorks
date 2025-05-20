<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\SavedOfferController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CandidateController;
use Illuminate\Support\Facades\Route;

/**
 * Archivo de rutas de autenticación y rutas específicas por rol
 * 
 */

/**
 * Rutas accesibles solo para visitantes (no autenticados)
 * Incluye el flujo completo de registro, login y recuperación de contraseña
 */
Route::middleware('guest')->group(function () {
    // Rutas de registro de usuario
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    // Rutas de inicio de sesión
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    // Rutas de recuperación de contraseña
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

/**
 * Rutas protegidas que requieren autenticación
 * Incluye verificación de email, gestión de cuenta y funcionalidades específicas por rol
 */
Route::middleware('auth')->group(function () {
    /**
     * Rutas de verificación de email
     */
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');
    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    /**
     * Rutas de confirmación de contraseña y cierre de sesión
     */
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    /**
     * Rutas generales para usuarios autenticados
     */
    Route::get('/offers/{offer}', [DashboardController::class, 'showOffer'])->name('offer.show');

    /**
     * Rutas exclusivas para EMPRESAS
     * Protegidas por el middleware 'company.role' que verifica que el usuario tenga rol de empresa
     */
    // Panel de empresa y gestión de ofertas de trabajo
    Route::get('/company/dashboard', [CompanyController::class, 'dashboard'])
        ->middleware('company.role')
        ->name('company.dashboard');
    
    // Creación y gestión de ofertas
    Route::get('/company/create-job', [CompanyController::class, 'createJobForm'])
        ->middleware(['company.role', 'verified'])
        ->name('company.create-job');
    Route::post('/offers', [OfferController::class, 'store'])
        ->middleware(['company.role', 'verified'])
        ->name('offers.store');
    
    // Edición y eliminación de ofertas
    Route::get('/company/edit-job/{offer}', [CompanyController::class, 'editJobForm'])
        ->middleware('company.role')
        ->name('company.edit-job');
    Route::put('/offers/{offer}', [OfferController::class, 'update'])
        ->middleware(['company.role', 'verified'])
        ->name('offers.update');
    Route::delete('/offers/{offer}', [OfferController::class, 'destroy'])
        ->middleware(['company.role', 'verified'])
        ->name('offers.destroy');
    
    // Visualización de candidatos que han aplicado
    Route::get('/company/applicants', [CompanyController::class, 'applicants'])
        ->middleware(['company.role'])
        ->name('company.applicants');
    
    /**
     * Rutas exclusivas para CANDIDATOS
     * Protegidas por el middleware 'candidate.role' que verifica que el usuario tenga rol de candidato
     */
    // Panel de candidato y gestión de ofertas aplicadas
    Route::get('/candidate/dashboard', [CandidateController::class, 'dashboard'])
        ->middleware('candidate.role')
        ->name('candidate.dashboard');
    Route::get('/candidate/applications', [CandidateController::class, 'applications'])
        ->middleware('candidate.role')
        ->name('candidate.applications');
    
    // Gestión de ofertas guardadas
    Route::get('/candidate/saved-offers', [CandidateController::class, 'savedOffers'])
        ->middleware('candidate.role')
        ->name('candidate.saved-offers');
    Route::post('/offers/{offer}/save', [SavedOfferController::class, 'toggle'])
        ->middleware(['candidate.role', 'verified'])
        ->name('offer.save.toggle');
    Route::get('/saved-offers', [SavedOfferController::class, 'getSavedOffers'])
        ->middleware(['candidate.role'])
        ->name('saved.offers');
    
    // Aplicación a ofertas de trabajo
    Route::get('/apply-form/{offer}', [CandidateController::class, 'showForm'])
        ->middleware(['candidate.role', 'verified'])
        ->name('apply.form');
    Route::post('/apply', [OfferController::class, 'apply'])
        ->middleware('candidate.role')
        ->name('apply');
    Route::get('/candidate/applications/check/{offer}', [CandidateController::class, 'checkApplication'])
        ->middleware(['candidate.role'])
        ->name('candidate.applications.check');
});
