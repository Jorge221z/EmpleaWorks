<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\Candidate;
use App\Models\Role;
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
     * Display the registration view.
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
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'role' => 'required|string|in:candidate,company',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        
        try {
            // Get role ID based on role name
            $role = Role::where('name', $request->role)->first();
            $roleId = $role ? $role->id : null;

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $roleId,
            ]);

            // Create a company or candidate based on the role
            if ($request->role === 'candidate') {
                // Create a candidate profile
                Candidate::create([
                    'user_id' => $user->id,
                    'surname' => '', // Default empty value
                    'cv' => null
                ]);
                
                \Log::info("Candidate profile created for user ID: {$user->id}");
            } elseif ($request->role === 'company') {
                // Create a company profile
                Company::create([
                    'user_id' => $user->id,
                    'address' => null,
                    'web_link' => null
                ]);
                
                \Log::info("Company profile created for user ID: {$user->id}");
            }

            event(new Registered($user));

            Auth::login($user);
            
            // Redirect to dashboard instead of using RouteServiceProvider::HOME
            return redirect()->route('dashboard')->with('success', __('messages.register_success'));
            
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Registration error: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            // Return back with error message
            return back()->withErrors([
                'error' => 'There was a problem creating your account. Please try again.'
            ]);
        }
    }
}

