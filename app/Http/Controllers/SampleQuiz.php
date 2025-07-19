<?php

namespace App\Http\Controllers;

use App\Models\QuizModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SampleQuiz extends Controller
{
    public function index()
    {
        $quiz = QuizModel::all();
        $quiz = $quiz->forPage(1, 10); // Example pagination, adjust as needed
        // dd($quiz); // Debugging line to check the data
        // This method can be used to display a list of quizzes
        return Inertia::render('Hello', [
            'quiz' => $quiz,
        ]);
    }
}
