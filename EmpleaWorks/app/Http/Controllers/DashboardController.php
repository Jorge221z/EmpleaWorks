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

        // Preparar categorías y tipos de contrato para los filtros
        $categories = [
            __('messages.job_categories.informatics'),
            __('messages.job_categories.administration'),
            __('messages.job_categories.physical_activities'),
            __('messages.job_categories.graphic_arts'),
            __('messages.job_categories.commerce_marketing'),
            __('messages.job_categories.electricity_electronics'),
            __('messages.job_categories.aesthetics'),
            __('messages.job_categories.image_sound'),
            __('messages.job_categories.wood'),
            __('messages.job_categories.maritime_fishing'),
            __('messages.job_categories.healthcare'),
            __('messages.job_categories.security_environment'),
            __('messages.job_categories.other')
        ];
        
        $contractTypes = [
            __('messages.contract_types.permanent'),
            __('messages.contract_types.temporary'),
            __('messages.contract_types.alternating_training'),
            __('messages.contract_types.professional_practice'),
            __('messages.contract_types.remote')
        ];

        $flash = [
            'success' => session('success'),
            'error' => session('error')
        ];

        return Inertia::render('dashboard', [
            'offers' => $offers,
            'categories' => $categories,
            'contractTypes' => $contractTypes,
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
}