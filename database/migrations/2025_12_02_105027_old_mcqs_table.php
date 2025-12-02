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
        Schema::create('old_mcqs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedBigInteger('q_id')->unique();
            $table->string('slug')->unique()->nullable();
            $table->text('q_statement');
            $table->text('option_A');
            $table->text('option_B');
            $table->text('option_C')->nullable();
            $table->text('option_D')->nullable();
            $table->char('right_choice', 1);
            $table->unsignedBigInteger('testing_service_id');
            $table->unsignedBigInteger('paper_id');
            $table->unsignedBigInteger('syllabus_id');
            $table->boolean('publish')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
