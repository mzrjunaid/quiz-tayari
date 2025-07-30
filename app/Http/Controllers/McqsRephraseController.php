<?php

namespace App\Http\Controllers;

use App\Models\McqsRephrase;
use Illuminate\Http\Request;
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
    public function show(McqsRephrase $mcqsRephrase)
    {
        //
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
}
