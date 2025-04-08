<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class CompaniesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();
        
        // Crear usuarios para las empresas si no existen
        $companyData = [
            [
                'user' => [
                    'name' => 'TechNova',
                    'role_id' => '2',
                    'email' => 'contact@technova.com',
                    'image' => $faker->imageUrl(100, 100, 'business'),
                    'description' => 'Empresa líder en tecnología.',
                    'password' => bcrypt('password'),
                    
                ],
                'company' => [
                    'address' => $faker->address,
                    'web_link' => 'https://technova.com',
                ]
            ],
            [
                'user' => [
                    'name' => 'GreenEnergy',
                    'role_id' => '2',
                    'email' => 'info@greenenergy.com',
                    'image' => $faker->imageUrl(100, 100, 'business'),
                    'description' => 'Soluciones sostenibles para el futuro.',
                    'password' => bcrypt('password'),
                    
                ],
                'company' => [
                    'address' => $faker->address,
                    'web_link' => 'https://greenenergy.com',
                ]
            ],
            [
                'user' => [
                    'name' => 'MarketPro',
                    'role_id' => '2',
                    'email' => 'hello@marketpro.com',
                    'image' => $faker->imageUrl(100, 100, 'business'),
                    'description' => 'Especialistas en marketing digital.',
                    'password' => bcrypt('password'),
                    
                ],
                'company' => [
                    'address' => $faker->address,
                    'web_link' => 'https://marketpro.com',
                ]
            ],
            [
                'user' => [
                    'name' => 'BuildCorp',
                    'role_id' => '2',
                    'email' => 'contact@buildcorp.com',
                    'image' => $faker->imageUrl(100, 100, 'business'),
                    'description' => 'Construcción y desarrollo urbano.',
                    'password' => bcrypt('password'),
                    
                ],
                'company' => [
                    'address' => $faker->address,
                    'web_link' => 'https://buildcorp.com',
                ]
            ],
        ];

        foreach ($companyData as $data) {
            // Crear o encontrar el usuario
            $user = User::firstOrCreate(
                ['email' => $data['user']['email']],
                [
                    'name' => $data['user']['name'],
                    'role_id' => $data['user']['role_id'],
                    'image' => $data['user']['image'],
                    'description' => $data['user']['description'],
                    'password' => $data['user']['password'],
                    'remember_token' => Str::random(10),
                ]
            );
            
            // Crear el perfil de empresa asociado
            Company::create([
                'user_id' => $user->id,
                'address' => $data['company']['address'],
                'web_link' => $data['company']['web_link'],
            ]);
        }
    }
}
