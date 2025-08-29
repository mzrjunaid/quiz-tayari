<?php

namespace App\Http\Controllers;

use App\Models\Mcq;
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
                'tags' => session('tags'),
                'exam_types' => session('exam_types'),
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

        $subjects = Mcq::select('subject')
            ->distinct()
            ->whereNotNull('subject')
            ->where('subject', '!=', '')
            ->orderBy('subject')
            ->pluck('subject')
            ->map(function ($subject) {
                return [
                    'id' => $subject,
                    'name' => $subject
                ];
            });

        // Get unique topics with their subjects
        $topics = Mcq::select('topic', 'subject')
            ->distinct()
            ->whereNotNull('topic')
            ->where('topic', '!=', '')
            ->orderBy('topic')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->topic,
                    'name' => $item->topic,
                    'subject_id' => $item->subject
                ];
            });


        $ai_tags = $request->tags_new;
        // convert string tags to array if it's a string ['CSS', 'PMS', 'PCS', 'LLB', 'Judicial Exams', 'UPSC']

        if (is_string($ai_tags)) {
            $ai_tags = array_map('trim', explode(',', trim($ai_tags, '[]')));
        }
        // prepare tags for frontend
        $tags_new = collect($ai_tags)->map(function ($tag) {
            return [
                'id' => $tag,
                'name' => $tag,
            ];
        })->toArray();


        // Handle tags (assuming they're stored as JSON or comma-separated)
        $tags = collect();
        Mcq::select('tags')
            ->distinct()
            ->whereNotNull('tags')
            ->where('tags', '!=', '')
            ->get()
            ->each(function ($item) use ($tags) {
                $this->processTags($item->tags, $tags);
            });

        // Remove duplicates and format for frontend
        $tags = $tags->unique()
            ->sort()
            ->values()
            ->map(function ($tag) {
                return [
                    'id' => $tag,
                    'name' => $tag,
                ];
            });

        //merge tags with new tags from AI
        $tags = $tags->merge(collect($tags_new))->unique('id')->values();


        $ai_exam_types = $request->exam_types_new;

        // convert string exam_types to array if it's a string
        if (is_string($ai_exam_types)) {
            $ai_exam_types = array_map('trim', explode(',', trim($ai_exam_types, '[]')));
        }
        // prepare tags for frontend
        $exam_types_new = collect($ai_exam_types)->map(function ($tag) {
            return [
                'id' => $tag,
                'name' => $tag,
            ];
        })->toArray();


        // dd($exam_types_new);

        // Handle exam_types (assuming they're stored as JSON or comma-separated)
        $examTypes = collect();
        Mcq::select('exam_types')
            ->distinct()
            ->whereNotNull('exam_types')
            ->where('exam_types', '!=', '')
            ->get()
            ->each(function ($item) use ($examTypes) {
                $this->processTags($item->exam_types, $examTypes);
            });

        // Remove duplicates and format for frontend
        $examTypes = $examTypes->unique()
            ->sort()
            ->values()
            ->map(function ($examType) {
                return [
                    'id' => $examType,
                    'name' => $examType,
                ];
            });

        //merge exam types with new exam types from AI
        $examTypes = $examTypes->merge(collect($exam_types_new))->unique('id')->values();

        $mcq = McqsRephrase::where('q_id', $id)->first();

        // dd($request->all());

        return Inertia::render('McqsRephrase/EditNew', [
            'subjects' => $subjects,
            'topics' => $topics,
            'tags' => $tags,
            'exam_types' => $examTypes,
            'questionTypes' => [
                ['id' => 1, 'name' => 'Single Answer', 'value' => 'single'],
                ['id' => 2, 'name' => 'Multiple Answer', 'value' => 'multiple'],
                ['id' => 3, 'name' => 'True/False', 'value' => 'true_false'],
                ['id' => 4, 'name' => 'Single Answer (A only)', 'value' => 'single_a'],
            ],
            'mcq' => $mcq,
            'question' => $mcq->q_statement,
            'rephrased' => $request->rephrased,
            'explanation' => $request->explanation,
            'subject' => $request->subject,
            'topic' => $request->topic,
            'tags_new' => $tags_new,
            'exam_types_new' => $exam_types_new,
            'core_concept' => $request->core_concept,
            'current_affair' => $request->current_affair,
            'general_knowledge' => $request->general_knowledge,
        ]);
    }

    /**
     * Check if a string is valid JSON
     */
    private function isJson($string)
    {
        if (!is_string($string)) {
            return false;
        }
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }

    /**
     * Process tags/exam_types data and add to collection
     */
    /**
     * Process tags/exam_types data and add to collection
     */
    private function processTags($data, $collection)
    {
        // Handle array data (already decoded)
        if (is_array($data)) {
            foreach ($data as $item) {
                if (is_string($item) && !empty(trim($item))) {
                    $collection->push(trim($item));
                }
            }
            return;
        }

        // Handle string data
        if (is_string($data)) {
            // Handle JSON string
            if ($this->isJson($data)) {
                $decoded = json_decode($data, true);
                if (is_array($decoded)) {
                    $this->processTags($decoded, $collection);
                }
                return;
            }

            // Handle bracket format like [tag1, tag2, tag3]
            if (preg_match('/^\s*\[(.*)\]\s*$/', $data, $matches)) {
                $bracketContent = $matches[1];
                if (!empty(trim($bracketContent))) {
                    $items = explode(',', $bracketContent);
                    foreach ($items as $item) {
                        $cleanItem = trim($item);
                        if (!empty($cleanItem)) {
                            $collection->push($cleanItem);
                        }
                    }
                }
                return;
            }

            // Handle comma-separated values
            if (strpos($data, ',') !== false) {
                $items = explode(',', $data);
                foreach ($items as $item) {
                    if (!empty(trim($item))) {
                        $collection->push(trim($item));
                    }
                }
                return;
            }

            // Handle single value
            if (!empty(trim($data))) {
                $collection->push(trim($data));
            }
        }
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
                    "5. TOPIC: Mention a specific topic or subtopic inside that subject (e.g., World Capitals, Laws of Motion).\n\n" .
                    "6. CURRENT AFFAIRS: Check if the question is related to current events between 2023–2025. Respond CA: true or CA: false.\n\n" .
                    "7. GENERAL KNOWLEDGE: Check if the question is related to General Knowledge (static facts, history, geography, etc.). Respond GK: true or GK: false.\n\n" .
                    "8. TAGS: Check if the question is related to specific tags, dont include quatation marks but separate with commas (e.g., 'History', 'Geography').\n\n" .
                    "9. EXAM TYPES: Check if the question is related to specific exam types and response in EXAM SHORT FORMS, dont include quatation marks but separate with commas (e.g., 'MCAT', 'GRE').\n\n" .

                    "Format your response strictly as:\n" .
                    "REPHRASED: [your rephrased version]\n" .
                    "CORE CONCEPT: [your core concept]\n" .
                    "EXPLANATION: [your explanation]\n" .
                    "SUBJECT: [only subject]\n" .
                    "TOPIC: [only topic]\n" .
                    "TAGS: [only tags]\n" .
                    "EXAM TYPES: [only exam types]\n" .
                    "CA: [true/false]\n" .
                    "GK: [true/false]\n".
                    "Defficulty: [Easy/Medium/Hard]\n"
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
            $tags = $this->extractContent($response, 'TAGS:');
            $exam_types = $this->extractContent($response, 'EXAM TYPES:');
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
                    'tags' => $tags,
                    'exam_types' => $exam_types,
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
