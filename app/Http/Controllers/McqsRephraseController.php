<?php

namespace App\Http\Controllers;

use App\Models\McqsRephrase;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class McqsRephraseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $data = McqsRephrase::select('q_id', 'q_statement', 'option_A', 'option_B', 'option_C', 'option_D', 'right_choice', 'created_at')->paginate(50)->withQueryString();; // Ensure 'all' method is used to retrieve all records

        // Return the view with the MCQs data
        return Inertia::render('McqsRephrase/Index', [
            'mcq_data' => $data, // Ensure 'data' key exists
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $mcq = McqsRephrase::where('q_id', $id)->first();

            if (!$mcq) {
                return Inertia::render('McqsRephrase/Show', [
                    'error' => 'MCQ not found',
                    'mcq' => null,
                ]);
            }

            return Inertia::render('McqsRephrase/Show', [
                'mcq' => $mcq,
                'rephrased' => session('rephrased'),
                'explanation' => session('explanation'),
                'subject' => session('subject'),
                'topic' => session('topic'),
                'current_affair' => session('current_affair'),
                'general_knowledge' => session('general_knowledge'),
                'success' => session('success'),
                'error' => session('error'),
            ]);
        } catch (\Exception $e) {
            Log::error('MCQ Show Error: ' . $e->getMessage());

            return Inertia::render('McqsRephrase/Show', [
                'error' => 'Something went wrong. Please try again later.',
                'mcq' => null,
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id, Request $request)
    {
        $mcq = McqsRephrase::where('q_id', $id)->first();

        return Inertia::render('McqsRephrase/Edit', [
            'mcq' => $mcq,
            'rephrased' => $request->rephrased,
            'explanation' => $request->explanation,
            'subject' => $request->subject,
            'current_affair' => $request->current_affair,
            'general_knowledge' => $request->general_knowledge,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, McqsRephrase $mcqsRephrase)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(McqsRephrase $mcqsRephrase)
    {
        //
    }

    public function rephrase(Request $request, $id)
    {
        $q_statement = $request->input('q_statement');

        if (!$q_statement) {
            return $this->redirectWithError($id, 'No question statement provided.');
        }

        try {
            $model = Gemini::generativeModel(model: 'gemini-2.0-flash');

            // Single API call for better efficiency
            $combinedResult = $model->generateContent(
                "Please perform four tasks for this statement: '{$q_statement}'\n\n" .
                    "1. REPHRASE: Rephrase the statement without changing the context (don't answer it)\n" .
                    "2. EXPLANATION: Explain the asnwer in 5 lines with details\n\n" .
                    "3. SUBJECT: Get a statment's subject from which book or subject it could be and sub-topic as well.\n\n" .
                    "4. CURRENT AFFAIR: Check the statement if this is related to current affairs 2023-25 then response CA: with true or false.\n\n" .
                    "4. GENERAL KNOWLEDGE: check the statement if this is related to General Knowledge then response GK: with true or false.\n\n" .
                    "Format your response as:\n" .
                    "REPHRASED: [your rephrased version]\n" .
                    "EXPLANATION: [your explanation]\n" .
                    "SUBJECT: [only mention subject here]\n" .
                    "TOPIC: [only mention topic here]\n" .
                    "CA: [your response true or false]\n" .
                    "GK: [your response true or false]\n"
            );

            $response = $combinedResult->candidates[0]->content->parts[0]->text ?? null;

            if (!$response) {
                return $this->redirectWithError($id, 'No response received from AI service.');
            }

            // Parse the structured response
            $rephrased = $this->extractContent($response, 'REPHRASED:');
            $explanation = $this->extractContent($response, 'EXPLANATION:');
            $subject = $this->extractContent($response, 'SUBJECT:');
            $topic = $this->extractContent($response, 'TOPIC:');
            // Extract current affairs and general knowledge sections
            $current_affair = $this->extractContent($response, 'CA:');
            $general_knowledge = $this->extractContent($response, 'GK:');

            if (!$rephrased) {
                return $this->redirectWithError($id, 'No rephrased statement returned.');
            }

            return redirect()
                ->route('rephrase.show', $id)
                ->with([
                    'success' => 'Rephrased successfully.',
                    'rephrased' => $rephrased,
                    'explanation' => $explanation,
                    'subject' => $subject,
                    'topic' => $topic,
                    'current_affair' => $current_affair,
                    'general_knowledge' => $general_knowledge,

                ]);
        } catch (\Exception $e) {
            return $this->redirectWithError($id, 'Failed to generate content: ' . $e->getMessage());
        }
    }

    private function redirectWithError($id, $message)
    {
        return redirect()->route('rephrase.show', $id)->with('error', $message);
    }

    private function extractContent($text, $marker)
    {
        $pattern = '/' . preg_quote($marker, '/') . '\s*(.+?)(?=\n[A-Z]+:|$)/s';
        preg_match($pattern, $text, $matches);
        return isset($matches[1]) ? trim($matches[1]) : null;
    }
}
