<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CandidateController extends Controller
{
    /**
     * Display the candidate dashboard.
     *
     * @return \Inertia\Response
     */
    public function dashboard()
    {
        // Get the authenticated user
    $user = Auth::user();
    
    // Initialize empty array for offers
    $candidateOffers = [];
    
    if ($user && $user->isCandidate()) {
        // Get the offers this candidate has applied to
        // with eager loading of company information through the user relationship
        $candidateOffers = $user->appliedOffers()
            ->with('user.company')
            ->get()
            ->map(function ($offer) {
                // Format each offer similar to how it's done in OfferController
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
            'flash' => $flash //pasamos explicitamente los flash a la vista //
    ]);
    }
}
