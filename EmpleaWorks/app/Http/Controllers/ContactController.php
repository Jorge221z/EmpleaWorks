<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Process the contact form submission.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function submit(Request $request)
    {
        // Validar los datos del formulario
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
            'inquiryType' => 'nullable|string|max:255',
        ]);

        try {
            // Instanciar el MailController
            $mailController = new MailController();
            
            // Enviar el correo
            $emailSent = $mailController->sendContactFormEmail($validated);
            
            if (!$emailSent) {
                return back()->with('error', __('messages.email_send_error'));
            }
            
            // Redirigir con mensaje de éxito (será mostrado como toast)
            return back()->with('success', __('messages.contact_form_submitted'));
        } catch (\Exception $e) {
            Log::error('Contact form submission error: ' . $e->getMessage());
            return back()->with('error', __('messages.contact_form_error'));
        }
    }
}
