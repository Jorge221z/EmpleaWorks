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

/**
 * Controlador para gestionar la autenticación a través de Google OAuth 2.0.
 */
class GoogleController extends Controller
{
    /**
     * Inicia el proceso de autenticación OAuth 2.0 con Google.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }
    
    /**
     * Procesa la respuesta de autenticación de Google.
     * Autentica usuarios existentes o inicia el proceso de registro.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function handleGoogleCallback()
    {
        try {
            // Obtener información del perfil del usuario de Google
            $googleUser = Socialite::driver('google')->user();
            session([
                'google_user' => [
                    'id' => $googleUser->id,
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'avatar' => $googleUser->avatar
                ]
            ]);
            
            // Verificar si el usuario ya existe
            $user = User::where('email', $googleUser->email)->first();
            
            if ($user) {
                // Actualizar el ID de Google si es necesario
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->id]);
                }
                
                Auth::login($user);
                return redirect()->intended('/dashboard');
            } else {
                return redirect()->route('google.select.role');
            }
        } catch (\Exception $e) {
            Log::error('Error en autenticación Google: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return redirect()->route('login')->with('error', 'Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.');
        }
    }

    /**
     * Muestra el formulario para seleccionar rol (candidato o empresa).
     *
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function showRoleSelectionForm()
    {
        if (!session('google_user')) {
            return redirect()->route('login');
        }
        
        return Inertia::render('auth/GoogleRoleSelection');
    }

    /**
     * Procesa la selección de rol y completa el registro del usuario.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function processRoleSelection(Request $request)
    {
        $request->validate([
            'role_id' => 'required|in:1,2',
        ]);
        
        if (!session('google_user')) {
            return redirect()->route('login');
        }
        
        $googleUser = session('google_user');
        
        try {
            $user = User::create([
                'name' => $googleUser['name'],
                'email' => $googleUser['email'],
                'password' => Hash::make(Str::random(24)),
                'email_verified_at' => now(),
                'role_id' => $request->role_id,
                'google_id' => $googleUser['id'],
            ]);
            
            if ($request->role_id == 1) {
                Candidate::create([
                    'user_id' => $user->id,
                    'surname' => '',
                    'cv' => null
                ]);
                Log::info("Perfil candidato creado: {$user->id}");
            } else {
                Company::create([
                    'user_id' => $user->id,
                    'address' => '',
                    'website' => ''
                ]);
                Log::info("Perfil empresa creado: {$user->id}");
            }
            
            event(new Registered($user));
            session()->forget('google_user');
            Auth::login($user);
            
            return redirect()->intended('/dashboard');
            
        } catch (\Exception $e) {
            Log::error('Error en registro Google: ' . $e->getMessage());
            return redirect()->route('login')->with('error', 'Error al completar el registro. Por favor, inténtalo de nuevo.');
        }
    }
}