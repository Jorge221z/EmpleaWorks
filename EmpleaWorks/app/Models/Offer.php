<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = [
        'name', 'description', 'category', 'degree', 'email',
        'contract_type', 'job_location', 'closing_date', 'company_id'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function candidates()
    {
        return $this->belongsToMany(Candidate::class, 'candidate_offer', 'offer_id', 'candidate_id');
    }
}