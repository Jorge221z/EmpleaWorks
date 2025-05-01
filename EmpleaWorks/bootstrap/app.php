<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetLocale;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use App\Http\Middleware\EnsureCompanyRole;
use App\Http\Middleware\EnsureCandidateRole;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            SetLocale::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Añadir alias para los middlewares
        $middleware->alias([
            'company.role' => EnsureCompanyRole::class,
            'candidate.role' => EnsureCandidateRole::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Configuración de página 404 personalizada
        $exceptions->renderable(function (NotFoundHttpException $e) {
            return Inertia::render('Error404');
        });
    })->create();
