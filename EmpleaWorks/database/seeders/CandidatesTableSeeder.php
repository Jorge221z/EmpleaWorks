<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Candidate;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class CandidatesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        $candidatesData = [
            [
                'user' => [
                    'name' => 'Juan Pérez',
                    'role_id' => '1',
                    'email' => 'juan.perez@example.com',
                    'image' => $faker->imageUrl(100, 100, 'business'),
                    'description' => 'Empresa líder en tecnología.',
                    'password' => Hash::make('password'),
                ],
                'candidate' => [
                    'surname' => 'Pérez',
                    'cv' => '/storage/cvs/juan_perez_cv.pdf',
                ]
            ],
            [
                'user' => [
                    'name' => 'María Gómez',
                    'role_id' => '1',
                    'email' => 'maria.gomez@example.com',
                    'image' => $faker->imageUrl(100, 100, 'business'),
                    'description' => 'Empresa líder en tecnología.',
                    'password' => Hash::make('password'),
                ],
                'candidate' => [
                    'surname' => 'Gómez',
                    'cv' => '/storage/cvs/maria_gomez_cv.pdf',
                ]
            ],
            [
                'user' => [
                    'name' => 'Carlos López',
                    'role_id' => '1',
                    'email' => 'carlos.lopez@example.com',
                    'image' => $faker->imageUrl(100, 100, 'business'),
                    'description' => 'Empresa líder en tecnología.',
                    'password' => Hash::make('password'),
                ],
                'candidate' => [
                    'surname' => 'López',
                    'cv' => '/storage/cvs/carlos_lopez_cv.pdf',
                ]
            ],
            [
                'user' => [
                    'name' => 'Ana Martínez',
                    'role_id' => '1',
                    'email' => 'ana.martinez@example.com',
                    'image' => $faker->imageUrl(100, 100, 'business'),
                    'description' => 'Empresa líder en tecnología.',
                    'password' => Hash::make('password'),
                ],
                'candidate' => [
                    'surname' => 'Martínez',
                    'cv' => '/storage/cvs/ana_martinez_cv.pdf',
                ]
            ],
            [
                'user' => [
                    'name' => 'Luis Rodríguez',
                    'role_id' => '1',
                    'email' => 'luis.rodriguez@example.com',
                    'image' => $faker->imageUrl(100, 100, 'business'),
                    'description' => 'Empresa líder en tecnología.',
                    'password' => Hash::make('password'),
                ],
                'candidate' => [
                    'surname' => 'Rodríguez',
                    'cv' => '/storage/cvs/luis_rodriguez_cv.pdf',
                ]
            ],
            [
                'user' => [
                    'name' => 'Sofía Hernández',
                    'role_id' => '1',
                    'email' => 'sofia.hernandez@example.com',
                    'image' => $faker->imageUrl(100, 100, 'business'),
                    'description' => 'Empresa líder en tecnología.',
                    'password' => Hash::make('password'),
                ],
                'candidate' => [
                    'surname' => 'Hernández',
                    'cv' => '/storage/cvs/sofia_hernandez_cv.pdf',
                ]
            ],
        ];

        foreach ($candidatesData as $data) {
            // Create user first
            $user = User::create($data['user']);
            
            // Create candidate linked to the user
            $candidateData = $data['candidate'];
            $candidateData['user_id'] = $user->id;
            
            Candidate::create($candidateData);
        }
    }
}
