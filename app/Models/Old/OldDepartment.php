<?php

namespace App\Models\Old;

use Illuminate\Database\Eloquent\Model;

class OldDepartment extends Model
{
    protected $connection = 'pace_mcqs';
    protected $table = 'add_department';
    protected $primaryKey = 'dept_id';
    public $timestamps = false;
}
