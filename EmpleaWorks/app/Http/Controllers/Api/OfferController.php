<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class OfferController extends Controller
{
    /**
     * Crear una nueva oferta.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->isCompany()) {
            return response()->json(['error' => 'Solo las empresas pueden crear ofertas.'], 403);
        }

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:offers,name',
                'description' => 'required|string',
                'category' => 'required|string|max:255',
                'degree' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'contract_type' => 'required|string|max:255',
                'job_location' => 'required|string|max:255',
                'closing_date' => 'required|date|after:today',
            ]);

            $validated['user_id'] = $user->id;
            $offer = Offer::create($validated);

            return response()->json(['message' => 'Oferta creada con éxito.', 'offer' => $offer], 201);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error al crear oferta: ' . $e->getMessage());
            return response()->json(['error' => 'Error al crear la oferta.'], 500);
        }
    }

    /**
     * Listar todas las ofertas.
     */
    public function list()
    {
        $offers = Offer::with(['user.company'])->get();

        $formattedOffers = $offers->map(function ($offer) {
            $companyData = $offer->user && $offer->user->company ? [
                'id' => $offer->user->company->id,
                'name' => $offer->user->name,
                'email' => $offer->user->email,
                'logo' => $offer->user->image,
                'description' => $offer->user->description,
                'address' => $offer->user->company->address,
                'web_link' => $offer->user->company->web_link,
            ] : null;

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
                'company' => $companyData,
            ];
        });

        return response()->json($formattedOffers, 200);
    }

    /**
     * Obtener una oferta específica.
     */
    public function getOffer(Offer $offer)
    {
        $offer->load('user.company');

        $companyData = $offer->user && $offer->user->company ? [
            'id' => $offer->user->company->id,
            'name' => $offer->user->name,
            'email' => $offer->user->email,
            'logo' => $offer->user->image,
            'description' => $offer->user->description,
            'address' => $offer->user->company->address,
            'web_link' => $offer->user->company->web_link,
        ] : null;

        $formattedOffer = [
            'id' => $offer->id,
            'name' => $offer->name,
            'description' => $offer->description,
            'category' => $offer->category,
            'degree' => $offer->degree,
            'email' => $offer->email,
            'contract_type' => $offer->contract_type,
            'job_location' => $offer->job_location,
            'closing_date' => $offer->closing_date,
            'company' => $companyData,
        ];

        return response()->json($formattedOffer, 200);
    }

    /**
     * Aplicar a una oferta.
     */
    public function apply(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Debes iniciar sesión para aplicar.'], 401);
        }

        if (!$user->isCandidate()) {
            return response()->json(['error' => 'Solo los candidatos pueden aplicar.'], 403);
        }

        try {
            $validated = $request->validate([
                'phone' => ['required', 'string', 'min:7', 'max:20', 'regex:/^\+?[0-9\s\-()]+$/'],
                'email' => 'required|email|max:255',
                'cl' => 'required|string|max:1000',
                'offer_id' => 'required|integer|exists:offers,id',
            ]);

            $offer = Offer::where('id', $validated['offer_id'])->firstOrFail();

            if ($offer->candidates()->where('users.id', $user->id)->exists()) {
                return response()->json(['error' => 'Ya has aplicado a esta oferta.'], 409);
            }

            $candidate = $user->candidate;
            if (!$candidate || !$candidate->cv || !Storage::disk('public')->exists($candidate->cv)) {
                return response()->json(['error' => 'Debes subir un CV antes de aplicar.'], 400);
            }

            $user->applyToOffer($offer);

            return response()->json(['message' => 'Aplicación enviada con éxito.'], 200);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error al aplicar a la oferta: ' . $e->getMessage());
            return response()->json(['error' => 'Error al aplicar a la oferta.'], 500);
        }
    }

    /**
     * Actualizar una oferta.
     */
    public function update(Request $request, Offer $offer)
    {
        $user = Auth::user();

        if (!$user || $offer->user_id !== $user->id) {
            return response()->json(['error' => 'No puedes actualizar esta oferta.'], 403);
        }

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:offers,name,' . $offer->id,
                'description' => 'required|string',
                'category' => 'required|string|max:255',
                'degree' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'contract_type' => 'required|string|max:255',
                'job_location' => 'required|string|max:255',
                'closing_date' => 'required|date',
            ]);

            $offer->update($validated);

            return response()->json(['message' => 'Oferta actualizada con éxito.', 'offer' => $offer], 200);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error al actualizar oferta: ' . $e->getMessage());
            return response()->json(['error' => 'Error al actualizar la oferta.'], 500);
        }
    }

    /**
     * Eliminar una oferta.
     */
    public function destroy(Offer $offer)
    {
        $user = Auth::user();

        if (!$user || $offer->user_id !== $user->id) {
            return response()->json(['error' => 'No puedes eliminar esta oferta.'], 403);
        }

        try {
            $offer->delete();
            return response()->json(['message' => 'Oferta eliminada con éxito.'], 200);
        } catch (\Exception $e) {
            Log::error('Error al eliminar oferta: ' . $e->getMessage());
            return response()->json(['error' => 'Error al eliminar la oferta.'], 500);
        }
    }
}