<?php

namespace App\Models\Old;

use App\Traits\GeneratesSlug;
use Illuminate\Database\Eloquent\Model;

class OldPaper extends Model
{
    use GeneratesSlug;
    protected $connection = 'pace_mcqs';
    protected $table = 'add_paper_name';
    protected $primaryKey = 'paper_id';
    public $timestamps = false;
}
