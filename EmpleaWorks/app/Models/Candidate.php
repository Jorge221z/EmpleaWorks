<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    protected $fillable = ['name', 'surname', 'email', 'photo', 'description', 'cv'];

    public function offers()
    {
        return $this->belongsToMany(Offer::class, 'candidate_offer', 'candidate_id', 'offer_id');
    }
}