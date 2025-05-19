<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CompanyController extends Controller
{
    /**
     * Muestra el panel de control principal de la empresa
     *
     * @return \Inertia\Response Panel de control con ofertas y estadísticas
     */
    public function dashboard()
    {
        // Obtiene el usuario autenticado actual
        $user = Auth::user();

        // Inicializa las variables para almacenar datos
        $companyOffers = [];
        $totalApplicants = 0;

        if ($user && $user->isCompany()) {
            // Recupera las ofertas activas de la empresa
            $offers = $user->offers()->get();

            // Calcula el total de candidatos para todas las ofertas
            foreach ($offers as $offer) {
                $applicantsCount = $offer->candidates()->count();
                $totalApplicants += $applicantsCount;
            }

            // Formatea las ofertas para la vista
            $companyOffers = $user->offers()->get()->map(function ($offer) use ($user) {
                return [
                    'id' => $offer->id,
                    'name' => $offer->name,
                    'description' => $offer->description,
                    'category' => $offer->category,
                    'degree' => $offer->degree,
                    'email' => $offer->email,
                    'contract_type' => $offer->contract_type,
                    'job_location' => $offer->job_location,
                    'closing_date' => $offer->closing_date,
                    'created_at' => $offer->created_at,
                    'updated_at' => $offer->updated_at,
                    'company' => [
                        'id' => $user->company?->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'logo' => $user->image,
                        'description' => $user->description,
                        'address' => $user->company?->address,
                        'web_link' => $user->company?->web_link,
                        'created_at' => $user->company?->created_at,
                        'updated_at' => $user->company?->updated_at
                    ]
                ];
            });
        }

        return Inertia::render('companyDashboard', [
            'companyOffers' => $companyOffers,
            'totalApplicants' => $totalApplicants
        ]);
    }

    /**
     * Muestra el formulario para crear una nueva oferta de trabajo
     *
     * @return \Inertia\Response Vista del formulario con opciones predefinidas
     */
    public function createJobForm()
    {
        // Obtiene el usuario empresa actual
        $user = Auth::user();

        // Define las categorías laborales disponibles
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

        // Define los tipos de contrato disponibles
        $contractTypes = [
            __('messages.contract_types.permanent'),
            __('messages.contract_types.temporary'),
            __('messages.contract_types.alternating_training'),
            __('messages.contract_types.professional_practice'),
            __('messages.contract_types.remote')
        ];

        return Inertia::render('CreateJobOffer', [
            'categories' => $categories,
            'contractTypes' => $contractTypes,
            'company' => $user->company
        ]);
    }

    /**
     * Muestra el formulario para editar una oferta existente
     *
     * @param Offer $offer Oferta a editar
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse Vista del formulario o redirección
     */
    public function editJobForm(Offer $offer)
    {
        // Obtiene el usuario empresa actual
        $user = Auth::user();

        if ($offer->user_id !== $user->id) {
            return redirect()->route('company.dashboard')
                ->with('error', __('messages.edit_only_own_listings'));
        }

        // Define las categorías laborales disponibles
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

        // Define los tipos de contrato disponibles
        $contractTypes = [
            __('messages.contract_types.permanent'),
            __('messages.contract_types.temporary'),
            __('messages.contract_types.alternating_training'),
            __('messages.contract_types.professional_practice'),
            __('messages.contract_types.remote')
        ];

        return Inertia::render('EditJobOffer', [
            'offer' => $offer,
            'categories' => $categories,
            'contractTypes' => $contractTypes,
            'company' => $user->company
        ]);
    }

    /**
     * Muestra los candidatos para las ofertas de la empresa
     *
     * @return \Inertia\Response Vista con listado de candidatos por oferta
     */
    public function applicants()
    {
        $user = Auth::user();
        $jobsWithApplicants = [];

        if ($user && $user->isCompany()) {
            // Recupera ofertas con sus candidatos y CVs
            $offers = $user->offers()->with(['candidates' => function($query) {
                $query->with(['candidate' => function($q) {
                    $q->select('user_id', 'cv');
                }]);
            }])->get();

            // Procesa cada oferta y sus candidatos
            foreach ($offers as $offer) {
                $applicants = [];

                // Formatear los datos de candidatos
                foreach ($offer->candidates as $candidateUser) {
                    $cv = null;
                    if ($candidateUser->candidate) {
                        $cv = $candidateUser->candidate->cv;
                    }

                    $applicants[] = [
                        'id' => $candidateUser->id,
                        'name' => $candidateUser->name,
                        'email' => $candidateUser->email,
                        'image' => $candidateUser->image,
                        'cv' => $cv,
                    ];
                }

                // Agregar oferta con sus candidatos al array
                $jobsWithApplicants[] = [
                    'id' => $offer->id,
                    'name' => $offer->name,
                    'category' => $offer->category,
                    'closing_date' => $offer->closing_date,
                    'applicants' => $applicants,
                    'applicants_count' => count($applicants)
                ];
            }
        }

        return Inertia::render('CompanyApplicants', [
            'jobsWithApplicants' => $jobsWithApplicants
        ]);
    }

    /**
     * Elimina ofertas cerradas con más de 10 días de antigüedad
     *
     * @param mixed $output Canal de salida para logs
     * @return int Número de ofertas eliminadas
     */
    public function deleteOldClosedOffers($output = null)
    {
        // Calcula la fecha límite para el borrado
        $thresholdDate = Carbon::now()->subDays(10)->startOfDay();

        // Registra las ofertas que serán eliminadas
        $offers = Offer::whereDate('closing_date', '<', $thresholdDate)->get();

        foreach ($offers as $offer) {
            $msg = "Borrando oferta ID: {$offer->id}, título: {$offer->name}";
            Log::info($msg);
            if ($output) {
                $output->info($msg);
            }
        }

        return Offer::whereDate('closing_date', '<', $thresholdDate)->delete();
    }
}
