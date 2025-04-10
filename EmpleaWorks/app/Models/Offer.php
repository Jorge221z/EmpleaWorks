<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    protected $casts = [
        'closing_date' => 'date',
    ];

    /**
     * Get the user/company that created this offer.
     */
    public function user()
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * Get the candidates who applied to this offer.
     */
    public function candidates()
    {
        return $this->belongsToMany(User::class, 'candidate_offer', 'offer_id', 'user_id')
                    ->whereHas('candidate')
                    ->withTimestamps();
    }

    /**
     * Get the company related to this offer (via user).
     */
    public function company()
    {
        return $this->hasOneThrough(
            Company::class,
            User::class,
            'id', // Clave externa en User
            'user_id', // Clave externa en Company
            'user_id', // Clave local en Offer
            'id' // Clave local en User
        );
    }
}