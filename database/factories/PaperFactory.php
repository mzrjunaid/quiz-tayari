<?php

namespace Database\Factories;

use App\Models\Paper;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Paper>
 */
class PaperFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Paper::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $testingServices = [
            ['short' => 'NTS', 'long' => 'National Testing Service'],
            ['short' => 'FPSC', 'long' => 'Fedearl Public Service Comission'],
            ['short' => 'PPSC', 'long' => 'Punjab Public Service Comission'],
        ];

        $departments = [
            'Government',
            'Punjab University',
            'Health Department',
            'Nationanl Testing Service',
            'Ministry of Education',
            'Ministry of Health',
        ];

        $subjects = [
            'Computer Science',
            'Mathematics',
            'Physics',
            'Chemistry',
        ];

        return [
            'title' => $this->faker->sentence(3, true),
            'description' => $this->faker->optional(0.7)->sentence(10),
            'testing_services' => $this->faker->randomElement($testingServices),
            'department' => $this->faker->randomElement($departments),
            'subject' => $this->faker->randomElement($subjects),
            'scheduled_at' => $this->faker->optional(0.8)->dateTimeBetween('now', '+3 months'),
        ];
    }

    /**
     * Indicate that the paper is scheduled for today.
     */
    public function scheduledToday(): static
    {
        return $this->state(fn(array $attributes) => [
            'scheduled_at' => $this->faker->dateTimeBetween('today', 'today +23 hours 59 minutes'),
        ]);
    }

    /**
     * Indicate that the paper is upcoming (future).
     */
    public function upcoming(): static
    {
        return $this->state(fn(array $attributes) => [
            'scheduled_at' => $this->faker->dateTimeBetween('+1 day', '+2 months'),
        ]);
    }

    /**
     * Indicate that the paper is in the past.
     */
    public function past(): static
    {
        return $this->state(fn(array $attributes) => [
            'scheduled_at' => $this->faker->dateTimeBetween('-2 months', 'yesterday'),
        ]);
    }

    /**
     * Indicate that the paper has no scheduled date.
     */
    public function unscheduled(): static
    {
        return $this->state(fn(array $attributes) => [
            'scheduled_at' => null,
        ]);
    }

    /**
     * Create a paper for a specific testing service.
     */
    public function forTestingService(string $short, string $long): static
    {
        return $this->state(fn(array $attributes) => [
            'testing_services' => ['short' => $short, 'long' => $long],
        ]);
    }

    /**
     * Create a paper for SAT.
     */
    public function sat(): static
    {
        return $this->forTestingService('SAT', 'Scholastic Assessment Test');
    }

    /**
     * Create a paper for GRE.
     */
    public function gre(): static
    {
        return $this->forTestingService('GRE', 'Graduate Record Examinations');
    }

    /**
     * Create a paper for TOEFL.
     */
    public function toefl(): static
    {
        return $this->forTestingService('TOEFL', 'Test of English as a Foreign Language');
    }

    /**
     * Create a paper for a specific department.
     */
    public function forDepartment(string $department): static
    {
        return $this->state(fn(array $attributes) => [
            'department' => $department,
        ]);
    }

    /**
     * Create a paper for Computer Science department.
     */
    public function computerScience(): static
    {
        return $this->state(fn(array $attributes) => [
            'department' => 'Computer Science',
            'subject' => $this->faker->randomElement([
                'Programming',
                'Data Structures',
                'Algorithms',
                'Database Systems',
                'Software Engineering',
            ]),
        ]);
    }

    /**
     * Create a paper for Mathematics department.
     */
    public function mathematics(): static
    {
        return $this->state(fn(array $attributes) => [
            'department' => 'Mathematics',
            'subject' => $this->faker->randomElement([
                'Algebra',
                'Calculus',
                'Statistics',
                'Geometry',
                'Trigonometry',
            ]),
        ]);
    }

    /**
     * Create a paper with a long description.
     */
    public function withLongDescription(): static
    {
        return $this->state(fn(array $attributes) => [
            'description' => $this->faker->paragraph(5),
        ]);
    }

    /**
     * Create a paper without description.
     */
    public function withoutDescription(): static
    {
        return $this->state(fn(array $attributes) => [
            'description' => null,
        ]);
    }
}
