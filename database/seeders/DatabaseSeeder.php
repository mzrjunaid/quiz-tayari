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
        // Call the McqSeeder to populate the MCQs table

        $this->call(McqSeeder::class);

        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Junaid Mazhar',
            'email' => 'mzrjunaid@gmail.com',
            'password'=> bcrypt('123.321A'),
        ]);
    }
}
