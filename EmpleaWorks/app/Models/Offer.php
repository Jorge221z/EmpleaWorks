<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
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
     * Get the company user that created this offer.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the candidates who applied to this offer.
     */
    public function candidates()
    {
        // This references the user_offer pivot table to track applications
        return $this->belongsToMany(User::class, 'user_offer', 'offer_id', 'user_id')
            ->whereHas('candidate')  // Only return users who have candidate profiles
            ->withTimestamps();
    }

    /**
     * Get the company associated with this offer through the user.
     */
    public function company()
    {
        if ($this->user) {
            return $this->user->company;
        }
        return null;
    }

    /**
     * Get company details for display purposes.
     * 
     * @return array|null Company details
     */
    public function getCompanyInfo()
    {
        if ($this->user) {
            return $this->user->getCompanyDetails();
        }
        return null;
    }

    /**
     * Add a candidate application to this offer.
     * 
     * @param User $user The candidate user
     * @return bool Success status
     */
    public function addCandidate(User $user)
    {
        // Delegate to the user's applyToOffer method
        return $user->applyToOffer($this);
    }

    /**
    * Get the candidates who saved this offer.
    */
    public function savedByUsers()
    {
        return $this->belongsToMany(User::class, 'saved_offers', 'offer_id', 'user_id')
            ->whereHas('candidate')
            ->withTimestamps();
    }

    /**
    * Check if this offer is saved by a specific user
    * 
    * @param User $user The user to check
    * @return bool Whether the offer is saved by the user
    */
    public function isSavedBy(User $user)
    {
        return $this->savedByUsers()->where('users.id', $user->id)->exists();
    }
}
