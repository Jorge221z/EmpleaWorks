<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

/**
 * Modelo Offer - Gestiona las ofertas de trabajo publicadas por empresas.
 * 
 * Contiene toda la información relacionada con una oferta laboral, incluyendo
 * sus requisitos, descripción y fechas límite. Establece las relaciones con 
 * los usuarios que la publican y los candidatos que aplican.
 */
class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'degree',
        'email',
        'contract_type',
        'job_location',
        'closing_date',
        'user_id',
    ];

    /**
     * Atributos que deben convertirse a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'closing_date' => 'date',
    ];

    /**
     * Obtiene el usuario empresa que creó esta oferta.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtiene los candidatos que han aplicado a esta oferta.
     * Utiliza la tabla pivote user_offer para rastrear las aplicaciones.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function candidates()
    {
        return $this->belongsToMany(User::class, 'user_offer', 'offer_id', 'user_id')
            ->whereHas('candidate')
            ->withTimestamps();
    }

    /**
     * Obtiene el perfil de empresa asociado a esta oferta a través del usuario.
     *
     * @return \App\Models\Company|null
     */
    public function company()
    {
        if ($this->user) {
            return $this->user->company;
        }
        return null;
    }

    /**
     * Obtiene los detalles de la empresa.
     *
     * @return array|null Detalles de la empresa
     */
    public function getCompanyInfo()
    {
        if ($this->user) {
            return $this->user->getCompanyDetails();
        }
        return null;
    }

    /**
     * Añade los datos de candidato a esta oferta.
     *
     * @param User $user Usuario candidato
     * @return bool Estado de éxito
     */
    public function addCandidate(User $user)
    {
        return $user->applyToOffer($this);
    }

    /**
     * Obtiene los candidatos que han guardado esta oferta.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function savedByUsers()
    {
        return $this->belongsToMany(User::class, 'saved_offers', 'offer_id', 'user_id')
            ->whereHas('candidate')
            ->withTimestamps();
    }

    /**
     * Verifica si esta oferta está guardada por un usuario específico.
     *
     * @param User $user Usuario a verificar
     * @return bool Indica si la oferta está guardada por el usuario
     */
    public function isSavedBy(User $user)
    {
        return $this->savedByUsers()->where('users.id', $user->id)->exists();
    }
}
