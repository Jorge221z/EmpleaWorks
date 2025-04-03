<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{

    protected $fillable = ['name', 'logo', 'email', 'address', 'description', 'web_link'];

    public function offers()
    {
        return $this->hasMany(Offer::class, 'company_id');
    }
}