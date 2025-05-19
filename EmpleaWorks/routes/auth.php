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

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    Route::get('/offers/{offer}', [DashboardController::class, 'showOffer'])->name('offer.show');

    // Ruta para aplicar a una oferta
    // Route::post('/offers/{offer}/apply', [OfferController::class, 'apply'])->name('offers.apply');

    // Rutas para EMPRESAS - protegida por el middleware de rol de empresa
    Route::get('/company/dashboard', [CompanyController::class, 'dashboard'])
        ->middleware('company.role')
        ->name('company.dashboard');
    // Ruta para el formulario de creación de ofertas
    Route::get('/company/create-job', [CompanyController::class, 'createJobForm'])
        ->middleware(['company.role', 'verified'])
        ->name('company.create-job');
    // Ruta para crear una nueva oferta
    Route::post('/offers', [OfferController::class, 'store'])
        ->middleware(['company.role', 'verified'])
        ->name('offers.store');
    // Ruta para mostrar el formulario de edición de una oferta
    Route::get('/company/edit-job/{offer}', [CompanyController::class, 'editJobForm'])
        ->middleware('company.role')
        ->name('company.edit-job');
    // Ruta para editar una oferta
    Route::put('/offers/{offer}', [OfferController::class, 'update'])
        ->middleware(['company.role', 'verified'])
        ->name('offers.update');
    // Ruta para eliminar una oferta
    Route::delete('/offers/{offer}', [OfferController::class, 'destroy'])
        ->middleware(['company.role', 'verified'])
        ->name('offers.destroy');
    // Ruta para ver los candidatos que han aplicado a las ofertas de una empresa
    Route::get('/company/applicants', [CompanyController::class, 'applicants'])
        ->middleware(['company.role'])
        ->name('company.applicants');
    
        
    // Rutas para CANDIDATOS - protegida por el middleware de rol de candidato
    Route::get('/candidate/dashboard', [CandidateController::class, 'dashboard'])
        ->middleware('candidate.role')
        ->name('candidate.dashboard');
    // Ruta para la vista de ofertas aplicadas
    Route::get('/candidate/applications', [CandidateController::class, 'applications'])
        ->middleware('candidate.role')
        ->name('candidate.applications');
    // Ruta para la vista de ofertas guardadas
    Route::get('/candidate/saved-offers', [CandidateController::class, 'savedOffers'])
        ->middleware('candidate.role')
        ->name('candidate.saved-offers');
    // Ruta para mostrar el formulario de aplicación a una oferta
    Route::get('/apply-form/{offer}', [CandidateController::class, 'showForm'])
        ->middleware(['candidate.role', 'verified'])
        ->name('apply.form');
    // Ruta para aplicar a una oferta
    Route::post('/apply', [OfferController::class, 'apply'])
        ->middleware('candidate.role')
        ->name('apply');
    // Ruta para guardar una oferta
    Route::post('/offers/{offer}/save', [SavedOfferController::class, 'toggle'])
    ->middleware(['candidate.role', 'verified'])
    ->name('offer.save.toggle');
    Route::get('/saved-offers', [SavedOfferController::class, 'getSavedOffers'])
        ->middleware(['candidate.role'])
        ->name('saved.offers');
    Route::get('/candidate/applications/check/{offer}', [CandidateController::class, 'checkApplication'])
        ->middleware(['candidate.role'])
        ->name('candidate.applications.check');
});
