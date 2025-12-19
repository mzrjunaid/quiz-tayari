<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OldMcqResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->q_id,
            'slug' => $this->slug,
            'question' => $this->q_statement,
            'options' => $this->getFormattedOptions(),
            'paper_id' => $this->paper_id,
            'correct_answer' => $this->right_choice,
            'question_type' => 'single',
            'syllabus_id' => $this->syllabus_id,
            'testing_service_id' => $this->testing_service_id,
            'publish' => $this->publish,
            'created_at' => $this->created_at,
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
            'A' => $this->option_A,
            'B' => $this->option_B,
            'C' => $this->option_C,
            'D' => $this->option_D,
        ]);
    }
}
