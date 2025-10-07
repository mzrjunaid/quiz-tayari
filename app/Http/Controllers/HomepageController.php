<?php

namespace App\Http\Controllers;

use App\Http\Resources\McqResource;
use App\Http\Resources\PaperResource;
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
        ]);
    }

    /**
     * Display List of Papers
     */
    public function papers_list()
    {
        $papers = Paper::latest()->paginate(20)->appends(request()->query());

        return Inertia::render('Public/Papers', [
            'papers' => PaperResource::collection($papers),
        ]);
    }

    /**
     * Display List of Papers
     */
    public function papers_mcqs($slug)
    {


        $paper = Paper::where('slug', $slug)->firstOrFail();
        $mcqs = Mcq::where('paper_id', $paper->id)
            ->paginate(10); // 10 per page


        return Inertia::render('Public/PaperMcqs', [
            'paper' => $paper,
            'mcqs' => McqResource::collection($mcqs),
        ]);
    }
    /**
     * Display Paper MCQ
     */
    public function show_mcq(Paper $paper, Mcq $mcq)
    {
        // Optional: validate that MCQ actually belongs to this paper
        abort_unless($mcq->paper_id === $paper->id, 404);

        return Inertia::render('Public/Mcqs/Show', [
            'mcq' => McqResource::make($mcq),
        ]);
    }

    /**
     * Display contact us Page
     */
    public function contact_us()
    {
        return Inertia::render('Public/ContactUs');
    }

    /**
     * Display Privacy Policy Page
     */
    public function privacy_policy()
    {
        return Inertia::render('Public/PrivacyPolicy');
    }


    /**
     * Display Privacy Policy Page
     */
    public function terms_of_service()
    {
        return Inertia::render('Public/TermsOfServices');
    }

    /**
     * Display Privacy Policy Page
     */
    public function help_center()
    {
        return Inertia::render('Public/HelpCenter');
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
