<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mcq>
 */
class McqFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Possible answers
        $options = [
            'A' => $this->faker->sentence(4),
            'B' => $this->faker->sentence(4),
            'C' => $this->faker->sentence(4),
            'D' => $this->faker->sentence(4),
        ];

        return [
            // Basic question info
            'question' => $this->faker->sentence(10) . '?',
            'explanation' => $this->faker->optional()->paragraph(),

            // Options
            'option_a' => $options['A'],
            'option_b' => $options['B'],
            'option_c' => $options['C'],
            'option_d' => $options['D'],

            // Correct answer (random from A-D)
            'correct_answer' => $this->faker->randomElement(['A', 'B', 'C', 'D']),

            // Subject
            'subject' => $this->faker->randomElement(['Mathematics', 'Physics', 'Chemistry', 'English']),

            // Question type
            'question_type' => $this->faker->randomElement(['single_correct', 'multiple_correct', 'true_false']),

            // Status flags
            'is_active' => $this->faker->boolean(90), // 90% active
            'is_verified' => $this->faker->boolean(70), // 70% verified

            // Creator/updater
            'created_by' => User::inRandomOrder()->value('id') ?? User::factory(),
            'updated_by' => User::inRandomOrder()->value('id') ?? User::factory(),

            // Tags and references
            'tags' => $this->faker->optional()->randomElements(
                ['physics', 'math', 'chemistry', 'biology', 'general_knowledge', 'current_affairs'],
                $this->faker->numberBetween(1, 3)
            ),
            'reference' => $this->faker->optional()->randomElements(
                ['PPSC', 'FPSC', 'NTS', 'PTS', 'CSS', 'Book: Physics Vol.1'],
                $this->faker->numberBetween(1, 2)
            ),

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
