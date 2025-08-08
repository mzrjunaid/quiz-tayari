<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mcq;
use App\Models\User;

class McqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have some users for created_by / updated_by
        if (User::count() === 0) {
            User::factory()->count(5)->create();
        }

        // Create 50 MCQs
        Mcq::factory()->count(50)->create();
    }
}
