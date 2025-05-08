<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Obtener la información del perfil del usuario autenticado.
     */
    public function show()
    {
        $user = Auth::user();
        $profileData = $user->toArray();

        if ($user->role_id === 1 && $user->candidate) {
            $profileData['candidate'] = $user->candidate->toArray();
        } elseif ($user->role_id === 2 && $user->company) {
            $profileData['company'] = $user->company->toArray();
        }

        return response()->json($profileData);
    }

    /**
     * Actualizar la información del perfil del usuario autenticado.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();

        try {
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
            } elseif ($request->hasFile('image')) {
                $imageFile = $request->file('image');
                $path = $imageFile->store('images', 'public');
                $user->image = $path;
            }

            // Guardar cambios del usuario
            if ($user->isDirty()) {
                $user->save();
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
                } elseif ($request->hasFile('cv')) {
                    if ($user->candidate->cv && Storage::disk('public')->exists($user->candidate->cv)) {
                        Storage::disk('public')->delete($user->candidate->cv);
                    }
                    $cvFile = $request->file('cv');
                    $uniqueFilename = $this->getUniqueFilename('cvs', $cvFile->getClientOriginalName());
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

            return response()->json(['message' => 'Perfil actualizado con éxito.', 'user' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar el perfil.', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Eliminar la cuenta del usuario autenticado.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = Auth::user();

        // Eliminar imagen de usuario si existe
        if ($user->image && Storage::disk('public')->exists($user->image)) {
            Storage::disk('public')->delete($user->image);
        }

        // Eliminar CV si es candidato y existe
        if ($user->role_id === 1 && $user->candidate && $user->candidate->cv) {
            if (Storage::disk('public')->exists($user->candidate->cv)) {
                Storage::disk('public')->delete($user->candidate->cv);
            }
        }

        $user->delete();

        return response()->json(['message' => 'Cuenta eliminada con éxito.'], 200);
    }

    /**
     * Generar un nombre de archivo único añadiendo timestamp si es necesario
     */
    private function getUniqueFilename(string $directory, string $originalName): string
    {
        $filename = pathinfo($originalName, PATHINFO_FILENAME);
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        $filename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $filename);
        $newFilename = $filename . '.' . $extension;

        if (Storage::disk('public')->exists($directory . '/' . $newFilename)) {
            $newFilename = $filename . '_' . time() . '.' . $extension;
        }

        return $newFilename;
    }
}