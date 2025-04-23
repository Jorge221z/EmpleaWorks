<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        try {

        $user = $request->user();
        $validated = $request->validated();
        //A la hora de recoger las validaciones del request hay que tener en cuenta que se pasan en forma de array hacia esta funcion //
        // Actualizar datos básicos de usuario
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        
        if (isset($validated['description'])) {
            $user->description = $validated['description'];
        }
        
        // Verificar si el email cambió
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
        
        // Manejar imagen de perfil
        if ($request->hasFile('image')) {
            $user->image = $request->file('image')->store('images', 'public');
        }
        
        $user->save(); //guardamos los campos comunes que tiene la tabla users
        
        // Actualizar campos específicos según el rol
        if ($user->isCandidate() && $user->candidate) { //doble verificacion para evitar errores//
            if (isset($validated['surname'])) {
                $user->candidate->surname = $validated['surname'];
            }
            
            if ($request->hasFile('cv')) {
                $user->candidate->cv = $request->file('cv')->store('cvs', 'public');
            }
            
            $user->candidate->save();
        }
        
        if ($user->isCompany() && $user->company) { //doble verificacion para evitar errores//
            if (isset($validated['address'])) {
                $user->company->address = $validated['address'];
            }
            
            if (isset($validated['weblink'])) {
                $user->company->web_link = $validated['weblink'];
            }
            
            $user->company->save();
        }
        
        return to_route('profile.edit');

        } catch (Exception $e) { //mayor seguridad y manejo de errores con try/catch 
            // Manejar cualquier error que pueda ocurrir durante la actualización
            return redirect()->back()->with('error', 'Error updating profile: ' . $e->getMessage());
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
