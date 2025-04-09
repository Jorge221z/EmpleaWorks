<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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
     * Get the offers created by this user (as a company).
     */
    public function offers()
    {
        return $this->hasMany(Offer::class);
    }

    /**
     * Determine if the user is a company.
     */
    public function isCompany()
    {
        return $this->role_id === 2; // Asumiendo que role_id = 2 es para empresas
    }

    /**
     * Determine if the user is a candidate.
     */
    public function isCandidate()
    {
        return $this->role_id === 1; // Asumiendo que role_id = 1 es para candidatos
    }
}
