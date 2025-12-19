<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OldPaperResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'paper_id'   => $this->paper_id,
            'paper_year' => $this->paper_year,
            'slug'       => $this->slug,
            'paper'      => $this->paper,

            'testing_service' => $this->whenLoaded('testingService', function () {
                return [
                    'testing_service_id' => $this->testingService->testing_service_id,
                    'testing_service'    => $this->testingService->testing_service,
                ];
            }),

            'department' => $this->whenLoaded('department', function () {
                return [
                    'dept_id'    => $this->department->dept_id,
                    'department' => $this->department->department,
                ];
            }),
        ];
    }
}
