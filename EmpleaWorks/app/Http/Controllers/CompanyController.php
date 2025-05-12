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
     * Display the company dashboard.
     *
     * @return \Inertia\Response
     */
    public function dashboard()
    {
        // Usar Auth::user() en lugar de auth()->user()
        $user = Auth::user();
        
        // Verificar si el usuario existe antes de intentar acceder a sus ofertas
        $companyOffers = [];
        $totalApplicants = 0; // Variable para contar solicitantes

        if ($user && $user->isCompany()) {
            // Obtener las ofertas creadas por la empresa del usuario actual
            $offers = $user->offers()->get();
            
            // Calcular el total de aplicantes
            foreach ($offers as $offer) {
                $applicantsCount = $offer->candidates()->count();
                $totalApplicants += $applicantsCount;
            }

            // Obtener las ofertas creadas por la empresa del usuario actual
            $companyOffers = $user->offers()->get()->map(function ($offer) use ($user) {
                // Formatear datos para la vista
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
     * Display the form to create a new job offer.
     *
     * @return \Inertia\Response
     */
    public function createJobForm()
    {
        // Verificar si el usuario está autenticado y es una empresa
        $user = Auth::user();

        // Preparar categorías y tipos de contrato para el formulario
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
        
        // Renderizar el formulario de creación de oferta
        return Inertia::render('CreateJobOffer', [
            'categories' => $categories,
            'contractTypes' => $contractTypes,
            'company' => $user->company
        ]);
    }

    /**
     * Display the form to edit an existing job offer.
     *
     * @param  \App\Models\Offer  $offer
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function editJobForm(Offer $offer)
    {
        // Verificar que la oferta pertenece a la empresa actual
        $user = Auth::user();
        
        if ($offer->user_id !== $user->id) {
            return redirect()->route('company.dashboard')
                ->with('error', __('messages.edit_only_own_listings'));
        }
        
        // Preparar categorías y tipos de contrato para el formulario (igual que en createJobForm)
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
        
        // Renderizar el formulario de edición con los datos actuales de la oferta
        return Inertia::render('EditJobOffer', [
            'offer' => $offer,
            'categories' => $categories,
            'contractTypes' => $contractTypes,
            'company' => $user->company
        ]);
    }

    /**
    * Display the applicants for company's job offers.
    *
    * @return \Inertia\Response
    */
    public function applicants()
    {
        $user = Auth::user();
    
        // Estructura para almacenar ofertas con sus candidatos
        $jobsWithApplicants = [];
    
        if ($user && $user->isCompany()) {
            // Obtener las ofertas creadas por la empresa
            $offers = $user->offers()->with(['candidates' => function($query) {
                // Cargar candidatos con sus datos de usuario y CV
                $query->with(['candidate' => function($q) {
                    $q->select('user_id', 'cv');
                }]);
            }])->get();
        
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
     * Delete job offers that have been closed for more than 10 days.
     *
     * @param  mixed  $output
     * @return int Number of deleted offers
     */
    public function deleteOldClosedOffers($output = null)
    {
        $thresholdDate = Carbon::now()->subDays(10)->startOfDay();

        // Recuperar las ofertas a borrar
        $offers = Offer::whereDate('closing_date', '<', $thresholdDate)->get();

        foreach ($offers as $offer) {
            $msg = "Borrando oferta ID: {$offer->id}, título: {$offer->name}";
            Log::info($msg);
            if ($output) {
                $output->info($msg);
            }
        }

        // Borrar las ofertas
        $deleted = Offer::whereDate('closing_date', '<', $thresholdDate)->delete();

        return $deleted;
    }
}
