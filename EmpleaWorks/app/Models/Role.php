<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Role - Gestiona los roles de usuario en el sistema.
 * 
 * Define los diferentes roles disponibles (candidato, empresa)
 * que determinan los permisos y funcionalidades accesibles para cada usuario.
 */
class Role extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /**
     * Obtiene los usuarios que tienen asignado este rol.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
