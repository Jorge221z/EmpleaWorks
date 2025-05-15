<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Candidate;
use App\Models\Company;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Inertia\Inertia;

class GoogleController extends Controller
{
    /**
     * Redirige al usuario al proceso de autenticación de Google.
     *
     * @return \Illuminate\Http\RedirectResponse|\Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }
    
    /**
     * Obtiene la información del usuario de Google después de la autorización.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function handleGoogleCallback()
    {
        try {
            // Guardar datos del usuario de Google en la sesión para su uso posterior
            $googleUser = Socialite::driver('google')->user();
            session([
                'google_user' => [
                    'id' => $googleUser->id,
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'avatar' => $googleUser->avatar
                ]
            ]);
            
            // Comprobar si el usuario ya existe
            $user = User::where('email', $googleUser->email)->first();
            
            if ($user) {
                // Si el usuario ya existe, actualizar el google_id si es necesario
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->id]);
                }
                
                // Iniciar sesión
                Auth::login($user);
                
                return redirect()->intended('/dashboard');
            } else {
                // Si es un usuario nuevo, redirigir a la página de selección de rol
                return redirect()->route('google.select.role');
            }
        } catch (\Exception $e) {
            Log::error('Error en autenticación Google: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return redirect()->route('login')->with('error', 'Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.');
        }
    }

    /**
     * Muestra la página de selección de rol.
     *
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function showRoleSelectionForm()
    {
        // Verificar que existan datos de Google en la sesión
        if (!session('google_user')) {
            return redirect()->route('login');
        }
        
        return Inertia::render('auth/GoogleRoleSelection');
    }

    /**
     * Procesa la selección de rol y completa el registro.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function processRoleSelection(Request $request)
    {
        $request->validate([
            'role_id' => 'required|in:1,2', // 1=candidate, 2=company
        ]);
        
        // Verificar que existan datos de Google en la sesión
        if (!session('google_user')) {
            return redirect()->route('login');
        }
        
        $googleUser = session('google_user');
        
        try {
            // Crear el usuario con el rol seleccionado
            $user = User::create([
                'name' => $googleUser['name'],
                'email' => $googleUser['email'],
                'password' => Hash::make(Str::random(24)),
                'email_verified_at' => now(),
                'role_id' => $request->role_id,
                'google_id' => $googleUser['id'],
            ]);
            
            // Crear el perfil correspondiente según el rol
            if ($request->role_id == 1) {
                // Candidato
                Candidate::create([
                    'user_id' => $user->id,
                    'surname' => '',
                    'cv' => null
                ]);
                
                Log::info("Perfil de candidato creado para usuario de Google con ID: {$user->id}");
            } else {
                // Empresa
                Company::create([
                    'user_id' => $user->id,
                    'address' => '',
                    'website' => ''
                ]);
                
                Log::info("Perfil de empresa creado para usuario de Google con ID: {$user->id}");
            }
            
            event(new Registered($user));
            
            // Limpiar datos de sesión
            session()->forget('google_user');
            
            // Iniciar sesión
            Auth::login($user);
            
            return redirect()->intended('/dashboard');
            
        } catch (\Exception $e) {
            Log::error('Error en registro con Google: ' . $e->getMessage());
            return redirect()->route('login')->with('error', 'Error al completar el registro. Por favor, inténtalo de nuevo.');
        }
    }
}