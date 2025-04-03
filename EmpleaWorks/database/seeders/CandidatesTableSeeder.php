<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Candidate;
use Faker\Factory as Faker;

class CandidatesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        $candidates = [
            [
                'name' => 'Juan',
                'surname' => 'Pérez',
                'email' => 'juan.perez@example.com',
                'photo' => $faker->imageUrl(200, 200, 'people'),
                'description' => $faker->paragraph,
                'cv' => '/storage/cvs/juan_perez_cv.pdf',
            ],
            [
                'name' => 'María',
                'surname' => 'Gómez',
                'email' => 'maria.gomez@example.com',
                'photo' => $faker->imageUrl(200, 200, 'people'),
                'description' => $faker->paragraph,
                'cv' => '/storage/cvs/maria_gomez_cv.pdf',
            ],
            [
                'name' => 'Carlos',
                'surname' => 'López',
                'email' => 'carlos.lopez@example.com',
                'photo' => $faker->imageUrl(200, 200, 'people'),
                'description' => $faker->paragraph,
                'cv' => '/storage/cvs/carlos_lopez_cv.pdf',
            ],
            [
                'name' => 'Ana',
                'surname' => 'Martínez',
                'email' => 'ana.martinez@example.com',
                'photo' => $faker->imageUrl(200, 200, 'people'),
                'description' => $faker->paragraph,
                'cv' => '/storage/cvs/ana_martinez_cv.pdf',
            ],
            [
                'name' => 'Luis',
                'surname' => 'Rodríguez',
                'email' => 'luis.rodriguez@example.com',
                'photo' => $faker->imageUrl(200, 200, 'people'),
                'description' => $faker->paragraph,
                'cv' => '/storage/cvs/luis_rodriguez_cv.pdf',
            ],
            [
                'name' => 'Sofía',
                'surname' => 'Hernández',
                'email' => 'sofia.hernandez@example.com',
                'photo' => $faker->imageUrl(200, 200, 'people'),
                'description' => $faker->paragraph,
                'cv' => '/storage/cvs/sofia_hernandez_cv.pdf',
            ],
        ];

        foreach ($candidates as $candidate) {
            Candidate::create($candidate);
        }
    }
}
