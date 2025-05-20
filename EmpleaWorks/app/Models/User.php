<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Offer;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\VerifyEmail;
use Laravel\Sanctum\HasApiTokens;

/**
 * Modelo User - Gestiona los usuarios del sistema.
 * 
 * Entidad central que maneja la autenticación, roles y perfiles de usuario.
 * Implementa verificación de email y puede tener perfiles específicos según su rol
 * (candidato o empresa). Gestiona también las relaciones con ofertas de trabajo.
 */
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'image',
        'description',
        'google_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Obtiene el rol asignado al usuario.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Obtiene el perfil de candidato asociado al usuario.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function candidate()
    {
        return $this->hasOne(Candidate::class);
    }

    /**
     * Obtiene el perfil de empresa asociado al usuario.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function company()
    {
        return $this->hasOne(Company::class);
    }

    /**
     * Obtiene las ofertas creadas por este usuario (solo si es empresa).
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function offers()
    {
        return $this->hasMany(Offer::class);
    }

    /**
     * Obtiene las ofertas a las que este usuario ha aplicado (como candidato).
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function appliedOffers()
    {
        // Utiliza la tabla pivote user_offer para obtener qué ofertas ha aplicado un candidato
        return $this->belongsToMany(Offer::class, 'user_offer', 'user_id', 'offer_id')
            ->withTimestamps();
    }

    /**
     * Determina si el usuario es una empresa.
     * 
     * @return bool
     */
    public function isCompany()
    {
        return $this->role_id === 2;
    }

    /**
     * Determina si el usuario es un candidato.
     * 
     * @return bool
     */
    public function isCandidate()
    {
        return $this->role_id === 1;
    }

    /**
     * Obtiene los detalles de empresa si el usuario es una empresa.
     * 
     * @return array|null Detalles de la empresa o null si el usuario no es empresa
     */
    public function getCompanyDetails()
    {
        if (!$this->isCompany() || !$this->company) {
            return null;
        }

        return [
            'name' => $this->name,
            'email' => $this->email,
            'description' => $this->description,
            'image' => $this->image,
            'address' => $this->company->address,
            'web_link' => $this->company->web_link,
        ];
    }

    /**
     * Obtiene los detalles de candidato si el usuario es un candidato.
     * 
     * @return array|null Detalles del candidato o null si el usuario no es candidato
     */
    public function getCandidateDetails()
    {
        if (!$this->isCandidate() || !$this->candidate) {
            return null;
        }

        return [
            'name' => $this->name,
            'surname' => $this->candidate->surname,
            'email' => $this->email,
            'description' => $this->description,
            'image' => $this->image,
            'cv' => $this->candidate->cv,
        ];
    }

    /**
     * Aplica a una oferta (para candidatos).
     * 
     * @param Offer $offer La oferta a la que aplicar
     * @return bool Estado de éxito de la aplicación
     */
    public function applyToOffer(Offer $offer)
    {
        if (!$this->isCandidate()) {
            return false;
        }

        // Previene aplicaciones duplicadas
        if (!$this->appliedOffers->contains($offer->id)) {
            $this->appliedOffers()->attach($offer->id);
        }

        return true;
    }

    /**
     * Crea una nueva oferta de trabajo (solo para empresas).
     * 
     * @param array $offerData Los datos para la nueva oferta
     * @return Offer|null La oferta creada o null si el usuario no es empresa
     */
    public function createOffer(array $offerData)
    {
        if (!$this->isCompany()) {
            return null;
        }

        return $this->offers()->create($offerData);
    }

    /**
     * Obtiene todas las ofertas creadas por esta empresa.
     * 
     * @return \Illuminate\Database\Eloquent\Collection|null
     */
    public function getCompanyOffers()
    {
        if (!$this->isCompany()) {
            return null;
        }

        return $this->offers;
    }

    /**
     * Obtiene todas las ofertas a las que este candidato ha aplicado.
     * 
     * @return \Illuminate\Database\Eloquent\Collection|null
     */
    public function getCandidateApplications()
    {
        if (!$this->isCandidate()) {
            return null;
        }

        return $this->appliedOffers;
    }

    /**
     * Envía notificación de verificación de email personalizada.
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmail());
    }

    /**
     * Obtiene las ofertas que este usuario ha guardado.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function savedOffers()
    {
        return $this->belongsToMany(Offer::class, 'saved_offers', 'user_id', 'offer_id')
            ->withTimestamps();
    }

    /**
     * Guarda una oferta.
     * 
     * @param Offer $offer La oferta a guardar
     * @return bool Estado de éxito de la operación de guardado
     */
    public function saveOffer(Offer $offer)
    {
        if (!$this->isCandidate()) {
            return false;
        }

        // Previene guardados duplicados
        if (!$this->savedOffers->contains($offer->id)) {
            $this->savedOffers()->attach($offer->id);
            return true;
        }
    
        return false;
    }

    /**
     * Elimina una oferta guardada.
     * 
     * @param Offer $offer La oferta a eliminar de guardados
     * @return bool Estado de éxito de la operación
     */
    public function unsaveOffer(Offer $offer)
    {
        if (!$this->isCandidate()) {
            return false;
        }

        $this->savedOffers()->detach($offer->id);
        return true;
    }

    /**
     * Verifica si una oferta está guardada por este usuario.
     * 
     * @param int $offerId El ID de la oferta a verificar
     * @return bool Indica si la oferta está guardada
     */
    public function hasSavedOffer($offerId)
    {
        return $this->savedOffers()->where('offers.id', $offerId)->exists();
    }

    /**
     * Obtiene todas las ofertas que este candidato ha guardado.
     * 
     * @return \Illuminate\Database\Eloquent\Collection|null
     */
    public function getCandidateSavedOffers()
    {
        if (!$this->isCandidate()) {
            return null;
        }

        return $this->savedOffers;
    }
}
