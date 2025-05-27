<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class PasswordController extends Controller
{
    /**
     * Obtiene la información de configuración de contraseña del usuario.
     */
    public function show(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado.'], 401);
            }

            $isGoogleUser = !empty($user->google_id);

            return response()->json([
                'isGoogleUser' => $isGoogleUser,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener la configuración de contraseña.'], 500);
        }
    }

    /**
     * Actualiza la contraseña del usuario.
     */
    public function update(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado.'], 401);
            }

            // Previene cambios de contraseña para usuarios de Google
            if (!empty($user->google_id)) {
                return response()->json(['error' => __('messages.cannot_change_google_password')], 403);
            }

            // Valida los datos del formulario
            $validated = $request->validate([
                'current_password' => ['required', 'current_password'],
                'password' => ['required', Password::defaults(), 'confirmed'],
            ], [
                'current_password.required' => __('messages.current_password_required'),
                'current_password.current_password' => __('messages.current_password_incorrect'),
                'password.required' => __('messages.new_password_required'),
                'password.confirmed' => __('messages.password_confirmation_mismatch'),
            ]);

            // Actualiza la contraseña del usuario
            $user->update([
                'password' => Hash::make($validated['password']),
            ]);

            return response()->json(['message' => __('messages.password_updated_success')], 200);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar la contraseña.'], 500);
        }
    }
}