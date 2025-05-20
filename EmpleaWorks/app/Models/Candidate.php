<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Candidate - Gestiona la información específica del perfil de candidato.
 * 
 * Almacena información complementaria para usuarios con rol de candidato,
 * como su apellido y CV. Actúa como una extensión del modelo User.
 */
class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'surname',
        'cv',
    ];

    /**
     * Obtiene el usuario asociado al perfil de candidato.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Métodos de acceso a la información del usuario asociado.
     */
    
    /**
     * Obtiene el nombre del candidato desde el usuario asociado.
     * 
     * @return string
     */
    public function getName()
    {
        return $this->user->name;
    }

    /**
     * Obtiene el email del candidato desde el usuario asociado.
     * 
     * @return string
     */
    public function getEmail()
    {
        return $this->user->email;
    }

    /**
     * Obtiene la descripción del candidato desde el usuario asociado.
     * 
     * @return string|null
     */
    public function getDescription()
    {
        return $this->user->description;
    }

    /**
     * Obtiene la imagen del perfil del candidato desde el usuario asociado.
     * 
     * @return string|null
     */
    public function getImage()
    {
        return $this->user->image;
    }

    /**
     * Accede a las ofertas a las que ha aplicado el candidato a través del usuario.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function appliedOffers()
    {
        return $this->user->appliedOffers();
    }

    /**
     * Aplica a una oferta laboral
     * 
     * @param Offer $offer Oferta a la que se desea aplicar
     * @return mixed
     */
    public function applyToOffer(Offer $offer)
    {
        return $this->user->applyToOffer($offer);
    }
}
