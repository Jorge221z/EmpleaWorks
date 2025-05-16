<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Role::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->randomElement(['Candidate', 'Company', 'Admin']),
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function candidate()
    {
        return $this->state(function (array $attributes) {
            return [
                'id' => 1,
                'name' => 'Candidate',
            ];
        });
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function company()
    {
        return $this->state(function (array $attributes) {
            return [
                'id' => 2,
                'name' => 'Company',
            ];
        });
    }
}
