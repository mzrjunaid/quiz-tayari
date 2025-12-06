<?php

namespace App\Console\Commands;

use App\Models\Old\OldMcq;
use Illuminate\Console\Command;
use App\Models\Old\OldPaper;
use App\Models\Old\OldSubject;
use App\Models\Old\OldTestingService;


class GenerateSeoSlugs extends Command
{
    protected $signature = 'seo:slugs';
    protected $description = 'Generate SEO friendly slugs for all tables';

    public function handle()
    {
        $this->info("Generating SEO slugs...");

        $this->generate(OldSubject::class, 'syllabus');
        $this->generate(OldPaper::class, 'paper');
        $this->generate(OldTestingService::class, 'testing_service');
        $this->generate(OldMcq::class, 'q_statement');

        $this->info("All slugs generated successfully.");
    }

    protected function generate($model, $field)
    {
        $this->info("Processing " . class_basename($model));

        $model::whereNull('slug')
            ->orWhere('slug', '')
            ->chunk(200, function ($rows) use ($model, $field) {
                foreach ($rows as $row) {
                    $row->slug = $model::generateUniqueSlug($row->$field);
                    $row->save();
                }
            });
    }
}
