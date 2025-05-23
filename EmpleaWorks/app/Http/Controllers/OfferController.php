<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Offer;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Mailgun\Mailgun;
use Mailgun\Exception\HttpClientException;

class OfferController extends Controller
{
    /**
     * Almacena una nueva oferta de empleo en la base de datos
     *
     * @param  \Illuminate\Http\Request  $request Datos de la nueva oferta
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Validar los datos de la oferta con mensajes traducidos
        $validated = $request->validate(
            [
                'name' => 'required|string|max:255|unique:offers,name',
                'description' => 'required|string',
                'category' => 'required|string|max:255',
                'degree' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'contract_type' => 'required|string|max:255',
                'job_location' => 'required|string|max:255',
                'closing_date' => 'required|date|after:today',
            ],
            [
                'name.required' => __('messages.job_title_required'),
                'name.unique' => __('messages.job_title_unique'),
                'description.required' => __('messages.job_description_required'),
                'category.required' => __('messages.category_required'),
                'degree.required' => __('messages.degree_required'),
                'email.required' => __('messages.email_required'),
                'email.email' => __('messages.email_invalid_format'),
                'contract_type.required' => __('messages.contract_type_required'),
                'job_location.required' => __('messages.job_location_required'),
                'closing_date.required' => __('messages.closing_date_required'),
                'closing_date.date' => __('messages.closing_date_invalid'),
                'closing_date.after' => __('messages.closing_date_future'),
            ]
        );

        // Obtener el usuario autenticado
        $user = Auth::user();

        // Verificar que el usuario sea una empresa
        if (!$user || !$user->isCompany()) {
            return redirect()->back()->with('error', __('messages.only_companies_create'));
        }

        try {
            // Añadir el ID del usuario a los datos validados
            $validated['user_id'] = $user->id;

            // Crear la oferta
            $offer = Offer::create($validated);

            // Redireccionar con mensaje de éxito
            return redirect()->route('company.dashboard')
                ->with('success', __('messages.job_created_success'));
        } catch (\Exception $e) {
            // Manejar cualquier error en la creación
            Log::error('Error en creación de oferta: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', __('messages.job_created_error'))
                ->withInput();
        }
    }

    /**
     * Recupera todas las ofertas con información de la empresa
     *
     * @return array Lista formateada de ofertas con datos de empresa
     */
    public function list()
    {
        // Cargar la información de la empresa
        $offers = Offer::with(['user.company'])->get();

        $formattedOffers = $offers->map(function ($offer) {
            // Verificamos que el usuario exista y tenga una compañía asociada
            $companyData = null;
            if ($offer->user && $offer->user->company) {
                $companyData = [
                    'id' => $offer->user->company->id,
                    'name' => $offer->user->name,
                    'email' => $offer->user->email,
                    'logo' => $offer->user->image,
                    'description' => $offer->user->description,
                    'address' => $offer->user->company->address,
                    'web_link' => $offer->user->company->web_link,
                    'created_at' => $offer->user->company->created_at,
                    'updated_at' => $offer->user->company->updated_at,
                ];
            } else {
                // Proporcionar datos predeterminados para evitar errores
                $companyData = [
                    'id' => null,
                    'name' => $offer->user ? $offer->user->name : 'Empresa desconocida',
                    'email' => $offer->user ? $offer->user->email : '',
                    'logo' => null,
                    'description' => null,
                    'address' => null,
                    'web_link' => null,
                    'created_at' => null,
                    'updated_at' => null,
                ];
            }

            return [
                'id' => $offer->id,
                'name' => $offer->name,
                'description' => $offer->description,
                'category' => $offer->category,
                'degree' => $offer->degree,
                'email' => $offer->email,
                'contract_type' => $offer->contract_type,
                'job_location' => $offer->job_location,
                'closing_date' => $offer->closing_date,
                'company_id' => $offer->user_id,
                'user_id' => $offer->user_id,
                'created_at' => $offer->created_at,
                'updated_at' => $offer->updated_at,
                'company' => $companyData,
            ];
        })->toArray();

        return $formattedOffers;
    }

    /**
     * Obtiene los detalles de una oferta específica con datos de empresa
     *
     * @param  \App\Models\Offer  $offer Oferta a consultar
     * @return array Datos formateados de la oferta y empresa
     */
    public function getOffer(Offer $offer)
    {
        // Cargamos el usuario y su empresa relacionada
        $offer->load('user.company');

        // Formateamos los datos para mantener la estructura esperada
        $formattedOffer = [
            'id' => $offer->id,
            'name' => $offer->name,
            'description' => $offer->description,
            'category' => $offer->category,
            'degree' => $offer->degree,
            'email' => $offer->email,
            'contract_type' => $offer->contract_type,
            'job_location' => $offer->job_location,
            'closing_date' => $offer->closing_date,
            'company_id' => $offer->user_id,
            'user_id' => $offer->user_id,
            'created_at' => $offer->created_at,
            'updated_at' => $offer->updated_at,
            'company' => [
                'id' => $offer->user->company ? $offer->user->company->id : null,
                'name' => $offer->user->name,
                'email' => $offer->user->email,
                'logo' => $offer->user->image,
                'description' => $offer->user->description,
                'address' => $offer->user->company ? $offer->user->company->address : null,
                'web_link' => $offer->user->company ? $offer->user->company->web_link : null,
                'created_at' => $offer->user->company ? $offer->user->company->created_at : null,
                'updated_at' => $offer->user->company ? $offer->user->company->updated_at : null,
            ],
        ];

        return $formattedOffer;
    }

    /**
     * Procesa la solicitud de un candidato a una oferta
     *
     * @param  \Illuminate\Http\Request  $request Datos de la solicitud
     * @return mixed Redirección según resultado de la operación
     */
    public function apply(Request $request)
    {
        $validated = $request->validate(
            [
                'phone' => ['required', 'string', 'min:7', 'max:20', 'regex:/^\+?[0-9\s\-()]+$/',],
                'email' => 'required|email|max:255',
                'cl' => 'required|string|max:1000',
                'offer_id' => 'required|integer|exists:offers,id',
            ],
            [
                'phone.required' => __('messages.phone_required'),
                'phone.regex' => __('messages.phone_invalid_format'),
                'phone.min' => __('messages.phone_min_length', ['min' => 7]),
                'phone.max' => __('messages.phone_max_length', ['max' => 20]),
                'email.required' => __('messages.email_required'),
                'email.email' => __('messages.email_invalid_format'),
                'email.max' => __('messages.email_max_length', ['max' => 255]),
                'cl.required' => __('messages.cover_letter_required'),
                'cl.max' => __('messages.cover_letter_max_length', ['max' => 1000]),
                'offer_id.required' => __('messages.offer_id_required'),
            ]
        );

        // Sanitizamos los datos para evitar inyecciones
        $sanitized = [
            'phone' => preg_replace('/[^\d\+]/', '', trim($validated['phone'])),
            'email' => filter_var($validated['email'], FILTER_SANITIZE_EMAIL),
            'cl' => strip_tags($validated['cl']),
        ];

        // Verificamos si el usuario está autenticado
        if (!Auth::check()) {
            return redirect()->back()->with('error', __('messages.login_required_for_apply'));
        }

        $user = Auth::user();

        // Verificamos si el usuario es un candidato
        if (!($user->role->name === 'candidate')) {
            return redirect()->back()->with('error', __('messages.only_candidates_can_apply'));
        }

        // Verificamos si la oferta existe
        $offer = Offer::where('id', $request->offer_id)->firstOrFail();
        if (!$offer) {
            return redirect()->back()->with('error', __('messages.offer_not_found'));
        }

        // Verificamos si el candidato ya ha aplicado a esta oferta
        $existingApplication = $offer->candidates()->where('users.id', $user->id)->first();
        if ($existingApplication) {
            return redirect()->route('offer.show', $offer->id)
                ->with('error', __('messages.already_applied'));
        }

        $candidate = Candidate::where('user_id', $user->id)->first();
        if (!$candidate) {
            return redirect()->back()->with('error', __('messages.candidate_profile_not_found'));
        }

        $candidate->refresh();

        if (!$candidate->cv || !Storage::disk('public')->exists($candidate->cv)) {
            return redirect()->route('profile.update')
                ->with('error', __('messages.cv_empty'));
        }

        $user->applyToOffer($offer);

        // Si la oferta estaba guardada, la eliminamos de las guardadas
        if ($user->hasSavedOffer($offer->id)) {
            $user->unsaveOffer($offer);
            Log::info("Oferta {$offer->id} eliminada de guardados al aplicar para el usuario {$user->id}");
        }

        // Preparamos los datos para los correos
        $company = User::find($offer->user_id);

        $emailData = [
            'candidate' => $user,
            'offer' => $offer,
            'company' => $company,
            'phone' => $sanitized['phone'],
            'email' => $sanitized['email'],
            'coverLetter' => $sanitized['cl'],
        ];

        // Instanciamos el MailController
        $mailController = new \App\Http\Controllers\MailController();

        // Enviamos correo al candidato
        $candidateEmailResult = $mailController->sendApplicationConfirmation($emailData);

        // Verificamos si hay un error específico por CV faltante
        if (is_array($candidateEmailResult) && isset($candidateEmailResult['success']) && $candidateEmailResult['success'] === false) {
            if ($candidateEmailResult['error'] === 'cv_missing') {
                return redirect()->route('profile.update')
                    ->with('error', $candidateEmailResult['message']);
            }
        }

        if (!$candidateEmailResult) {
            return redirect()->back()
                ->with('error', __('messages.email_send_error'));
        }

        // Enviamos correo a la empresa
        $companyEmailSent = $mailController->sendApplicationNotification($emailData);
        if (!$companyEmailSent) {
            return redirect()->back()
                ->with('error', __('messages.email_send_error'));
        }

        // En caso en el que salga todo bien y no haya ningun fallo
        $successMessage = __('messages.application_submitted');

        // Si la oferta estaba guardada, lo mencionamos en el mensaje de éxito
        if ($user->savedOffers()->where('offers.id', $offer->id)->exists() === false &&
            isset($GLOBALS['offer_was_saved']) && $GLOBALS['offer_was_saved']) {
            $successMessage .= ' ' . __('messages.offer_removed_from_saved');
        }

        return redirect()->route('candidate.dashboard')
            ->with('success', $successMessage);
    }

    /**
     * Actualiza una oferta existente
     *
     * @param  \Illuminate\Http\Request  $request Datos actualizados
     * @param  \App\Models\Offer  $offer Oferta a actualizar
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Offer $offer)
    {
        // Verificar que la oferta pertenece a la empresa actual
        $user = Auth::user();
        if (!$user) {
            return redirect()->back()->with('error', __('messages.login_required'));
        }
        if ($offer->user_id !== $user->id) {
            return redirect()->back()->with('error', __('messages.not_your_listing'));
        }

        // Validar los datos de la oferta con mensajes traducidos
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:offers,name,' . $offer->id,
            'description' => 'required|string',
            'category' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'contract_type' => 'required|string|max:255',
            'job_location' => 'required|string|max:255',
            'closing_date' => 'required|date',
        ], [
            'name.required' => __('messages.job_title_required'),
            'name.unique' => __('messages.job_title_unique_edit', ['id' => $offer->id]),
            'description.required' => __('messages.job_description_required'),
            'category.required' => __('messages.category_required'),
            'degree.required' => __('messages.degree_required'),
            'email.required' => __('messages.email_required'),
            'email.email' => __('messages.email_invalid_format'),
            'contract_type.required' => __('messages.contract_type_required'),
            'job_location.required' => __('messages.job_location_required'),
            'closing_date.required' => __('messages.closing_date_required'),
            'closing_date.date' => __('messages.closing_date_invalid'),
        ]);

        try {
            // Actualizar la oferta
            $offer->update($validated);

            return redirect()->route('company.dashboard')
                ->with('success', __('messages.job_updated_success'));
        } catch (\Exception $e) {
            Log::error('Offer update error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', __('messages.job_updated_error'))
                ->withInput();
        }
    }

    /**
     * Elimina una oferta del sistema
     *
     * @param  \App\Models\Offer  $offer Oferta a eliminar
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Offer $offer)
    {
        // Verificar que el usuario esté autenticado
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('company.dashboard')
                ->with('error', __('messages.login_required'));
        }
        if ($offer->user_id !== $user->id) {
            return redirect()->route('company.dashboard')
                ->with('error', 'You can only delete your own job listings');
        }

        try {
            // Eliminar la oferta
            $offer->delete();

            return redirect()->route('company.dashboard');

        } catch (\Exception $e) {
            Log::error('Offer delete error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'There was a problem deleting your job listing: ' . $e->getMessage());
        }
    }
}
