<?php

namespace App\Http\Controllers;

use App\Http\Controllers\OfferController;
use App\Models\Offer;
use Inertia\Inertia;

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
        
        return Inertia::render('dashboard', [
            'offers' => $offers
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
}