<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Offer;
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

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
}
