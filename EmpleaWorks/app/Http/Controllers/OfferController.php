<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;

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
     * @param  \App\Models\Offer  $offer
     * @return \Illuminate\Http\Response
     */
    // public function apply(Offer $offer)
    // {
    //     // Verificar que el usuario sea un candidato
    //     if (!auth()->user()->isCandidate()) {
    //         return response()->json(['error' => 'Solo los candidatos pueden aplicar a ofertas'], 403);
    //     }

    //     // Verificar que el usuario no haya aplicado ya a esta oferta
    //     if (auth()->user()->candidate->appliedOffers()->where('offer_id', $offer->id)->exists()) {
    //         return response()->json(['error' => 'Ya has aplicado a esta oferta'], 400);
    //     }

    //     // Registrar la aplicación
    //     auth()->user()->candidate->appliedOffers()->attach($offer->id);

    //     return response()->json(['message' => 'Aplicación registrada con éxito'], 200);
    // }
}
