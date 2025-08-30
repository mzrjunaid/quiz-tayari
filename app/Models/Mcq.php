<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mcq extends Model
{
    use HasFactory, SoftDeletes;

    // Explicitly define the table name
    protected $table = 'mcqs';

    protected $fillable = [
        'slug',
        'question',
        'explanation',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'option_e',
        'correct_answer',
        'correct_answers',
        'subject',
        'topic',
        'difficulty_level',
        'question_type',
        'language',
        'current_affair',
        'general_knowledge',
        'is_active',
        'is_verified',
        'tags',
        'exam_types',
        'created_by',
        'updated_by'

    ];

    protected $casts = [
        'tags' => 'array',
        'exam_types' => 'array',
        'correct_answers' => 'array',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
        'current_affair' => 'boolean',
        'general_knowledge' => 'boolean',
    ];
    // Relationships
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    // Scope for active questions
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope for verified questions
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    // Route model binding with slug
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
