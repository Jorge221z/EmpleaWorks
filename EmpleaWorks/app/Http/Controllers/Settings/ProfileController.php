<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Exception;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $formRequest): RedirectResponse
{
    try {
        $request = request(); // Para manejar archivos
        $user = Auth::user();
        $validated = $formRequest->validated();

        // Depurar datos validados y archivos
        Log::info('Datos validados:', $validated);
        Log::info('Archivos recibidos:', $request->files->all());

        // Actualizar campos del usuario
        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }
        }
        if (isset($validated['description'])) {
            $user->description = $validated['description'];
        }

        // Manejar imagen
        if ($request->hasFile('image')) {
            $user->image = $request->file('image')->store('images', 'public');
        }

        // Guardar cambios del usuario (temporalmente comentado hasta resolver el problema con save)
        if ($user->isDirty()) {
            $user->update($user->getDirty()); // Usar update en lugar de save
            Log::info('Usuario actualizado: ' . $user->id . ' | Cambios: ' . json_encode($user->getChanges()));
        } else {
            Log::info('No hay cambios para guardar en usuario: ' . $user->id . ' | Atributos actuales: ' . json_encode($user->getAttributes()));
        }

        // Campos específicos por rol
        if ($user->role_id === 1 && $user->candidate) {
            if (isset($validated['surname'])) {
                $user->candidate->surname = $validated['surname'];
            }
            if ($request->hasFile('cv')) {
                $user->candidate->cv = $request->file('cv')->store('cvs', 'public');
            }
            if ($user->candidate->isDirty()) {
                $user->candidate->save();
                Log::info('Candidato guardado: ' . $user->candidate->id);
            }
        }

        if ($user->role_id === 2 && $user->company) {
            if (isset($validated['address'])) {
                $user->company->address = $validated['address'];
            }
            if (isset($validated['weblink'])) {
                $user->company->web_link = $validated['weblink'];
            }
            if ($user->company->isDirty()) {
                $user->company->save();
                Log::info('Empresa guardada: ' . $user->company->id);
            }
        }

        return redirect()->route('profile.edit')->with('status', '¡Perfil actualizado!');
    } catch (Exception $e) {
        Log::error('Error al actualizar perfil: ' . $e->getMessage());
        return back()->with('error', 'Error: ' . $e->getMessage());
    }
}

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
