<?php

namespace App\Http\Controllers;

use App\Http\Controllers\OfferController;
use App\Models\Offer;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /** @var OfferController Controlador para la gestión de ofertas */
    protected $offerController;

    /**
     * Constructor del controlador
     *
     * @param OfferController $offerController Instancia del controlador de ofertas
     */
    public function __construct(OfferController $offerController)
    {
        $this->offerController = $offerController;
    }

    /**
     * Muestra el dashboard con el listado de ofertas y opciones de filtrado
     *
     * @return \Inertia\Response Vista del dashboard con ofertas y filtros
     */
    public function index()
    {
        // Recupera el listado completo de ofertas
        $offers = $this->offerController->list();

        // Define las categorías disponibles para el filtrado
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

        // Define los tipos de contrato disponibles para el filtrado
        $contractTypes = [
            __('messages.contract_types.permanent'),
            __('messages.contract_types.temporary'),
            __('messages.contract_types.alternating_training'),
            __('messages.contract_types.professional_practice'),
            __('messages.contract_types.remote')
        ];

        // Prepara los mensajes flash para la vista
        $flash = [
            'success' => session('success'),
            'error' => session('error')
        ];

        return Inertia::render('dashboard', [
            'offers' => $offers,
            'categories' => $categories,
            'contractTypes' => $contractTypes,
            'flash' => $flash
        ]);
    }

    /**
     * Muestra los detalles de una oferta específica
     *
     * @param Offer $offer Oferta a mostrar
     * @return \Inertia\Response Vista con los detalles de la oferta
     */
    public function showOffer(Offer $offer)
    {
        // Recupera la oferta con los datos de la empresa
        $offerWithCompany = $this->offerController->getOffer($offer);

        return Inertia::render('showOffer', [
            'offer' => $offerWithCompany
        ]);
    }
}
