<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;
use Inertia\Response;
use Mailgun\Mailgun;
use App\Models\User;

class PasswordResetLinkController extends Controller
{
    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // 1) Validación
        $request->validate([
            'email' => 'required|email',
        ], [
            'email.required' => __('messages.email_required'),
            'email.email' => __('messages.email_valid'),
        ]);

        // 2) Recuperar el usuario
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return back()->withErrors([
                'email' => __('messages.user_not_found')
            ]);
        }

        // 3) Generar el token de reset
        $token = Password::broker()->createToken($user);

        // 4) Construir URL de reseteo (válida X minutos)
        $expires = config('auth.passwords.users.expire');
        $resetUrl = URL::temporarySignedRoute(
            'password.reset',
            now()->addMinutes($expires),
            [
                'token' => $token,
                'email' => $user->email,
            ]
        );

        // 5) Preparar y enviar el correo con Mailgun
        try {
            $mg = Mailgun::create(
                env('API_KEY'),
                env('MAILGUN_ENDPOINT', 'https://api.eu.mailgun.net')
            );
            $domain = env('MAILGUN_DOMAIN', 'mg.emplea.works');
            $fromAddress = 'EmpleaWorks <notificaciones@mg.emplea.works>';
            $toAddress = "{$user->name} <{$user->email}>";
            $subject = __('messages.reset_password_subject');

            // Renderizamos la vista Blade para el email
            $htmlBody = view('emails.password_reset', [
                'name' => $user->name,
                'resetUrl' => $resetUrl,
                'expires' => $expires,
            ])->render();

            $mg->messages()->send($domain, [
                'from' => $fromAddress,
                'to' => $toAddress,
                'subject' => $subject,
                'html' => $htmlBody,
            ]);

            return back()->with('status', __('messages.reset_link_sent'));

        } catch (\Exception $e) {
            Log::error('Error al enviar correo de reseteo de contraseña', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return back()->withErrors([
                'email' => __('messages.mail_send_failed')
            ]);
        }
    }
}
