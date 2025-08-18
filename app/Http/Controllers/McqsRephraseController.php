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
                'core_concept' => session('core_concept'),
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
                "You are an expert quiz content processor. Perform the following tasks for this MCQ statement: '{$q_statement}'\n\n" .

                    "1. REPHRASED: Rewrite the statement in clear, exam-friendly language without changing its meaning.\n\n" .
                    "2. CORE CONCEPT: Extract the core concept being tested (e.g., 'Capital of France', 'Newton’s 2nd Law', 'Pakistani Constitution 1973').\n\n" .
                    "3. EXPLANATION: Provide a detailed explanation (4–6 lines). Explain why the correct answer is correct and, if useful, add an extra fact.\n\n" .
                    "4. SUBJECT: Identify the broad subject (e.g., General Knowledge, Pakistan Studies, Islamic Studies, Science, Mathematics, English).\n\n" .
                    "5. TOPIC: Mention a specific topic or subtopic inside that subject (e.g., General Knowledge → World Capitals, Science → Physics → Laws of Motion).\n\n" .
                    "6. CURRENT AFFAIRS: Check if the question is related to current events between 2023–2025. Respond CA: true or CA: false.\n\n" .
                    "7. GENERAL KNOWLEDGE: Check if the question is related to General Knowledge (static facts, history, geography, etc.). Respond GK: true or GK: false.\n\n" .

                    "Format your response strictly as:\n" .
                    "REPHRASED: [your rephrased version]\n" .
                    "CORE CONCEPT: [your core concept]\n" .
                    "EXPLANATION: [your explanation]\n" .
                    "SUBJECT: [only subject]\n" .
                    "TOPIC: [only topic]\n" .
                    "CA: [true/false]\n" .
                    "GK: [true/false]\n"
            );

            $response = $combinedResult->candidates[0]->content->parts[0]->text ?? null;

            if (!$response) {
                return $this->redirectWithError($id, 'No response received from AI service.');
            }

            // Parse the structured response
            $rephrased = $this->extractContent($response, 'REPHRASED:');
            $core_concept = $this->extractContent($response, 'CORE CONCEPT:');
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
                    'core_concept' => $core_concept,
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

    private function extractContent(string $text, string $marker, string $type = 'string')
    {
        // Pattern ensures it matches the marker line until the next ALL-CAPS marker or end of string
        $pattern = '/' . preg_quote($marker, '/') . '\s*(.+?)(?=\n[A-Z][A-Z ]*?:|$)/s';

        if (preg_match($pattern, $text, $matches)) {
            $value = trim($matches[1]);

            // Normalize whitespace
            $value = preg_replace('/\s+/', ' ', $value);

            // Convert booleans if type is boolean
            if ($type === 'bool') {
                $normalized = strtolower($value);
                if (in_array($normalized, ['true', 'yes', '1'])) {
                    return true;
                } elseif (in_array($normalized, ['false', 'no', '0'])) {
                    return false;
                }
            }

            return $value !== '' ? $value : null;
        }

        return null;
    }
}
