<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\Candidate;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Manejar el registro de un nuevo usuario desde la aplicación móvil.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:' . User::class,
            'role' => 'required|string|in:candidate,company',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        try {
            // Obtener el ID del rol basado en el nombre
            $role = Role::where('name', $request->role)->first();
            $roleId = $role ? $role->id : null;

            // Crear el usuario
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $roleId,
            ]);

            // Crear perfil según el rol
            if ($request->role === 'candidate') {
                Candidate::create([
                    'user_id' => $user->id,
                    'surname' => '',
                    'cv' => null,
                ]);
            } elseif ($request->role === 'company') {
                Company::create([
                    'user_id' => $user->id,
                    'address' => null,
                    'web_link' => null,
                ]);
            }

            // Enviar email de verificación
            $user->sendEmailVerificationNotification();

            // Generar un token de acceso
            $token = $user->createToken('mobile-app')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user,
                'email_verified' => $user->hasVerifiedEmail(),
                'message' => 'Cuenta creada exitosamente. Por favor verifica tu email.',
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear la cuenta. Inténtalo de nuevo.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Manejar el inicio de sesión desde la aplicación móvil.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // Generar un token de acceso
        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
            'email_verified' => $user->hasVerifiedEmail(),
        ]);
    }
}