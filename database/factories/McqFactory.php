<?php

namespace Database\Factories;

use App\Models\Mcq;
use App\Models\Paper;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class McqFactory extends Factory
{
    protected $model = Mcq::class;

    public function definition(): array
    {
        $question = $this->faker->sentence(rand(6, 12)) . '?';
        $hasOptionE = $this->faker->boolean(30); // 30% chance of having 5 options

        $options = [
            'option_a' => $this->faker->sentence(rand(2, 6)),
            'option_b' => $this->faker->sentence(rand(2, 6)),
            'option_c' => $this->faker->sentence(rand(2, 6)),
            'option_d' => $this->faker->sentence(rand(2, 6)),
            'option_e' => $hasOptionE ? $this->faker->sentence(rand(2, 6)) : null,
        ];

        // Only allow correct answers for existing options
        $availableOptions = $hasOptionE ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];
        $correctLetter = $this->faker->randomElement($availableOptions);

        // Generate question type and ensure consistency
        $questionType = $this->faker->randomElement([
            'single',
            'multiple',
            'true_false',
            'single_a',
        ]);

        $correctAnswers = $this->generateCorrectAnswers($questionType, $correctLetter, $availableOptions);


        $existingPapers = Paper::pluck('id')->toArray();
        $paper = !empty($existingPapers) ? $this->faker->randomElement($existingPapers) : Paper::factory()->create()->id;


        // Get existing user IDs or create new ones
        $existingUserIds = User::pluck('id')->toArray();
        $createdBy = !empty($existingUserIds)
            ? $this->faker->randomElement($existingUserIds)
            : User::factory()->create()->id;

        $updatedBy = !empty($existingUserIds)
            ? $this->faker->randomElement($existingUserIds)
            : $createdBy;

        $verifiedBy = $this->faker->optional(0.7)->passthrough(
            !empty($existingUserIds)
                ? $this->faker->randomElement($existingUserIds)
                : User::factory()->create()->id
        );

        return [
            'slug' => Str::slug($question) . '-' . Str::random(5),
            'question' => $question,
            'explanation' => $this->faker->optional(0.8)->sentence(rand(8, 16)),
            ...$options,
            'correct_answer' => $correctLetter,
            'correct_answers' => $correctAnswers,
            'subject' => $this->faker->randomElement([
                'General Knowledge',
                'Mathematics',
                'Science',
                'English',
                'History',
                'Geography',
                'Physics',
                'Chemistry',
                'Biology'
            ]),
            'topic' => $this->faker->words(rand(1, 2), true),
            'difficulty_level' => $this->faker->randomElement(['easy', 'medium', 'hard']),
            'question_type' => $questionType,
            'paper_id' => $paper,
            'is_active' => $this->faker->boolean(90),
            'is_verified' => $this->faker->boolean(70),
            'created_by' => $createdBy,
            'updated_by' => $updatedBy,
            'verified_by' => $verifiedBy,
            'tags' => $this->faker->randomElements([
                'mathematics',
                'science',
                'history',
                'geography',
                'technology',
                'literature',
                'physics',
                'chemistry',
                'biology',
                'economics',
                'politics'
            ], rand(1, 3)),
            'exam_types' => $this->faker->randomElements([
                'ppsc',
                'fpsc',
                'nts',
                'css',
                'pts',
                'etea',
                'mdcat'
            ], rand(1, 3)),
            'language' => $this->faker->randomElement(['en', 'ur']),
        ];
    }

    /**
     * Generate consistent correct answers based on question type
     */
    private function generateCorrectAnswers(string $questionType, string $correctLetter, array $availableOptions): ?array
    {
        switch ($questionType) {
            case 'single_correct':
            case 'true_false':
                return [$correctLetter];

            case 'multiple_correct':
                // For multiple correct, include the primary correct answer plus 0-2 additional ones
                $correctAnswers = [$correctLetter];
                $remainingOptions = array_filter($availableOptions, fn($opt) => $opt !== $correctLetter);

                if (!empty($remainingOptions) && $this->faker->boolean(60)) {
                    $additionalCorrect = $this->faker->randomElements(
                        $remainingOptions,
                        rand(1, min(2, count($remainingOptions)))
                    );
                    $correctAnswers = array_merge($correctAnswers, $additionalCorrect);
                }

                return array_unique($correctAnswers);

            default:
                return [$correctLetter];
        }
    }

    /**
     * Create a true/false question
     */
    public function trueFalse(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'option_a' => 'True',
                'option_b' => 'False',
                'option_c' => null,
                'option_d' => null,
                'option_e' => null,
                'correct_answer' => $this->faker->randomElement(['A', 'B']),
                'correct_answers' => null, // Will be set by generateCorrectAnswers
                'question_type' => 'true_false',
            ];
        });
    }

    /**
     * Create a question with specific difficulty
     */
    public function difficulty(string $level): static
    {
        return $this->state(function (array $attributes) use ($level) {
            return [
                'difficulty_level' => $level,
            ];
        });
    }

    /**
     * Create a question for specific subject
     */
    public function subject(string $subject): static
    {
        return $this->state(function (array $attributes) use ($subject) {
            return [
                'subject' => $subject,
            ];
        });
    }
}
