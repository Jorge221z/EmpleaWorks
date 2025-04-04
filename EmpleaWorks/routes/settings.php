<?php

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\AppearanceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    // Settings routes
    Route::get('/settings/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/settings/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/settings/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    // Password routes
    Route::get('/settings/password', [PasswordController::class, 'edit'])
        ->name('password.edit');

    Route::put('/settings/password', [PasswordController::class, 'update'])
        ->name('password.update');

    // Appearance routes
    Route::get('/settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});
