<?php

namespace App\Http\Controllers;

use App\Http\Resources\McqResource;
use App\Http\Resources\PaperResource;
use App\Models\Homepage;
use App\Models\Mcq;
use App\Models\Paper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomepageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $mcqs = Mcq::latest()->paginate('6')->appends(request()->query());

        // dd($mcqs);

        // Add serial numbers to the collection
        $mcqs->through(function ($mcq, $key) use ($mcqs) {
            // Calculate the serial number based on pagination
            $mcq->serial_number = ($mcqs->currentPage() - 1) * $mcqs->perPage() + $key + 1;
            return $mcq;
        });


        return Inertia::render('welcome', [
            'mcqs' =>  McqResource::collection($mcqs),
            'mcqMode' => session('mcqMode', false)
        ]);
    }

    /**
     * Display List of Papers
     */
    public function papers_list()
    {
        $papers = Paper::latest()->paginate(6)->appends(request()->query());

        return Inertia::render('Public/Papers', [
            'papers' => PaperResource::collection($papers),
        ]);
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
    public function show(Homepage $homepage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Homepage $homepage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Homepage $homepage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Homepage $homepage)
    {
        //
    }

    /**
     * Set MCQ Mode in session
     */

    public function setMcqMode(Request $request)
    {
        $request->validate([
            'mcqMode' => 'required|boolean',
        ]);
        session(['mcqMode' => $request->mcqMode]);
        return back();
    }
}
