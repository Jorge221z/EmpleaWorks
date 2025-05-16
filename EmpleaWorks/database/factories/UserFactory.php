<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Laravel\Jetstream\Features;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
            'role_id' => function () {
                // Make sure roles exist
                if (!Role::where('id', 1)->exists()) {
                    Role::create(['id' => 1, 'name' => 'Candidate']);
                }
                if (!Role::where('id', 2)->exists()) {
                    Role::create(['id' => 2, 'name' => 'Company']);
                }
                return Role::inRandomOrder()->first()->id ?? 1;
            },
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }

    /**
     * Indicate that the user should be a candidate.
     */
    public function candidate(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'role_id' => function () {
                    if (!Role::where('id', 1)->exists()) {
                        Role::create(['id' => 1, 'name' => 'Candidate']);
                    }
                    return 1;
                },
            ];
        });
    }

    /**
     * Indicate that the user should be a company.
     */
    public function company(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'role_id' => function () {
                    if (!Role::where('id', 2)->exists()) {
                        Role::create(['id' => 2, 'name' => 'Company']);
                    }
                    return 2;
                },
            ];
        });
    }
}
