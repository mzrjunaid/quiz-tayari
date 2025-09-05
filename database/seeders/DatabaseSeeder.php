<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Junaid Mazhar',
            'email' => 'mzrjunaid@gmail.com',
            'password' => bcrypt('123.321A'),
        ]);

        // call the PaperSeeder to populate the Papers table
        $this->call(PaperSeeder::class);

        // Call the McqSeeder to populate the MCQs table
        $this->call(McqSeeder::class);

        // User::factory(10)->create();

    }
}
