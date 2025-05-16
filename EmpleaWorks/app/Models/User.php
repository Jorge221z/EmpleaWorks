<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Offer;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\VerifyEmail;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'image',
        'description',
        'google_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's role.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the candidate profile associated with the user.
     */
    public function candidate()
    {
        return $this->hasOne(Candidate::class);
    }

    /**
     * Get the company profile associated with the user.
     */
    public function company()
    {
        return $this->hasOne(Company::class);
    }

    /**
     * Get the offers created by this user (only if user is a company).
     */
    public function offers()
    {
        // Only company users should have associated offers through this relation
        return $this->hasMany(Offer::class);
    }

    /**
     * Get the offers this user has applied to (as a candidate).
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function appliedOffers()
    {
        // This uses the user_offer pivot table to track which offers a candidate has applied to
        return $this->belongsToMany(Offer::class, 'user_offer', 'user_id', 'offer_id')
            ->withTimestamps();
    }

    /**
     * Determine if the user is a company.
     */
    public function isCompany()
    {
        return $this->role_id === 2; // role_id = 2 represents companies
    }

    /**
     * Determine if the user is a candidate.
     */
    public function isCandidate()
    {
        return $this->role_id === 1; // role_id = 1 represents candidates
    }

    /**
     * Get company details if user is a company.
     * 
     * @return array|null Company details or null if user isn't a company
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
     * Get candidate details if user is a candidate.
     * 
     * @return array|null Candidate details or null if user isn't a candidate
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
     * Apply to an offer (for candidates)
     * 
     * @param Offer $offer The offer to apply to
     * @return bool Success status of the application
     */
    public function applyToOffer(Offer $offer)
    {
        if (!$this->isCandidate()) {
            return false;
        }

        // Prevent duplicated applications
        if (!$this->appliedOffers->contains($offer->id)) {
            $this->appliedOffers()->attach($offer->id);
        }

        return true;
    }

    /**
     * Create a new job offer (only for companies)
     * 
     * @param array $offerData The data for the new offer
     * @return Offer|null The created offer or null if user is not a company
     */
    public function createOffer(array $offerData)
    {
        if (!$this->isCompany()) {
            return null;
        }

        return $this->offers()->create($offerData);
    }

    /**
     * Get all offers created by this company.
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
     * Get all offers this candidate has applied to.
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
     * Send email verification notification.
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmail());
    }

    /**
    * Get the offers this user has saved (as a candidate).
    * 
    * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
    */
    public function savedOffers()
    {
        return $this->belongsToMany(Offer::class, 'saved_offers', 'user_id', 'offer_id')
            ->withTimestamps();
    }

    /**
    * Save an offer for later (for candidates)
    * 
    * @param Offer $offer The offer to save
    * @return bool Success status of the save operation
    */
    public function saveOffer(Offer $offer)
    {
        if (!$this->isCandidate()) {
            return false;
        }

        // Prevent duplicated saves
        if (!$this->savedOffers->contains($offer->id)) {
            $this->savedOffers()->attach($offer->id);
            return true;
        }
    
        return false;
    }

    /**
    * Remove a saved offer (for candidates)
    * 
    * @param Offer $offer The offer to unsave
    * @return bool Success status of the unsave operation
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
    * Check if an offer is saved by this user
    * 
    * @param int $offerId The ID of the offer to check
    * @return bool Whether the offer is saved
    */
    public function hasSavedOffer($offerId)
    {
        return $this->savedOffers()->where('offers.id', $offerId)->exists();
    }

    /**
    * Get all offers this candidate has saved.
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
