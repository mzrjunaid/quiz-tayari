<?php

namespace App\Http\Controllers;

use App\Models\QuizModel;
use Gemini\Laravel\Facades\Gemini;
use Inertia\Inertia;

class SampleQuiz extends Controller
{
    public function index()
    {
        // $quiz = QuizModel::all();
        // $quiz = $quiz->forPage(1, 10); // Example pagination, adjust as needed

        // $quiz = $quiz[1]->getAttribute("q_statement");
        // // dd($quiz); // Debugging line to check the data

        // $result = Gemini::generativeModel(model: 'gemini-2.0-flash')->generateContent("rephrase the statement without changing the context also don't answer it, ", $quiz);

        return Inertia::render('Hello', [
            // 'quiz' => $quiz,
            // 'result' => $result->candidates[0]->content->parts[0]->text,
        ]);
    }
}
