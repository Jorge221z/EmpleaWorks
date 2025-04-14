<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Offer;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OfferController extends Controller
{
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
     * Store a newly created offer.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // public function store(Request $request)
    // {
    //     // Validamos que el usuario sea una empresa
    //     if (!auth()->user()->isCompany()) {
    //         return response()->json(['error' => 'Solo las empresas pueden crear ofertas'], 403);
    //     }

    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255|unique:offers',
    //         'description' => 'required|string',
    //         'category' => 'required|string|max:255',
    //         'degree' => 'required|string|max:255',
    //         'email' => 'required|email|max:255',
    //         'contract_type' => 'required|string|max:255',
    //         'job_location' => 'required|string|max:255',
    //         'closing_date' => 'required|date|after:today',
    //     ]);

    //     // Asignar el ID del usuario autenticado como creador de la oferta
    //     $offer = Offer::create([
    //         ...$validated,
    //         'user_id' => auth()->id(),
    //     ]);

    //     return response()->json($offer, 201);
    // }

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
                'phone.required' => 'The phone field is required.',
                'phone.regex' => 'The phone format is invalid.',
                'email.required' => 'The email field is required.',
                'email.email' => 'The email format is invalid.',
                'email.max' => 'The email field cannot be more than 255 characters.',
                'cl.required' => 'The cover letter field is required.',
                'cl.max' => 'The cover letter field cannot be more than 255 characters.',
            ]
        );

        // Verificamos si el usuario está autenticado
        if (!Auth::check()) {
            return redirect()->back()->with('error', 'You must be logged in to apply for offers');
        }

        // Obtenemos el usuario autenticado
        $user = Auth::user();

        // Verificamos si el usuario es un candidato
        if (!($user->role->name === 'candidate')) {
            return redirect()->back()->with('error', 'Only candidates can apply for offers');
        }

        // Verificamos si la oferta existe
        $offer = Offer::where('id', $request->offer_id)->firstOrFail();
        if (!$offer) {
            return redirect()->back()->with('error', 'Offer not found');
        }

        // Verificamos si el candidato ya ha aplicado a esta oferta
        // Corregido para usar la relación correcta
        $existingApplication = $offer->candidates()->where('users.id', $user->id)->first();
        if ($existingApplication) {
            return redirect()->back()->with('error', 'You have already applied to this offer');
        }

        $candidate = Candidate::where('user_id', $user->id)->first();
        if (!$candidate) {
            return redirect()->back()->with('error', 'Candidate profile not found');
        }

        $user->applyToOffer($offer);

        return redirect()->route('dashboard')->with([
            'message' => 'Application submitted successfully',
        ]);
        // volvemos al dashboard tras aplicar con un mensaje de exito
    }
}
