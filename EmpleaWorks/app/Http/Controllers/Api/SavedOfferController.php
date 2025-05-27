<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SavedOfferController extends Controller
{
    /**
     * Alterna el estado de guardado de una oferta para el candidato actual.
     *
     * @param  \App\Models\Offer  $offer Oferta a guardar/eliminar
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggle(Offer $offer)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => __('messages.login_required')], 401);
            }

            if (!$user->isCandidate()) {
                return response()->json(['error' => __('messages.only_candidates_can_save')], 403);
            }

            $hasApplied = $user->appliedOffers()->where('offers.id', $offer->id)->exists();
            if ($hasApplied) {
                return response()->json(['error' => __('messages.cannot_save_applied_offer')], 403);
            }

            if ($user->hasSavedOffer($offer->id)) {
                $user->unsaveOffer($offer);
                return response()->json(['message' => __('messages.offer_removed_from_saved')], 200);
            } else {
                $user->saveOffer($offer);
                return response()->json(['message' => __('messages.offer_saved_success')], 200);
            }
        } catch (\Exception $e) {
            Log::error('Error al alternar estado de oferta guardada: ' . $e->getMessage());
            return response()->json(['error' => __('messages.operation_failed')], 500);
        }
    }

    /**
     * Obtiene todas las ofertas guardadas del candidato autenticado.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSavedOffers()
    {
        try {
            $user = Auth::user();
            if (!$user || !$user->isCandidate() || !$user->hasVerifiedEmail()) {
                return response()->json(['savedOffers' => []], 200);
            }

            $savedOffers = $user->savedOffers()
                ->with('user.company')
                ->get()
                ->map(function ($offer) {
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

            return response()->json(['savedOffers' => $savedOffers], 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener ofertas guardadas: ' . $e->getMessage());
            return response()->json(['error' => __('messages.operation_failed')], 500);
        }
    }
}