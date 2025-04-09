<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'surname',
        'cv',
    ];

    /**
     * Get the user that owns the candidate profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the offers applied to by this candidate.
     */
    public function appliedOffers()
    {
        return $this->belongsToMany(Offer::class, 'candidate_offer')
                    ->withTimestamps();
    }

    /**
     * Accede a los datos del usuario combinados con los del candidato.
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