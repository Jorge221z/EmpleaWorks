<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Mailgun\Mailgun;

class MailController extends Controller
{
    /**
     * Envía correo de confirmación al candidato tras aplicar a una oferta.
     *
     * @param array $data Datos necesarios para el correo
     * @return bool Éxito del envío
     */
    public function sendApplicationConfirmation($data)
    {
        try {
            $mg = Mailgun::create(env('API_KEY'), env('MAILGUN_ENDPOINT', 'https://api.eu.mailgun.net'));
            
            // Preparamos los datos del mensaje para el candidato
            $domain = env('MAILGUN_DOMAIN', 'mg.emplea.works');
            $fromAddress = 'Emplea Works <notificaciones@mg.emplea.works>';
            $toAddress = "{$data['candidate']->name} <{$data['email']}>";
            $subject = __("messages.application_confirm", [
                'name' => $data['candidate']->name,
                'offer' => $data['offer']->name,
            ]);
            $htmlBody = view('emails.application_confirmation', [
                'candidate' => $data['candidate'],
                'offer' => $data['offer'],
                'company' => $data['company'],
                'phone' => $data['phone'],
                'email' => $data['email'],
                'coverLetter' => $data['coverLetter'],
            ])->render();

            // Enviamos el mensaje
            $mg->messages()->send($domain, [
                'from' => $fromAddress,
                'to' => $toAddress,
                'subject' => $subject,
                'html' => $htmlBody,
            ]);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Error al enviar correo de nueva aplicación al candidato', [
                'error' => $e->getMessage(),
            ]);
            
            return false;
        }
    }

    /**
     * Envía notificación a la empresa sobre una nueva aplicación.
     *
     * @param array $data Datos necesarios para el correo
     * @return bool Éxito del envío
     */
    public function sendApplicationNotification($data)
    {
        try {
            $mg = Mailgun::create(env('API_KEY'), env('MAILGUN_ENDPOINT', 'https://api.eu.mailgun.net'));

            // Preparamos los datos del mensaje
            $domain = env('MAILGUN_DOMAIN', 'mg.emplea.works');
            $fromAddress = 'Emplea Works <notificaciones@mg.emplea.works>';
            $toAddress = "{$data['company']->name} <{$data['company']->email}>";
            $subject = __("messages.new_application_from", [
                'name' => $data['candidate']->name,
                'offer' => $data['offer']->name,
            ]);
            $htmlBody = view('emails.new_application', [
                'candidate' => $data['candidate'],
                'offer' => $data['offer'],
                'company' => $data['company'],
                'phone' => $data['phone'],
                'email' => $data['email'],
                'coverLetter' => $data['coverLetter'],
            ])->render();

            // Enviamos el mensaje
            $mg->messages()->send($domain, [
                'from' => $fromAddress,
                'to' => $toAddress,
                'subject' => $subject,
                'html' => $htmlBody,
            ]);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Error al enviar correo de nueva aplicación a la empresa', [
                'error' => $e->getMessage(),
            ]);
            
            return false;
        }
    }
}
