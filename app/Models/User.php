<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    // MCQ Relationships

    /**
     * MCQs created by this user
     */
    public function createdMcqs(): HasMany
    {
        return $this->hasMany(Mcq::class, 'created_by');
    }

    /**
     * MCQs updated by this user
     */
    public function updatedMcqs(): HasMany
    {
        return $this->hasMany(Mcq::class, 'updated_by');
    }

    /**
     * MCQs verified by this user
     */
    public function verifiedMcqs(): HasMany
    {
        return $this->hasMany(Mcq::class, 'verified_by');
    }

    // Convenience methods for getting MCQs

    /**
     * Get all MCQs this user has any involvement with
     */
    public function allRelatedMcqs(): HasMany
    {
        return $this->hasMany(Mcq::class, 'created_by')
            ->orWhereHas('updater', function ($query) {
                $query->where('id', $this->id);
            })
            ->orWhereHas('verifier', function ($query) {
                $query->where('id', $this->id);
            });
    }

    /**
     * Get active MCQs created by this user
     */
    public function activeCreatedMcqs(): HasMany
    {
        return $this->createdMcqs()->where('is_active', true);
    }

    /**
     * Get verified MCQs created by this user
     */
    public function verifiedCreatedMcqs(): HasMany
    {
        return $this->createdMcqs()->where('is_verified', true);
    }

    // Helper methods

    /**
     * Check if user can verify MCQs (you might have a role system)
     */
    public function canVerifyMcqs(): bool
    {
        // Add your logic here - maybe check user role or permissions
        return $this->hasRole('admin') || $this->hasRole('moderator');
        // Or simply: return true; if all users can verify
    }

    /**
     * Get count of MCQs created by this user
     */
    public function getCreatedMcqsCountAttribute(): int
    {
        return $this->createdMcqs()->count();
    }

    /**
     * Get count of MCQs verified by this user
     */
    public function getVerifiedMcqsCountAttribute(): int
    {
        return $this->verifiedMcqs()->count();
    }
}
