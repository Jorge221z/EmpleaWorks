<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\OfferController;
use App\Models\Offer;

class CandidateController extends Controller
{
    protected $offerController;

    public function __construct(OfferController $offerController)
    {
        $this->offerController = $offerController;
    }
    /**
     * Display the candidate dashboard.
     *
     * @return \Inertia\Response
     */
    public function dashboard()
    {
        // Get the authenticated user
        $user = Auth::user();
        
        // Initialize empty arrays for offers
        $candidateOffers = [];
        $savedOffers = [];
        
        if ($user && $user->isCandidate()) {
            $candidateOffers = $user->appliedOffers()
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

                        
                    // Return formatted offer with company data
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
                        
                    // Return formatted offer with company data
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
        }
        
        $flash = [
            'success' => session('success'),
            'error' => session('error')
        ];

        return Inertia::render('candidateDashboard', [
            'candidateOffers' => $candidateOffers,
            'savedOffers' => $savedOffers,
            'flash' => $flash
        ]);
    }

    /**
     * Show the application form for a specific offer
     *
     * @param  \App\Models\Offer $offer
     * @return \Inertia\Response
     */
    public function showForm(Offer $offer)
    {
        // If an offer was provided, get the full offer details
        if ($offer->exists) {
            $offerWithCompany = $this->offerController->getOffer($offer);

            $user = Auth::user();
            
            if (!$user->candidate) {
                return Inertia::render('dashboard', [
                    'message' => __('messages.candidate_profile_not_found')
                ]);
            }
            
            return Inertia::render('AplicationForm', [
                'offer' => $offerWithCompany,
            ]);
        }
        
        return Inertia::render('dashboard', [
            'message' => __('messages.offer_not_found')
        ]);
    }
}
