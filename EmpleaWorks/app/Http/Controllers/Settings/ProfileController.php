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
     * Generate a unique filename by adding a timestamp if necessary
     */
    private function getUniqueFilename(string $directory, string $originalName): string
    {
        $filename = pathinfo($originalName, PATHINFO_FILENAME);
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        
        // Clean the filename to prevent issues with special characters
        $filename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $filename);
        
        $newFilename = $filename . '.' . $extension;
        
        // Check if file exists, if so add timestamp to make it unique
        if (Storage::disk('public')->exists($directory . '/' . $newFilename)) {
            $newFilename = $filename . '_' . time() . '.' . $extension;
        }
        
        return $newFilename;
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
                // Eliminar archivo físico
                if (Storage::disk('public')->exists($user->image)) {
                    Storage::disk('public')->delete($user->image);
                }
                $user->image = null;
                $user->save(); // Guardar inmediatamente para asegurar la actualización en la BD
            }
            // Manejar imagen con nombre original (solo si no se está eliminando)
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
                    // Eliminar archivo físico
                    if (Storage::disk('public')->exists($user->candidate->cv)) {
                        Storage::disk('public')->delete($user->candidate->cv);
                    }
                    $user->candidate->cv = null;
                    $user->candidate->save(); // Guardar inmediatamente
                }
                // Manejar CV con nombre original (solo si no se está eliminando)
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
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

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
