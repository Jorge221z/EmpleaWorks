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
     * Store a newly created offer in storage.
     *
     * @param  \Illuminate\Http\Request  $request
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
            // Manejar cualquier error
            return redirect()->back()
                ->with('error', __('messages.job_created_error') . ': ' . $e->getMessage())
                ->withInput();
        }
    }
    
    /**
     * Get all offers as array.
     *
     * @return array
     */
    public function list()
    {
        // Modificado para cargar la información de la empresa a través de la relación user->company
        $offers = Offer::with(['user.company'])->get();

        // Transformamos los datos para mantener la estructura esperada por el frontend
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
     * Get a specific offer with its company.
     *
     * @param  \App\Models\Offer  $offer
     * @return array
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
            'company_id' => $offer->user_id, // Para compatibilidad
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
     * Apply to an offer.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse | \Inertia\Response
     */
    public function apply(Request $request)
    {
        $validated = $request->validate(
            [
                'phone' => ['required', 'string', 'min:7', 'max:20', 'regex:/^\+?[0-9\s\-()]+$/',],
                'email' => 'required|email|max:255',
                'cl' => 'required|string|max:255',
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
                'cl.max' => __('messages.cover_letter_max_length', ['max' => 255]),
            ]
        );

        // Verificamos si el usuario está autenticado
        if (!Auth::check()) {
            return redirect()->back()->with('error', __('messages.login_required_for_apply'));
        }

        // Obtenemos el usuario autenticado
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
        
        // Check if the candidate has a CV before attempting to save application
        if (!$candidate->cv || !Storage::disk('public')->exists($candidate->cv)) {
            return redirect()->route('profile.update')
                ->with('error', __('messages.cv_empty'));
        }
        
        // Solo lo guardamos si el CV existe para ese candidato//
        $user->applyToOffer($offer);

        // Preparamos los datos para los correos
        $company = User::find($offer->user_id);
        
        $emailData = [
            'candidate' => $user,
            'offer' => $offer,
            'company' => $company,
            'phone' => $request->phone,
            'email' => $request->email,
            'coverLetter' => $request->cl,
        ];
        
        // Instanciamos el MailController
        $mailController = new \App\Http\Controllers\MailController();
        
        // Enviamos correo al candidato
        $candidateEmailResult = $mailController->sendApplicationConfirmation($emailData);
        
        // Verificamos si hay un error específico por CV faltante
        if (is_array($candidateEmailResult) && isset($candidateEmailResult['success']) && $candidateEmailResult['success'] === false) {
            if ($candidateEmailResult['error'] === 'cv_missing') {
                // Si falta el CV, redirigir al usuario a la página de actualización de perfil
                return redirect()->route('profile.update')
                    ->with('error', $candidateEmailResult['message']);
            }
        }
        
        if (!$candidateEmailResult) {
            // Log del error ya se maneja en el MailController
            return redirect()->back()
                ->with('error', __('messages.email_send_error'));
        }
        
        // Enviamos correo a la empresa
        $companyEmailSent = $mailController->sendApplicationNotification($emailData);
        if (!$companyEmailSent) {
            // Log del error ya se maneja en el MailController
            return redirect()->back()
                ->with('error', __('messages.email_send_error'));
        }

        //caso en el que salga todo bien y no haya ningun fallo//
        return redirect()->route('candidate.dashboard')
            ->with('success', __('messages.application_submitted'));
    }

    /**
     * Update the specified offer in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Offer  $offer
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Offer $offer)
    {
        // Verificar que la oferta pertenece a la empresa actual
        $user = Auth::user();
        
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
            
            // Redireccionar con mensaje de éxito
            return redirect()->route('company.dashboard')
                ->with('success', __('messages.job_updated_success'));
        } catch (\Exception $e) {
            // Manejar cualquier error
            return redirect()->back()
                ->with('error', __('messages.job_updated_error') . ': ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified offer from storage.
     *
     * @param  \App\Models\Offer  $offer
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Offer $offer)
    {
        // Verificar que la oferta pertenece a la empresa actual
        $user = Auth::user();
        
        if ($offer->user_id !== $user->id) {
            return redirect()->route('company.dashboard')
                ->with('error', 'You can only delete your own job listings');
        }
        
        try {
            // Eliminar la oferta
            $offer->delete();
            
            // Redireccionar con mensaje de éxito
            return redirect()->route('company.dashboard')
                ->with('success', 'Job listing deleted successfully!');
        } catch (\Exception $e) {
            // Manejar cualquier error
            return redirect()->back()
                ->with('error', 'There was a problem deleting your job listing: ' . $e->getMessage());
        }
    }
}
