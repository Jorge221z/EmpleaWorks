<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SavedOfferController extends Controller
{
    /**
     * Alterna el estado de guardado de una oferta para el candidato actual
     *
     * @param  \App\Models\Offer  $offer Oferta a guardar/eliminar
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toggle(Offer $offer)
    {
        // Verifica autenticación del usuario
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login')
                ->with('error', __('messages.login_required'));
        }

        // Verifica que sea un candidato
        if (!$user->isCandidate()) {
            return redirect()->back()
                ->with('error', __('messages.only_candidates_can_save'));
        }

        try {
            // Verifica si el candidato ya ha aplicado a la oferta
            $hasApplied = $user->appliedOffers()->where('offers.id', $offer->id)->exists();
            if ($hasApplied) {
                return redirect()->back()
                    ->with('error', __('messages.cannot_save_applied_offer'));
            }

            // Alterna el estado de guardado
            if ($user->hasSavedOffer($offer->id)) {
                $user->unsaveOffer($offer);
                return redirect()->back()
                    ->with('success', __('messages.offer_removed_from_saved'));
            } else {
                $user->saveOffer($offer);
                return redirect()->back()
                    ->with('success', __('messages.offer_saved_success'));
            }
        } catch (\Exception $e) {
            // Registra el error y notifica al usuario
            Log::error('Error al alternar estado de oferta guardada: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', __('messages.operation_failed'));
        }
    }

    /**
     * Obtiene todas las ofertas guardadas del candidato autenticado
     *
     * @return \Illuminate\Http\JsonResponse Lista de ofertas guardadas con datos de empresa
     */
    public function getSavedOffers()
    {
        // Verifica autenticación del usuario
        $user = Auth::user();
        if (!$user || !$user->isCandidate() || !$user->hasVerifiedEmail()) {
            return response()->json(['savedOffers' => []], 200);
        }

        try {
            // Recupera y formatea las ofertas guardadas
            $savedOffers = $user->savedOffers()
                ->with('user.company')
                ->get()
                ->map(function ($offer) {
                    // Prepara los datos de la empresa
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

                    // Estructura los datos de la oferta
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

            return response()->json(['savedOffers' => $savedOffers]);
        } catch (\Exception $e) {
            Log::error('Error al obtener ofertas guardadas: ' . $e->getMessage());
            return response()->json(['error' => __('messages.operation_failed')], 500);
        }
    }
}
