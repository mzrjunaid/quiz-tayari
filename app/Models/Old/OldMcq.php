<?php

namespace App\Models\Old;


use App\Models\Old\OldPaper;
use App\Models\OldSyllabus;
use App\Traits\GeneratesSlug;
use Illuminate\Database\Eloquent\Model;

class OldMcq extends Model
{

    use GeneratesSlug;
    protected $connection = 'pace_mcqs';
    protected $table = 'add_question';
    protected $primaryKey = 'q_id';
    public $timestamps = false;

    public function paper()
    {
        return $this->belongsTo(OldPaper::class, 'paper_id');
    }
    public function subject()
    {
        return $this->belongsTo(OldSubject::class, 'syllabus_id');
    }
    public function testingservice()
    {
        return $this->belongsTo(OldTestingService::class, 'testing_service_id');
    }
}
