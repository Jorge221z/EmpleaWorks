<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/', function () {
    return Inertia::render('dashboard');
})->name('home');

// Main dashboard route
Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->name('dashboard');

// Fallback routes in case auth.php routes aren't working properly
Route::get('/login-direct', [AuthenticatedSessionController::class, 'create'])
    ->name('login.direct');

Route::get('/register-direct', [RegisteredUserController::class, 'create'])
    ->name('register.direct');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
