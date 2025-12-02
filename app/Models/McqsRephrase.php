<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class McqsRephrase extends Model
{
    /** @use HasFactory<\Database\Factories\McqsRephraseFactory> */
    use HasFactory;
    protected $connection = "pace_mcqs"; // Specify the connection name if needed
    protected $table = "add_question"; // Specify the table name
}
class OldPaper extends Model
{
    /** @use HasFactory<\Database\Factories\McqsRephraseFactory> */
    use HasFactory;
    protected $connection = 'pace_mcqs';
    protected $table = 'add_paper_name';
}
class OldSyllabus extends Model
{
    /** @use HasFactory<\Database\Factories\McqsRephraseFactory> */
    use HasFactory;
    protected $connection = 'pace_mcqs';
    protected $table = 'add_syllabus';
}
class OldTestingService extends Model
{
    /** @use HasFactory<\Database\Factories\McqsRephraseFactory> */
    use HasFactory;
    protected $connection = 'pace_mcqs';
    protected $table = 'add_testing_service';
}
