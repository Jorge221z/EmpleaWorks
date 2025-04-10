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
            $companyOffers = $user->offers()->with('company')->get();
        }
        
        return Inertia::render('companyDashboard', [
            'companyOffers' => $companyOffers
        ]);
    }
}
