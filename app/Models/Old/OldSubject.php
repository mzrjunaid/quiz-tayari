<?php

namespace App\Models\Old;

use App\Traits\GeneratesSlug;
use Illuminate\Database\Eloquent\Model;

class OldSubject extends Model
{

    use GeneratesSlug;

    protected $connection = 'pace_mcqs';
    protected $table = 'add_syllabus';
    protected $primaryKey = 'syllabus_id';
    public $timestamps = false;
}
