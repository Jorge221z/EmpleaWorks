<?php

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\AppearanceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * Rutas para la gestión de configuraciones personales del usuario
 * 
 * Este archivo agrupa todas las rutas relacionadas con la configuración
 * de la cuenta de usuario, incluyendo edición de perfil, cambio de contraseña
 * y preferencias de apariencia. Todas estas rutas requieren autenticación
 * y verificación de email.
 */
Route::middleware(['auth', 'verified'])->group(function () {
    /**
     * Rutas para gestión del perfil de usuario
     * Permiten visualizar, actualizar y eliminar información personal
     */
    Route::get('/settings/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    // Se utiliza POST en lugar de PATCH para mejorar la compatibilidad con la carga de archivos
    Route::post('/settings/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/settings/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    /**
     * Rutas para gestión de contraseña
     * Permiten al usuario cambiar su contraseña de manera segura
     */
    Route::get('/settings/password', [PasswordController::class, 'edit'])
        ->name('password.edit');

    Route::put('/settings/password', [PasswordController::class, 'update'])
        ->name('password.update');

    /**
     * Rutas para preferencias de apariencia
     * Permite al usuario personalizar el tema de la aplicación
     */
    Route::get('/settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});
