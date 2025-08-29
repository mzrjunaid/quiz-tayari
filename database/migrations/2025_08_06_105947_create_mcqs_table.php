<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mcqs', function (Blueprint $table) {
            $table->id();

            // SEO and URL-friendly identifier
            $table->string('slug')->unique()->nullable(); // URL-friendly version

            // Basic question information
            $table->text('question');
            $table->text('explanation')->nullable();

            // Answer options - using TEXT for longer options
            $table->text('option_a');
            $table->text('option_b');
            $table->text('option_c')->nullable(); // Some questions might have only 2 options
            $table->text('option_d')->nullable();
            $table->text('option_e')->nullable(); // For questions with 5 options

            $table->char('correct_answer', 1); // 'A', 'B', 'C', 'D', 'E'

            // For multiple correct answers (stored as JSON: ["A", "C"])
            $table->json('correct_answers')->nullable();

            // Categorization and organization
            $table->string('subject')->nullable()->index();
            $table->string('topic')->nullable()->index(); // Subtopic within subject
            $table->enum('difficulty_level', ['easy', 'medium', 'hard'])->default('medium')->index();

            // Question metadata
            $table->enum('question_type', [
                'single_correct',
                'multiple_correct',
                'true_false',
                'fill_in_blank',
                'matching'
            ])->default('single_correct');

            // Question Language Type
            $table->enum('language', ['english', 'urdu'])->default('english');

            // Status and visibility
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_verified')->default(false)->index();

            // Creator and editor information
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');

            // Additional metadata
            $table->json('tags')->nullable(); // ['physics', 'mechanics', 'force']
            $table->json('exam_types')->nullable(); // ['ppsc', 'nts', 'fpsc'] - which exams this applies to


            $table->timestamps();
            $table->softDeletes(); // Soft delete for data integrity

            // Comprehensive indexes for performance
            $table->index('slug');
            $table->index(['subject', 'topic']);
            $table->index(['question_type', 'is_active']);
            $table->index(['difficulty_level', 'is_active']);
            $table->index(['created_by', 'is_active']);
            $table->index(['is_verified', 'is_active']);
            $table->index('created_at');

            // Composite indexes for common queries
            $table->index(['subject', 'difficulty_level', 'is_active'], 'subject_difficulty_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mcqs');
    }
};
