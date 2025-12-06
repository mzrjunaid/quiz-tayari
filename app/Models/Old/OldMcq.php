<?php

namespace App\Models\Old;

use App\Traits\GeneratesSlug;
use Illuminate\Database\Eloquent\Model;

class OldMcq extends Model
{

    use GeneratesSlug;
    protected $connection = 'pace_mcqs';
    protected $table = 'add_question';
    protected $primaryKey = 'q_id';
    public $timestamps = false;
}
