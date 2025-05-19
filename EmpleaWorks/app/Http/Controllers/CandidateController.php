<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\OfferController;
use App\Models\Offer;

class CandidateController extends Controller
{
    /** @var OfferController Instancia del controlador de ofertas */
    protected $offerController;

    /**
     * Inicializa el controlador con sus dependencias
     */
    public function __construct(OfferController $offerController)
    {
        $this->offerController = $offerController;
    }

    /**
     * Muestra el panel principal del candidato con sus ofertas aplicadas y guardadas
     *
     * @return \Inertia\Response Vista del dashboard con los datos del candidato
     */
    public function dashboard()
    {
        // Obtiene el usuario autenticado
        $user = Auth::user();

        // Inicializa los arrays de ofertas
        $candidateOffers = [];
        $savedOffers = [];

        if ($user && $user->isCandidate()) {
            $candidateOffers = $user->appliedOffers()
                ->with('user.company')
                ->get()
                ->map(function ($offer) {
                    $companyData = null;
                    if ($offer->user && $offer->user->company) {
                        // Estructura los datos de la empresa
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
        }

        // Prepara los mensajes flash para la vista
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
     * Muestra el formulario de solicitud para una oferta específica
     *
     * @param Offer $offer Oferta a la que se desea aplicar
     * @return \Inertia\Response Vista del formulario o mensaje de error
     */
    public function showForm(Offer $offer)
    {
        // Verifica si la oferta existe y obtiene los detalles completos
        if ($offer->exists) {
            $offerWithCompany = $this->offerController->getOffer($offer);

            $user = Auth::user();

            // Verifica si el usuario tiene perfil de candidato
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

    /**
     * Recupera y muestra el listado de ofertas a las que el candidato ha aplicado
     *
     * @return \Inertia\Response Vista con las aplicaciones del candidato
     */
    public function applications()
    {
        $user = Auth::user();
        $candidateOffers = $user->appliedOffers()->with('user.company')->get()
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

        return Inertia::render('ApplicationsView', [
            'candidateOffers' => $candidateOffers,
        ]);
    }

    /**
     * Recupera y muestra el listado de ofertas guardadas por el candidato
     *
     * @return \Inertia\Response Vista con las ofertas guardadas
     */
    public function savedOffers()
    {
        $user = Auth::user();
        $savedOffers = $user->savedOffers()->with('user.company')->get();

        return Inertia::render('SavedOffersView', [
            'savedOffers' => $savedOffers,
        ]);
    }

    /**
     * Verifica si el candidato ha aplicado a una oferta específica
     *
     * @param Offer $offer Oferta a verificar
     * @return \Illuminate\Http\JsonResponse Estado de la aplicación
     */
    public function checkApplication(Offer $offer)
    {
        $user = Auth::user();

        // Verifica si el usuario es candidato
        if (!$user || !$user->isCandidate()) {
            return response()->json(['hasApplied' => false]);
        }

        // Comprueba si existe una aplicación para esta oferta
        $hasApplied = $user->appliedOffers()->where('offers.id', $offer->id)->exists();

        return response()->json(['hasApplied' => $hasApplied]);
    }
}
