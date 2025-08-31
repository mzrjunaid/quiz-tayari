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
            Schema::create('papers', function (Blueprint $table) {
                $table->uuid('id')->primary();

                $table->string('title', 150);
                $table->string('description', 255)->nullable();
                $table->json('testing_services')->nullable();
                $table->string('department', 150)->nullable();
                $table->string('subject', 100)->nullable();

                $table->datetime('scheduled_at')->nullable();



                $table->timestamps();

                $table->index(['department', 'subject']);
                $table->index('scheduled_at');
            });
        }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
            Schema::dropIfExists('papers');
        }
    };
