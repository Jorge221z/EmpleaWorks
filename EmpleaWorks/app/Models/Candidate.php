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
     * Get user information through accessor methods
     */
    public function getName()
    {
        return $this->user->name;
    }

    public function getEmail()
    {
        return $this->user->email;
    }

    public function getDescription()
    {
        return $this->user->description;
    }

    public function getImage()
    {
        return $this->user->image;
    }

    /**
     * Delegate access to applied offers through the user
     */
    public function appliedOffers()
    {
        return $this->user->appliedOffers();
    }

    /**
     * Delegate the apply to offer functionality to user
     */
    public function applyToOffer(Offer $offer)
    {
        return $this->user->applyToOffer($offer);
    }
}
