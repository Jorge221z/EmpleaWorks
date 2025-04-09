<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{

    use HasFactory;

    protected $fillable = [
        'user_id',
        'address',
        'web_link',
    ];

    /**
     * Get the user that owns the company.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the offers for the company.
     */
    public function offers()
    {
        return $this->hasManyThrough(Offer::class, User::class);
    }

    /**
     * Accede a los datos del usuario combinados con los de la empresa.
     */
    public function getNameAttribute()
    {
        return $this->user->name;
    }

    public function getEmailAttribute()
    {
        return $this->user->email;
    }

    public function getDescriptionAttribute()
    {
        return $this->user->description;
    }

    public function getImageAttribute()
    {
        return $this->user->image;
    }
}