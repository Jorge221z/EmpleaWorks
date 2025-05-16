<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SavedOfferController extends Controller
{
    /**
     * Toggle saved status for an offer.
     *
     * @param  \App\Models\Offer  $offer
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toggle(Offer $offer)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login')
                ->with('error', __('messages.login_required'));
        }
        
        if (!$user->isCandidate()) {
            return redirect()->back()
                ->with('error', __('messages.only_candidates_can_save'));
        }
        
        try {
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
            Log::error('Error toggling saved offer: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', __('messages.operation_failed'));
        }
    }
    
    /**
     * Get all saved offers for the authenticated candidate.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSavedOffers()
    {
        $user = Auth::user();
        
        if (!$user || !$user->isCandidate() || !$user->hasVerifiedEmail()) {
            return response()->json(['savedOffers' => []], 200);
        }
        
        try {
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
                
            return response()->json(['savedOffers' => $savedOffers]);
        } catch (\Exception $e) {
            Log::error('Error getting saved offers: ' . $e->getMessage());
            return response()->json(['error' => __('messages.operation_failed')], 500);
        }
    }
}