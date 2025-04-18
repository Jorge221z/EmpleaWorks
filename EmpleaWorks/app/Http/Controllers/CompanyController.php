<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
    if ($user && $user->isCompany()) {
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
        'companyOffers' => $companyOffers
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
            'Technology', 'Healthcare', 'Education', 'Finance', 
            'Marketing', 'Sales', 'Customer Service', 'Administration',
            'Engineering', 'Human Resources', 'Legal', 'Other'
        ];
        
        $contractTypes = [
            'Full-time', 'Part-time', 'Contract', 'Temporary', 
            'Internship', 'Remote', 'Hybrid'
        ];
        
        // Renderizar el formulario de creación de oferta
        return Inertia::render('CreateJobOffer', [
            'categories' => $categories,
            'contractTypes' => $contractTypes,
            'company' => $user->company
        ]);
    }
}
