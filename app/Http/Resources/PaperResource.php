<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaperResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'serial_number' => $this->serial_number,
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,

            // Testing services with conditional loading
            'testing_service' => $this->when($this->testing_services, [
                'short' => $this->testing_services['short'] ?? null,
                'long' => $this->testing_services['long'] ?? null,
            ]),

            'department' => $this->department,
            'subject' => $this->subject,

            // Scheduled date with multiple formats
            'scheduled_at' => $this->when($this->scheduled_at, [
                'datetime' => $this->scheduled_at?->toISOString(),
                'human' => $this->scheduled_at?->diffForHumans(),
                'formatted' => $this->scheduled_at?->format('M j, Y \a\t g:i A'),
                'date_only' => $this->scheduled_at?->format('Y-m-d'),
                'time_only' => $this->scheduled_at?->format('H:i'),
            ]),

            // Status indicators
            'status' => [
                'is_scheduled' => !is_null($this->scheduled_at),
                'is_today' => $this->isScheduledToday(),
                'is_upcoming' => $this->isUpcoming(),
                'is_past' => $this->scheduled_at && $this->scheduled_at->isPast(),
            ],

            // Additional computed fields
            'meta' => [
                'has_description' => !is_null($this->description),
                'has_testing_service' => !is_null($this->testing_services),
            ],

            // Timestamps
            'created_at' => [
                'datetime' => $this->created_at->toISOString(),
                'human' => $this->created_at->diffForHumans(),
                'formatted' => $this->created_at->format('M j, Y'),
            ],

            'updated_at' => [
                'datetime' => $this->updated_at->toISOString(),
                'human' => $this->updated_at->diffForHumans(),
                'formatted' => $this->updated_at->format('M j, Y'),
            ],

            'deleted_at' => $this->when($this->deleted_at, [
                'datetime' => $this->deleted_at?->toISOString(),
                'human' => $this->deleted_at?->diffForHumans(),
                'formatted' => $this->deleted_at?->format('M j, Y'),
            ]),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        return [
            'api_version' => '1.0',
            'timestamp' => now()->toISOString(),
        ];
    }

    /**
     * Customize the response for a request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Illuminate\Http\JsonResponse $response
     * @return void
     */
    public function withResponse(Request $request, $response): void
    {
        // Add custom headers or modify response
        $response->header('X-Resource-Type', 'Paper');
    }
}
