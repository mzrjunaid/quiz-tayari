<?php

namespace App\Traits;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

trait GeneratesSlug
{
    /**
     * Generate a unique, SEO-friendly slug for a model.
     *
     * @param  string  $text
     * @param  Model|string  $modelClass   The model or model class name
     * @param  string  $column
     * @return string
     */
    public static function generateUniqueSlug(
        string $text,
        string $column = 'slug'
    ): string {
        // If no model class is passed, use the class using this trait
        $modelClass = $modelClass ?? static::class;

        // Clean long text → take only first 120 chars for SEO
        $text = Str::limit($text, 120, '');

        // Convert to slug
        $slug = Str::slug($text);

        // Fallback if text is empty or non-sluggable
        if (!$slug) {
            $slug = uniqid();
        }

        // Truncate early to leave room for "-1", "-2", etc.
        $slug = substr($slug, 0, 240);

        // Store original slug for duplicate loop
        $original = $slug;

        // Check for duplicates
        $counter = 1;
        while ($modelClass::where($column, $slug)->exists()) {
            $slug = "{$original}-{$counter}";
            $counter++;

            // Always ensure max length 255
            $slug = substr($slug, 0, 255);
        }

        return $slug;
    }
}
