<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mcq extends Model
{
    protected $casts = [
        'tags' => 'array',
        'reference' => 'array',
    ];

    /** @use HasFactory<\Database\Factories\McqFactory> */
    use HasFactory;

}
