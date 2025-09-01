<?php

namespace Database\Seeders;

use App\Models\Paper;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaperSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing papers (optional - comment out if you want to keep existing data)
        Paper::truncate();

        // Create papers scheduled for today (5 papers)
        Paper::factory()
            ->count(2)
            ->scheduledToday()
            ->create();

        // Create upcoming papers (15 papers)
        Paper::factory()
            ->count(2)
            ->upcoming()
            ->create();

        // Create past papers (10 papers)
        Paper::factory()
            ->count(2)
            ->past()
            ->create();

        // Create unscheduled papers (5 papers)
        Paper::factory()
            ->count(2)
            ->unscheduled()
            ->create();

        // Create specific testing service papers
        Paper::factory()
            ->count(2)
            ->sat()
            ->upcoming()
            ->create();

        Paper::factory()
            ->count(2)
            ->gre()
            ->upcoming()
            ->create();

        Paper::factory()
            ->count(2)
            ->toefl()
            ->upcoming()
            ->create();

        // Create department-specific papers
        Paper::factory()
            ->count(2)
            ->computerScience()
            ->upcoming()
            ->create();

        Paper::factory()
            ->count(2)
            ->mathematics()
            ->upcoming()
            ->create();

        // Create some papers with specific characteristics
        Paper::factory()
            ->count(2)
            ->withLongDescription()
            ->scheduledToday()
            ->create();

        Paper::factory()
            ->count(2)
            ->withoutDescription()
            ->upcoming()
            ->create();

        // Create some custom papers with specific data
        Paper::factory()->create([
            'slug' => 'sat-mathematics-practice-test',
            'title' => 'SAT Mathematics Practice Test',
            'description' => 'Comprehensive practice test covering all SAT math topics',
            'testing_services' => ['short' => 'SAT', 'long' => 'Scholastic Assessment Test'],
            'department' => 'Mathematics',
            'subject' => 'Algebra',
            'scheduled_at' => now()->addDays(7),
        ]);

        // Summary
        $this->command->info('Paper seeder completed successfully!');
        $this->command->info('Created papers:');
        $this->command->info('- Today: ' . Paper::scheduledToday()->count());
        $this->command->info('- Upcoming: ' . Paper::upcoming()->count());
        $this->command->info('- Past: ' . Paper::where('scheduled_at', '<', now())->count());
        $this->command->info('- Unscheduled: ' . Paper::whereNull('scheduled_at')->count());
        $this->command->info('- Total: ' . Paper::count());
    }
}
