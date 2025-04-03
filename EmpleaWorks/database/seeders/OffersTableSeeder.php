<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Offer;
use Faker\Factory as Faker;

class OffersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        $offers = [
            [
                'name' => 'Desarrollador Full Stack',
                'description' => $faker->paragraph(3),
                'category' => 'Tecnología',
                'degree' => 'Universitario',
                'email' => 'jobs@technova.com',
                'contract_type' => 'Permanente',
                'job_location' => 'Madrid',
                'closing_date' => $faker->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
                'company_id' => 1, // TechNova
            ],
            [
                'name' => 'Ingeniero de Datos',
                'description' => $faker->paragraph(3),
                'category' => 'Tecnología',
                'degree' => 'Universitario',
                'email' => 'jobs@technova.com',
                'contract_type' => 'Temporal',
                'job_location' => 'Remoto',
                'closing_date' => $faker->dateTimeBetween('now', '+2 months')->format('Y-m-d'),
                'company_id' => 1, // TechNova (segunda oferta)
            ],
            [
                'name' => 'Especialista en Energías Renovables',
                'description' => $faker->paragraph(3),
                'category' => 'Energía',
                'degree' => 'Universitario',
                'email' => 'careers@greenenergy.com',
                'contract_type' => 'Permanente',
                'job_location' => 'Barcelona',
                'closing_date' => $faker->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
                'company_id' => 2, // GreenEnergy
            ],
            [
                'name' => 'Analista de Marketing Digital',
                'description' => $faker->paragraph(3),
                'category' => 'Marketing',
                'degree' => 'Bachiller',
                'email' => 'jobs@marketpro.com',
                'contract_type' => 'Temporal',
                'job_location' => 'Valencia',
                'closing_date' => $faker->dateTimeBetween('now', '+3 months')->format('Y-m-d'),
                'company_id' => 3, // MarketPro
            ],
            [
                'name' => 'Arquitecto Junior',
                'description' => $faker->paragraph(3),
                'category' => 'Construcción',
                'degree' => 'Universitario',
                'email' => 'hr@buildcorp.com',
                'contract_type' => 'Permanente',
                'job_location' => 'Sevilla',
                'closing_date' => $faker->dateTimeBetween('now', '+2 months')->format('Y-m-d'),
                'company_id' => 4, // BuildCorp
            ],
        ];

        foreach ($offers as $offer) {
            Offer::create($offer);
        }
    }
}
