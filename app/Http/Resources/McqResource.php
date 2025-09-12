<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class McqResource extends JsonResource
{
    /**
     * Disable the default 'data' wrapper for Inertia.js compatibility
     */
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Basic Information
            'id' => $this->id,
            'serial_number' => $this->serial_number ?? null,
            'slug' => $this->slug,

            // Question Content
            'question' => $this->question,
            'explanation' => $this->explanation,

            // Answer Options (grouped for better organization)
            'options' => $this->getFormattedOptions(),

            // Answer Information
            'correct_answer' => $this->correct_answer,
            'correct_answers' => $this->correct_answers ?? [],

            // Categorization
            'subject' => $this->subject,
            'topic' => $this->topic,
            'difficulty_level' => $this->difficulty_level,
            'question_type' => $this->question_type,
            'tags' => $this->tags ?? [],
            'exam_types' => $this->exam_types ?? [],

            // Status Information
            'is_active' => (bool) $this->is_active,
            'is_verified' => (bool) $this->is_verified,

            // get paper Information
            'paper' => new PaperResource($this->paper),

            // mcq categoriezation
            'current_affair' => (bool) $this->current_affair,
            'general_knowledge' => (bool) $this->general_knowledge,
            'language' => $this->language,

            // User Relationships (with safety checks)
            'created_by' => $this->getCreatedByUser(),
            'updated_by' => $this->getUpdatedByUser(),
            'verified_by' => $this->getVerifiedByUser(),

            // Timestamps (formatted for frontend)
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),

            // Human-readable dates
            'created_at_human' => $this->created_at?->diffForHumans(),
            'updated_at_human' => $this->updated_at?->diffForHumans(),
            'deleted_at_human' => $this->deleted_at?->diffForHumans(),
            'created_at_datetime' => $this->created_at?->format('M d, Y h:i A'),
            'updated_at_datetime' => $this->updated_at?->format('M d, Y h:i A'),
            'deleted_at_datetime' => $this->deleted_at?->format('M d, Y h:i A'),

            // Computed Properties
            'has_multiple_correct_answers' => $this->hasMultipleCorrectAnswers(),
            'option_count' => $this->getOptionCount(),
            'status' => config('statuses.' . $this->getStatus(), $this->getStatus()),
        ];
    }

    /**
     * Get formatted options array, filtering out null values
     *
     * @return array<string, string>
     */
    private function getFormattedOptions(): array
    {
        return array_filter([
            'A' => $this->option_a,
            'B' => $this->option_b,
            'C' => $this->option_c,
            'D' => $this->option_d,
            'E' => $this->option_e,
        ]);
    }

    /**
     * Get created by user information
     *
     * @return array<string, mixed>|null
     */
    private function getCreatedByUser()
    {
        // First try to use already loaded relationship
        if ($this->relationLoaded('creator')) {
            return $this->creator ? [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
                'email' => $this->creator->email,
            ] : null;
        }

        // If not loaded and we have created_by ID, load it
        if ($this->created_by) {
            $creator = $this->creator; // This will trigger lazy loading
            return $creator ? [
                'id' => $creator->id,
                'name' => $creator->name,
                'email' => $creator->email,
            ] : ['id' => $this->created_by];
        }

        return null;
    }

    /**
     * Get updated by user information
     *
     * @return array<string, mixed>|null
     */
    private function getUpdatedByUser()
    {
        // First try to use already loaded relationship
        if ($this->relationLoaded('updater')) {
            return $this->updater ? [
                'id' => $this->updater->id,
                'name' => $this->updater->name,
                'email' => $this->updater->email,
            ] : null;
        }

        // If not loaded and we have created_by ID, load it
        if ($this->updated_by) {
            $updater = $this->updater; // This will trigger lazy loading
            return $updater ? [
                'id' => $updater->id,
                'name' => $updater->name,
                'email' => $updater->email,
            ] : ['id' => $this->updated_by];
        }

        return null;
    }

    /**
     * Get verified by user information
     *
     * @return array<string, mixed>|null
     */

    private function getVerifiedByUser()
    {
        // First try to use already loaded relationship
        if ($this->relationLoaded('verifier')) {
            return $this->verifier ? [
                'id' => $this->verifier->id,
                'name' => $this->verifier->name,
                'email' => $this->verifier->email,
            ] : null;
        }

        // If not loaded and we have created_by ID, load it
        if ($this->verified_by) {
            $verifier = $this->verifier; // This will trigger lazy loading
            return $verifier ? [
                'id' => $verifier->id,
                'name' => $verifier->name,
                'email' => $verifier->email,
            ] : ['id' => $this->verified_by];
        }

        return null;
    }

    /**
     * Get verified by user information
     *
     * @return array<string, mixed>|null
     */

    private function getMcqPaper(): ?array
    {
        return $this->whenLoaded('paper', function () {
            return [
                'id' => $this->paper->id,
                'title' => $this->paper->title,
                'department' => $this->paper->department,
                'subject' => $this->paper->subject,
                'testing_services' => $this->paper->testing_services,
                'scheduled_at' => optional($this->paper->scheduled_at)->toDateTimeString(),
            ];
        });
    }



    /**
     * Check if question has multiple correct answers
     *
     * @return bool
     */
    private function hasMultipleCorrectAnswers(): bool
    {
        return is_array($this->correct_answers) && count($this->correct_answers) > 1;
    }

    /**
     * Count non-null options
     *
     * @return int
     */
    private function getOptionCount(): int
    {
        return count($this->getFormattedOptions());
    }

    /**
     * Get the current status of the MCQ
     *
     * @return string
     */
    private function getStatus(): string
    {
        if (!$this->is_active) {
            return 'inactive';
        }

        if (!$this->is_verified) {
            return 'pending_verification';
        }

        if ($this->deleted_at) {
            return 'deleted';
        }

        return 'active';
    }
}
