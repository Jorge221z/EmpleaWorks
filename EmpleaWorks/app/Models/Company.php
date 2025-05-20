<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Company - Gestiona la información específica del perfil de empresa.
 * 
 * Almacena información complementaria para usuarios con rol de empresa,
 * como dirección y enlace web. Actúa como una extensión del modelo User.
 */
class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'address',
        'web_link',
    ];

    /**
     * Obtiene el usuario asociado al perfil de empresa.
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
     * Obtiene el nombre de la empresa desde el usuario asociado.
     * 
     * @return string
     */
    public function getName()
    {
        return $this->user->name;
    }

    /**
     * Obtiene el email de la empresa desde el usuario asociado.
     * 
     * @return string
     */
    public function getEmail()
    {
        return $this->user->email;
    }

    /**
     * Obtiene la descripción de la empresa desde el usuario asociado.
     * 
     * @return string|null
     */
    public function getDescription()
    {
        return $this->user->description;
    }

    /**
     * Obtiene la imagen del perfil de la empresa desde el usuario asociado.
     * 
     * @return string|null
     */
    public function getImage()
    {
        return $this->user->image;
    }

    /**
     * Accede a las ofertas de trabajo publicadas por la empresa
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function offers()
    {
        return $this->user->offers();
    }
}
