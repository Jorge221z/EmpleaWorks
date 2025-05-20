<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

/**
 * Middleware para gestionar las peticiones de Inertia.js
 * 
 * Administra la comunicación entre el backend y el frontend,
 * compartiendo datos comunes y configuración necesaria para
 * el funcionamiento de la aplicación SPA.
 */
class HandleInertiaRequests extends Middleware
{
    /**
     * Plantilla raíz que se carga en la primera visita a la página.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determina la versión actual de los activos.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define las propiedades compartidas por defecto con todos los componentes.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user() ? $request->user()->load('role', 'candidate', 'company') : null,
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'message' => $request->session()->get('message'),
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'currentRoute' => $request->route() ? $request->route()->getName() : null,
            
            // Configuración de internacionalización
            'locale' => [
                'current' => app()->getLocale(),
                'available' => config('app.available_locales', ['es' => 'Español']),
            ],
        ];
    }

    /**
     * Resuelve componentes específicos de Inertia y registra información de depuración.
     * 
     * @param Request $request Solicitud HTTP
     * @param string $component Nombre del componente
     * @return array Datos del componente
     */
    public function resolveComponent($request, $component)
    {
        \Log::info("Resolving Inertia component: {$component}");
        
        return parent::resolveComponent($request, $component);
    }
}
