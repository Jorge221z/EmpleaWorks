<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Candidate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;

class GoogleController extends Controller
{
    /**
     * Inicia el proceso de autenticación OAuth 2.0 con Google.
     * Devuelve la URL de redirección para la app móvil.
     */
    public function redirectToGoogle()
    {
        try {
            $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
            return response()->json(['url' => $url], 200);
        } catch (\Exception $e) {
            Log::error('Error en redirectToGoogle: ' . $e->getMessage());
            return response()->json(['error' => 'Error al iniciar la autenticación con Google.'], 500);
        }
    }

    /**
     * Procesa la respuesta de autenticación de Google.
     * Autentica usuarios existentes o registra nuevos usuarios como candidatos.
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->userFromToken($request->input('token'));

            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->id]);
                }
                $token = $user->createToken('mobile-app')->plainTextToken;
                return response()->json(['token' => $token, 'user' => $user], 200);
            } else {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'password' => Hash::make(Str::random(24)),
                    'email_verified_at' => now(),
                    'role_id' => 1, // Siempre candidato
                    'google_id' => $googleUser->id,
                ]);

                Candidate::create([
                    'user_id' => $user->id,
                    'surname' => '',
                    'cv' => null
                ]);

                $token = $user->createToken('mobile-app')->plainTextToken;
                return response()->json(['token' => $token, 'user' => $user], 201);
            }
        } catch (\Exception $e) {
            Log::error('Error en handleGoogleCallback: ' . $e->getMessage());
            return response()->json(['error' => 'Error al procesar la autenticación con Google.'], 500);
        }
    }
}