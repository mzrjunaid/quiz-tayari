<?php

namespace App\Models\Old;

use App\Traits\GeneratesSlug;
use Illuminate\Database\Eloquent\Model;

class OldTestingService extends Model
{

    use GeneratesSlug;
    protected $connection = 'pace_mcqs';
    protected $table = 'add_testing_service';
    protected $primaryKey = 'testing_service_id';
    public $timestamps = false;
}
