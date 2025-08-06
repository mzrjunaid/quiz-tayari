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
        // Fetch the MCQs from the database, ensuring to select the necessary fields
        // and paginate the results if needed.
        // Note: The 'all' method is not used here as it retrieves all records without
        // $mcqs = McqsRephrase::select('q_id', 'q_statement', 'option_A', 'option_B', 'option_C', 'option_D', 'right_choice', 'created_at')->paginate(50); // Ensure 'all' method is us ed to retrieve all records


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
    public function edit(McqsRephrase $mcqsRephrase)
    {
        //
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

    /**
     * Rephrase the specified MCQ.
     */
    public function rephrase(Request $request, $id)
    {
        $q_statement = $request->input('q_statement');

        if (!$q_statement) {
            return redirect()->route('mcqs-rephrase.show', $id)->with('error', 'No question statement provided.');
        }

        // Replace with actual Gemini logic later
        $result = Gemini::generativeModel(model: 'gemini-2.0-flash')
            ->generateContent("rephrase the statement without changing the context also don't answer it, ", $q_statement);

        if ($result) {
            // In real use, extract from Gemini's response
            $rephrased = $result->candidates[0]->content->parts[0]->text ?? null;

            return redirect()
                ->route('mcqs-rephrase.show', $id)
                ->with('success', 'Rephrased successfully.')
                ->with('rephrased', $rephrased);
        }

        return redirect()->route('mcqs-rephrase.show', $id)->with('error', 'No rephrased statement returned.');
    }
}
