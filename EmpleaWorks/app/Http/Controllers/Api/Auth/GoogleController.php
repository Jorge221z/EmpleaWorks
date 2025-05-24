<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Candidate;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Google_Client;

class GoogleController extends Controller
{
    /**
     * Inicia el proceso de autenticación OAuth 2.0 con Google.
     * Devuelve la URL de redirección para la app móvil (opcional si usas el flujo cliente).
     */
    public function redirectToGoogle()
    {
        // Este método puede mantenerse si planeas usar un flujo web en el futuro
        return response()->json(['url' => 'No necesario con @react-native-google-signin'], 200);
    }

    /**
     * Procesa el idToken recibido desde la app móvil.
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            // Validar que se envió el id_token
            $idToken = $request->input('id_token');
            if (!$idToken) {
                return response()->json(['error' => 'id_token requerido'], 400);
            }

            // Verificar el idToken con Google
            $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID_MOBILE')]);
            $payload = $client->verifyIdToken($idToken);

            if (!$payload) {
                return response()->json(['error' => 'Token inválido'], 401);
            }

            // Obtener datos del usuario desde el payload
            $googleId = $payload['sub'];
            $email = $payload['email'];
            $name = $payload['name'];

            // Buscar o crear el usuario
            $user = User::where('email', $email)->first();

            if ($user) {
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleId]);
                }
            } else {
                // Obtener el ID del rol candidato basado en el nombre
                $candidateRole = Role::where('name', 'candidate')->first();
                $roleId = $candidateRole ? $candidateRole->id : null;
                
                if (!$roleId) {
                    Log::error('Role "candidate" not found in the database');
                    return response()->json(['error' => 'Error al configurar el rol del usuario'], 500);
                }
                
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => Hash::make(Str::random(24)),
                    'email_verified_at' => now(),
                    'role_id' => $roleId, // Using dynamically fetched role ID
                    'google_id' => $googleId,
                ]);
                Candidate::create([
                    'user_id' => $user->id,
                    'surname' => '',
                    'cv' => null
                ]);
            }

            // Generar token de autenticación
            $token = $user->createToken('mobile-app')->plainTextToken;
            return response()->json(['token' => $token, 'user' => $user], 200);
        } catch (\Exception $e) {
            Log::error('Error en handleGoogleCallback: ' . $e->getMessage());
            return response()->json(['error' => 'Error al procesar la autenticación con Google'], 500);
        }
    }
}