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
     * Delegate access to offers through the user
     */
    public function offers()
    {
        return $this->user->offers();
    }
}
