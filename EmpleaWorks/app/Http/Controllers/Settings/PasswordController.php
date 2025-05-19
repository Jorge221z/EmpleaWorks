<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
{
    /**
     * Show the user's password settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        // Verificar si el usuario tiene un Google ID (o cualquier otro campo que uses para identificar usuarios de Google)
        $isGoogleUser = !empty($user->google_id); 
        
        return Inertia::render('settings/password', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'isGoogleUser' => $isGoogleUser,  // Añadir esta información a la vista
        ]);
    }

    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        // Si el usuario se registró con Google, rechazar el cambio de contraseña
        if (!empty($user->google_id)) {
            return back()->with('error', __('messages.cannot_change_google_password'));
        }
        
        // Eliminar try/catch que está causando confusión en el flujo de errores
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ], [
            'current_password.required' => __('messages.current_password_required'),
            'current_password.current_password' => __('messages.current_password_incorrect'),
            'password.required' => __('messages.new_password_required'),
            'password.confirmed' => __('messages.password_confirmation_mismatch'),
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', __('messages.password_updated_success'));
    }
}
