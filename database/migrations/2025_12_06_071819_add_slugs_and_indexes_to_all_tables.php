<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    /** Use a specific database connection */
    protected $connection = 'pace_mcqs';
    /**
     * Run the migrations.
     */
    public function up()
    {

        // Departments
        Schema::table('add_department', function (Blueprint $table) {
            if (!Schema::hasColumn('add_department', 'slug')) {
                $table->string('slug')->unique()->index();
            }
        });

        // Subjects
        Schema::table('add_syllabus', function (Blueprint $table) {
            if (!Schema::hasColumn('add_syllabus', 'slug')) {
                $table->string('slug')->unique()->index();
            }
        });

        // Testing Services
        Schema::table('add_testing_service', function (Blueprint $table) {
            if (!Schema::hasColumn('add_testing_service', 'slug')) {
                $table->string('slug')->index();
            }
        });

        // Papers
        Schema::table('add_paper_name', function (Blueprint $table) {
            if (!Schema::hasColumn('add_paper_name', 'slug')) {
                $table->string('slug')->index();
            }
        });

        // MCQs
        Schema::table('add_question', function (Blueprint $table) {
            if (!Schema::hasColumn('add_question', 'slug')) {
                $table->string('slug')->index();
            }
            $table->index('syllabus_id');
            $table->index('paper_id');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Departments
        Schema::table('add_department', function (Blueprint $table) {
            if (Schema::hasColumn('add_department', 'slug')) {
                $table->dropColumn('slug');
            }
        });

        // Subjects
        Schema::table('add_syllabus', function (Blueprint $table) {
            if (Schema::hasColumn('add_syllabus', 'slug')) {
                $table->dropColumn('slug');
            }
        });

        // Papers
        Schema::table('add_paper_name', function (Blueprint $table) {
            if (Schema::hasColumn('add_paper_name', 'slug')) {
                $table->dropColumn('slug');
            }
            $table->dropIndex(['subject_id']);
            $table->dropIndex(['testing_service_id']);
        });

        // MCQs
        Schema::table('add_question', function (Blueprint $table) {
            if (Schema::hasColumn('add_question', 'slug')) {
                $table->dropColumn('slug');
            }
            $table->dropIndex(['subject_id']);
            $table->dropIndex(['paper_id']);
        });

        // Testing Services
        Schema::table('add_testing_service', function (Blueprint $table) {
            if (Schema::hasColumn('add_testing_service', 'slug')) {
                $table->dropColumn('slug');
            }
        });
    }
};
