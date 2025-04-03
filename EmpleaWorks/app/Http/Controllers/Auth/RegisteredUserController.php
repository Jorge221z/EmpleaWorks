<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:candidate,company'],
        ]);

        $role = Role::where('name', $request->role)->first(); //buscamos el rol que coincida con el nombre de entrada//
        if (!$role) { //mayor seguridad en caso de que el formulario no haya enviado correctamente el nombre del rol//
            return back()->withErrors(['role' => 'Invalid role selected.']);
        }
        $role_id = $role->id; //obtenemos el id del rol que coincide con el nombre de entrada(ya que el campo en la tabla users es role_id)//


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $role_id, //asignamos el id del rol al nuevo usuario// 
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}

