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
            'correct_answer' => $this->right_choice,
            'question_type' => 'single',
            'paper' => $this->whenLoaded('paper', function () {
                return [
                    'id' => $this->paper->paper_id,
                    'title'    => $this->paper->paper,
                    'department' => $this->paper->department,
                    'year' => $this->paper->paper_year,
                ];
            }),
            'subject' => $this->whenLoaded('subject', function () {
                return [
                    'id' => $this->subject->syllabus_id,
                    'title'    => $this->subject->syllabus,
                ];
            }),
            'testing_service' => $this->whenLoaded('testingService', function () {
                return [
                    'id' => $this->testingService->testing_service_id,
                    'title'    => $this->testingService->testing_service,
                ];
            }),
            'publish' => $this->publish,
            'created_at' => $this->created_at,
            'oldmcq' => true,
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
