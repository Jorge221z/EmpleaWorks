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
     * Muestra la página de configuración del perfil de usuario
     *
     * @param Request $request Solicitud HTTP actual
     * @return Response Vista de configuración del perfil
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        // Determina si el usuario se autenticó mediante Google
        $isGoogleUser = !empty($user->google_id);
        
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'isGoogleUser' => $isGoogleUser,  // Añadir esta línea
        ]);
    }

    /**
     * Genera un nombre de archivo único para almacenamiento
     *
     * @param string $directory Directorio destino del archivo
     * @param string $originalName Nombre original del archivo
     * @return string Nombre de archivo único generado
     */
    private function getUniqueFilename(string $directory, string $originalName): string
    {
        $filename = pathinfo($originalName, PATHINFO_FILENAME);
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);

        // Validación de caracteres permitidos
        $filename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $filename);

        $newFilename = $filename . '.' . $extension;

        if (Storage::disk('public')->exists($directory . '/' . $newFilename)) {
            $newFilename = $filename . '_' . time() . '.' . $extension;
        }

        return $newFilename;
    }

    /**
     * Actualiza la información del perfil del usuario
     *
     * @param ProfileUpdateRequest $formRequest Datos validados del formulario
     * @return RedirectResponse Redirección con mensaje de estado
     */
    public function update(ProfileUpdateRequest $formRequest): RedirectResponse
    {
        try {
            $request = request();
            $user = Auth::user();
            $validated = $formRequest->validated();

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

            // Manejar eliminación de imagen
            if (isset($validated['delete_image']) && $validated['delete_image'] && $user->image) {
                if (Storage::disk('public')->exists($user->image)) {
                    Storage::disk('public')->delete($user->image);
                }
                $user->image = null;
                $user->save();
            }
            // Manejar imagen con nombre original
            else if ($request->hasFile('image')) {
                $imageFile = $request->file('image');

                try {
                    $path = $imageFile->store('images', 'public');
                } catch (Exception $e) {
                    \Log::error('Error al almacenar la imagen: ' . $e->getMessage());
                    $path = null;
                }

                $user->image = $path;
                $user->save();
            }

            // Guardar cambios del usuario
            if ($user->isDirty()) {
                $user->update($user->getDirty());
            }

            // Campos específicos por rol
            if ($user->role_id === 1 && $user->candidate) {
                if (isset($validated['surname'])) {
                    $user->candidate->surname = $validated['surname'];
                }

                // Manejar eliminación de CV
                if (isset($validated['delete_cv']) && $validated['delete_cv'] && $user->candidate->cv) {
                    if (Storage::disk('public')->exists($user->candidate->cv)) {
                        Storage::disk('public')->delete($user->candidate->cv);
                    }
                    $user->candidate->cv = null;
                    $user->candidate->save();
                }
                // Manejar CV con nombre original
                else if ($request->hasFile('cv')) {
                    // Si hay un CV previo, eliminarlo
                    if ($user->candidate->cv && Storage::disk('public')->exists($user->candidate->cv)) {
                        Storage::disk('public')->delete($user->candidate->cv);
                    }

                    $cvFile = $request->file('cv');
                    $uniqueFilename = $this->getUniqueFilename('cvs', $cvFile->getClientOriginalName());

                    // Almacena el CV con el nombre original o uno único si ya existe
                    $path = $cvFile->storeAs('cvs', $uniqueFilename, 'public');
                    $user->candidate->cv = $path;
                }

                if ($user->candidate->isDirty()) {
                    $user->candidate->save();
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
                }
            }

            return redirect()->route('profile.edit')
                ->with('success', __('messages.profile_updated_success'));
        } catch (Exception $e) {
            \Log::error('Error actualizando perfil: ' . $e->getMessage());
            return redirect()->route('profile.edit')
                ->with('error', __('messages.profile_updated_error'));
        }
    }

    /**
     * Elimina la cuenta del usuario y todos sus datos asociados
     *
     * @param Request $request Solicitud con validación de contraseña
     * @return RedirectResponse Redirección a página principal
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        // Si el usuario se registró con Google, no validamos la contraseña
        if (empty($user->google_id)) {
            $request->validate([
                'password' => ['required', 'current_password'],
            ]);
        }

        // Eliminar imagen de usuario si existe
        if ($user->image && \Storage::disk('public')->exists($user->image)) {
            \Storage::disk('public')->delete($user->image);
        }

        // Eliminar CV si es candidato y existe
        if ($user->role_id === 1 && $user->candidate && $user->candidate->cv) {
            if (\Storage::disk('public')->exists($user->candidate->cv)) {
                \Storage::disk('public')->delete($user->candidate->cv);
            }
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
