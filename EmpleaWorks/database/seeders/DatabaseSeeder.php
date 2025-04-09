<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // First seed the roles table - this is critical for foreign key references
        $this->call(RoleSeeder::class);

        $this->call(CompaniesTableSeeder::class);
        $this->call(CandidatesTableSeeder::class);
        $this->call(OffersTableSeeder::class);
        
        
        
        // Add any other seeders below
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
