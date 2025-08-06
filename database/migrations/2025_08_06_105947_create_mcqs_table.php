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

            // Basic question information
            $table->text('question');
            $table->text('explanation')->nullable();

            // Answer options (JSON format for flexibility)
            $table->text('option_a')->nullable();
            $table->text('option_b')->nullable();
            $table->text('option_c')->nullable();
            $table->text('option_d')->nullable();
            $table->string('correct_answer'); // 'A', 'B', 'C', 'D', etc.

            // Categorization
            $table->string('subject')->nullable();
            $table->string('topic')->nullable();

            // Question metadata
            $table->enum('question_type', ['single_correct', 'multiple_correct', 'true_false'])->default('single_correct');

            // Status and visibility
            $table->boolean('is_active')->default(true);
            $table->boolean('is_verified')->default(false);

            // Creator information
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');

            // Additional fields
            $table->json('tags')->nullable(); // ['physics', 'mechanics', 'force']
            $table->json('reference')->nullable(); // ['ppsc' 'nts']  book/source reference

            $table->timestamps();

            // Indexes for better query performance
            $table->index(['subject', 'topic']);
            $table->index(['question_type', 'is_active']);
            $table->index(['created_by', 'is_active']);
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
