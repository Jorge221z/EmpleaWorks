<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\OfferController;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CandidateController extends Controller
{
    protected $offerController;

    public function __construct(OfferController $offerController)
    {
        $this->offerController = $offerController;
    }

    /**
     * Obtener las ofertas a las que el candidato autenticado ha aplicado.
     */
    public function dashboard()
    {
        $user = Auth::user();

        if (!$user || !$user->isCandidate()) {
            return response()->json(['error' => 'Usuario no es candidato.'], 403);
        }

        Log::info('Fetching applied offers for user ID: ' . $user->id);

        $candidateOffers = $user->appliedOffers()
            ->with('user.company')
            ->get();

        Log::info('Found ' . $candidateOffers->count() . ' offers for user ID: ' . $user->id);

        $formattedOffers = $candidateOffers->map(function ($offer) {
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
                ];
            }

            return [
                'id' => $offer->id,
                'name' => $offer->name,
                'description' => $offer->description,
                'category' => $offer->category,
                'degree' => $offer->degree,
                'contract_type' => $offer->contract_type,
                'job_location' => $offer->job_location,
                'closing_date' => $offer->closing_date,
                'created_at' => $offer->created_at,
                'company' => $companyData,
            ];
        });

        return response()->json(['candidateOffers' => $formattedOffers], 200);
    }
    /**
     * Obtener los detalles de una oferta para la solicitud.
     */
    public function showOffer(Offer $offer)
    {
        if (!$offer->exists) {
            return response()->json(['error' => 'Oferta no encontrada.'], 404);
        }

        $user = Auth::user();

        if (!$user->candidate) {
            return response()->json(['error' => 'Perfil de candidato no encontrado.'], 403);
        }

        $offerWithCompany = $this->offerController->getOffer($offer);

        return response()->json(['offer' => $offerWithCompany], 200);
    }
}