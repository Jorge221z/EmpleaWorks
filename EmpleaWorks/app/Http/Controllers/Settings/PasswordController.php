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
     * Muestra la página de configuración de contraseña del usuario
     *
     * @param Request $request Solicitud HTTP actual
     * @return Response Vista con la configuración de contraseña
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        // Determina si el usuario se autenticó mediante Google
        $isGoogleUser = !empty($user->google_id);

        return Inertia::render('settings/password', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'isGoogleUser' => $isGoogleUser,
        ]);
    }

    /**
     * Actualiza la contraseña del usuario
     *
     * @param Request $request Solicitud HTTP con los datos de la nueva contraseña
     * @return RedirectResponse Redirección con mensaje de estado
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Previene cambios de contraseña para usuarios de Google
        if (!empty($user->google_id)) {
            return back()->with('error', __('messages.cannot_change_google_password'));
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

        return back()->with('success', __('messages.password_updated_success'));
    }
}
