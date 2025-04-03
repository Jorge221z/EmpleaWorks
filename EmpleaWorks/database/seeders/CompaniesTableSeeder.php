<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use Faker\Factory as Faker;

class CompaniesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        $companies = [
            [
                'name' => 'TechNova',
                'logo' => $faker->imageUrl(100, 100, 'business'),
                'email' => 'contact@technova.com',
                'address' => $faker->address,
                'description' => 'Empresa líder en tecnología.',
                'web_link' => 'https://technova.com',
            ],
            [
                'name' => 'GreenEnergy',
                'logo' => $faker->imageUrl(100, 100, 'business'),
                'email' => 'info@greenenergy.com',
                'address' => $faker->address,
                'description' => 'Soluciones sostenibles para el futuro.',
                'web_link' => 'https://greenenergy.com',
            ],
            [
                'name' => 'MarketPro',
                'logo' => $faker->imageUrl(100, 100, 'business'),
                'email' => 'hello@marketpro.com',
                'address' => $faker->address,
                'description' => 'Especialistas en marketing digital.',
                'web_link' => 'https://marketpro.com',
            ],
            [
                'name' => 'BuildCorp',
                'logo' => $faker->imageUrl(100, 100, 'business'),
                'email' => 'contact@buildcorp.com',
                'address' => $faker->address,
                'description' => 'Construcción y desarrollo urbano.',
                'web_link' => 'https://buildcorp.com',
            ],
        ];

        foreach ($companies as $company) {
            Company::create($company);
        }
    }
}
