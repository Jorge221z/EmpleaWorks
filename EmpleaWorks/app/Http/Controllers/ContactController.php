<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Procesa el envío del formulario de contacto
     *
     * @param  \Illuminate\Http\Request  $request Datos del formulario
     * @return \Illuminate\Http\RedirectResponse Redirección con mensaje de estado
     */
    public function submit(Request $request)
    {
        // Valida los campos requeridos del formulario
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
            'inquiryType' => 'nullable|string|max:255',
        ]);

        try {
            // Gestiona el envío del correo a través del MailController
            $mailController = new MailController();
            $emailSent = $mailController->sendContactFormEmail($validated);

            // Verifica si el envío fue exitoso
            if (!$emailSent) {
                return back()->with('error', __('messages.email_send_error'));
            }

            // Retorna a la página anterior con mensaje de éxito
            return back()->with('success', __('messages.contact_form_submitted'));
        } catch (\Exception $e) {
            // Registra el error y notifica al usuario
            Log::error('Contact form submission error: ' . $e->getMessage());
            return back()->with('error', __('messages.contact_form_error'));
        }
    }
}
