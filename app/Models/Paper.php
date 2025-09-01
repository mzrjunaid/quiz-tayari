<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

class Paper extends Model
{
    use HasFactory, HasUuids;

    // Explicitly define the table name
    protected $table = 'papers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'slug',
        'title',
        'description',
        'testing_services',
        'department',
        'subject',
        'scheduled_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'testing_services' => 'array',
        'scheduled_at' => 'datetime',
    ];

    /**
     * Get the testing service short name.
     *
     * @return string|null
     */
    public function getTestingServiceShortAttribute()
    {
        return $this->testing_services['short'] ?? null;
    }

    /**
     * Get the testing service long name.
     *
     * @return string|null
     */
    public function getTestingServiceLongAttribute()
    {
        return $this->testing_services['long'] ?? null;
    }

    /**
     * Scope a query to only include papers from a specific department.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $department
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByDepartment($query, $department)
    {
        return $query->where('department', $department);
    }

    /**
     * Scope a query to only include papers for a specific subject.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $subject
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeBySubject($query, $subject)
    {
        return $query->where('subject', $subject);
    }

    /**
     * Scope a query to only include papers with a specific testing service.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $service
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByTestingService($query, $service)
    {
        return $query->where('testing_services->short', $service);
    }

    /**
     * Scope a query to only include papers scheduled for today.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeScheduledToday($query)
    {
        return $query->whereDate('scheduled_at', today());
    }

    /**
     * Scope a query to only include upcoming papers.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_at', '>', now());
    }

    /**
     * Check if the paper is scheduled for today.
     *
     * @return bool
     */
    public function isScheduledToday()
    {
        return $this->scheduled_at && $this->scheduled_at->isToday();
    }

    /**
     * Check if the paper is upcoming.
     *
     * @return bool
     */
    public function isUpcoming()
    {
        return $this->scheduled_at && $this->scheduled_at->isFuture();
    }

    /**
     * Get a formatted scheduled date.
     *
     * @param string $format
     * @return string|null
     */
    public function getFormattedScheduledDate($format = 'Y-m-d H:i')
    {
        return $this->scheduled_at?->format($format);
    }

    // Route model binding with slug
    public function getRouteKeyName()
    {
        return 'slug';
    }


    // protected static function boot()
    // {
    //     parent::boot();

    //     static::creating(function ($model) {
    //         if (empty($model->id)) {
    //             $model->id = (string) Str::uuid();
    //         }
    //     });
    // }
}
