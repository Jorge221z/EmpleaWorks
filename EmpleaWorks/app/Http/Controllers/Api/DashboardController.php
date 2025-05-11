<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\OfferController;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    protected $offerController;

    public function __construct(OfferController $offerController)
    {
        $this->offerController = $offerController;
    }

    /**
     * Obtener el dashboard con ofertas.
     */
    public function index()
    {
        try {
            $offers = $this->offerController->list();
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

            return response()->json([
                'offers' => $offers,
                'categories' => $categories,
                'contractTypes' => $contractTypes,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error en dashboard index: ' . $e->getMessage());
            return response()->json(['error' => 'Error al obtener el dashboard.'], 500);
        }
    }

    /**
     * Obtener una oferta específica.
     */
    public function showOffer(Offer $offer)
    {
        try {
            $offerWithCompany = $this->offerController->getOffer($offer);
            return response()->json(['offer' => $offerWithCompany], 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener oferta: ' . $e->getMessage());
            return response()->json(['error' => 'Error al obtener la oferta.'], 500);
        }
    }
}