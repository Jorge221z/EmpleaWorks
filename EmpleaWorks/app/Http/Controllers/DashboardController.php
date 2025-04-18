<?php

namespace App\Http\Controllers;

use App\Http\Controllers\OfferController;
use App\Models\Offer;
use App\Models\User;
use App\Models\Candidate;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    protected $offerController;

    public function __construct(OfferController $offerController)
    {
        $this->offerController = $offerController;
    }

    /**
     * Display the dashboard with offers.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Obtenemos las ofertas usando el método list() del OfferController
        $offers = $this->offerController->list();

        $flash = [
            'success' => session('success'),
            'error' => session('error')
        ];

        return Inertia::render('dashboard', [
            'offers' => $offers,
            'flash' => $flash //pasamos explicitamente los flash a la vista //
        ]);
    }

    /**
     * Display a specific offer.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function showOffer(Offer $offer)
    {
        // Usamos el método getOffer() del OfferController
        $offerWithCompany = $this->offerController->getOffer($offer);

        return Inertia::render('showOffer', [
            'offer' => $offerWithCompany
        ]);
    }

    /**
     * Show the application form for a specific offer
     *
     * @param  \App\Models\Offer $offer
     */
    public function showForm(Offer $offer)
    {
        // If an offer was provided, get the full offer details
        if ($offer->exists) {
            $offerWithCompany = $this->offerController->getOffer($offer);

            $user = Auth::user(); //obtenemos el usuario autenticado en ese momento//
            
            if (!$user->candidate) { //usamos la relacion del modelo para hacer mas fluida esta comprobacion//
                return Inertia::render('dashboard', [
                    'message' => 'Candidate profile not found'
                ]);
            }
            
            return Inertia::render('AplicationForm', [
                'offer' => $offerWithCompany,
            ]);
        }
        
        // Salida por defecto para evitar warnings de return no esperado //
         return Inertia::render('dashboard', [
             'message' => 'Offer not found'
         ]);
    }
}