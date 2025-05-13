<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Mailgun\Mailgun;

class MailController extends Controller
{
    /**
     * Envía correo de confirmación al candidato tras aplicar a una oferta.
     *
     * @param array $data Datos necesarios para el correo
     * @return array|bool Array con status y mensaje de error, o true en caso de éxito
     */
    public function sendApplicationConfirmation($data)
    {
        try {
            $mg = Mailgun::create(env('API_KEY'), env('MG_ENDPOINT', 'https://api.eu.mailgun.net'));
            
            // Preparamos los datos del mensaje para el candidato
            $domain = env('MAILGUN_DOMAIN', 'mg.emplea.works');
            $fromAddress = 'EmpleaWorks <notificaciones@mg.emplea.works>';
            $toAddress = "{$data['candidate']->name} <{$data['email']}>";
            $subject = __("messages.application_confirm", [
                'name' => $data['candidate']->name,
                'offer' => $data['offer']->name,
            ]);

            // Obtenemos la información del CV desde la tabla candidates
            $candidate = \App\Models\Candidate::where('user_id', $data['candidate']->id)->first();
            $cvPath = null;
            $cvUrl = null;
            $attachmentParams = [];

            // Si el candidato tiene un CV, preparamos los datos para incluirlo en el correo
            if ($candidate && $candidate->cv) {
                $cvPath = $candidate->cv;
                
                // Generamos una URL firmada (temporal) para el CV
                $cvUrl = URL::temporarySignedRoute(
                    'cv.download',
                    now()->addDays(7),
                    ['candidate' => $candidate->id]
                );

                // Si el archivo existe, lo adjuntamos al correo
                if (Storage::disk('public')->exists($cvPath)) {
                    $cvFullPath = Storage::disk('public')->path($cvPath);
                    $attachmentParams['attachment'] = [
                        ['filePath' => $cvFullPath, 'filename' => basename($cvPath)]
                    ];
                }
            }

            // Añadimos los datos del CV y el logo a la vista
            $viewData = array_merge($data, [
                'cvPath' => $cvPath,
                'cvUrl' => $cvUrl,
            ]);

            $htmlBody = view('emails.application_confirmation', $viewData)->render();

            // Preparamos los parámetros del mensaje
            $messageParams = [
                'from' => $fromAddress,
                'to' => $toAddress,
                'subject' => $subject,
                'html' => $htmlBody,
            ];

            // Si hay un CV para adjuntar, lo añadimos como adjunto
            if (!empty($attachmentParams['attachment'])) {
                $messageParams['attachment'] = $attachmentParams['attachment'];
            
            } else { 
                // En caso de faltar el CV, devolver error en lugar de intentar redireccionar
                return [
                    'success' => false,
                    'error' => 'cv_missing',
                    'message' => __('messages.cv_empty')
                ];
            }

            // Enviamos el mensaje
            $mg->messages()->send($domain, $messageParams);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Error al enviar correo de nueva aplicación al candidato', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
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
            $mg = Mailgun::create(env('API_KEY'), env('MG_ENDPOINT', 'https://api.eu.mailgun.net'));

            // Preparamos los datos del mensaje
            $domain = env('MAILGUN_DOMAIN', 'mg.emplea.works');
            $fromAddress = 'EmpleaWorks <notificaciones@mg.emplea.works>';
            $toAddress = "{$data['company']->name} <{$data['offer']->email}>";
            
            $subject = __("messages.new_application_from", [
                'name' => $data['candidate']->name,
                'offer' => $data['offer']->name,
            ]);

            // Obtenemos la información del CV desde la tabla candidates
            $candidate = \App\Models\Candidate::where('user_id', $data['candidate']->id)->first();
            $cvPath = null;
            $cvUrl = null;
            $attachmentParams = [];

            // Si el candidato tiene un CV, preparamos los datos para incluirlo en el correo
            if ($candidate && $candidate->cv) {
                $cvPath = $candidate->cv;
                
                // Generamos una URL firmada (temporal) para el CV
                $cvUrl = URL::temporarySignedRoute(
                    'cv.download',
                    now()->addDays(7),
                    ['candidate' => $candidate->id]
                );

                // Si el archivo existe, lo adjuntamos al correo
                if (Storage::disk('public')->exists($cvPath)) {
                    $cvFullPath = Storage::disk('public')->path($cvPath);
                    $attachmentParams['attachment'] = [
                        ['filePath' => $cvFullPath, 'filename' => basename($cvPath)]
                    ];
                }
            }

            // Añadimos los datos del CV 
            $viewData = array_merge($data, [
                'cvPath' => $cvPath,
                'cvUrl' => $cvUrl,
            ]);

            $htmlBody = view('emails.new_application', $viewData)->render();

            // Preparamos los parámetros del mensaje
            $messageParams = [
                'from' => $fromAddress,
                'to' => $toAddress,
                'subject' => $subject,
                'html' => $htmlBody,
            ];

            // Si hay un CV para adjuntar, lo añadimos como adjunto
            if (!empty($attachmentParams['attachment'])) {
                $messageParams['attachment'] = $attachmentParams['attachment'];
            }

            // Enviamos el mensaje
            $mg->messages()->send($domain, $messageParams);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Error al enviar correo de nueva aplicación a la empresa', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return false;
        }
    }

    /**
     * Envía el correo desde el formulario de contacto.
     *
     * @param array $data Datos validados del formulario de contacto
     * @return bool Éxito del envío
     */
    public function sendContactFormEmail($data)
    {
        try {
            $mg = Mailgun::create(env('API_KEY'), env('MG_ENDPOINT', 'https://api.eu.mailgun.net'));
            
            // Preparamos los datos del mensaje
            $domain = env('MAILGUN_DOMAIN', 'mg.emplea.works');
            $fromAddress = 'EmpleaWorks <notificaciones@mg.emplea.works>'; // Usar dirección verificada como remitente
            $toAddress = 'EmpleaWorks <empleaworks@gmail.com>'; // Actualizado al email solicitado
            $subject = "Formulario de contacto: {$data['subject']}";
            
            $inquiryType = $data['inquiryType'] ?? 'General';
            
            // Preparamos el cuerpo del correo (texto plano)
            $plainTextBody = "Nuevo mensaje del formulario de contacto\n\n" .
                             "Nombre: {$data['name']}\n" .
                             "Email: {$data['email']}\n" .
                             "Tipo de consulta: {$inquiryType}\n" .
                             "Asunto: {$data['subject']}\n\n" .
                             "Mensaje:\n{$data['message']}\n\n" .
                             "-- Enviado desde el formulario de contacto de EmpleaWorks --";
            
            // Preparamos el HTML por si se desea usar
            $htmlBody = view('emails.contact_form', [
                'name' => $data['name'],
                'email' => $data['email'],
                'subject' => $data['subject'],
                'message' => $data['message'],
                'inquiryType' => $inquiryType
            ])->render();
            
            // Preparamos los parámetros del mensaje
            $messageParams = [
                'from' => $fromAddress,
                'to' => $toAddress,
                'subject' => $subject,
                'text' => $plainTextBody, // Incluimos versión texto plano
                'html' => $htmlBody,
                'h:Reply-To' => $data['email'] // Para que se pueda responder directamente al remitente
            ];
            
            // Enviamos el mensaje
            $mg->messages()->send($domain, $messageParams);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Error al enviar correo del formulario de contacto', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return false;
        }
    }
}
