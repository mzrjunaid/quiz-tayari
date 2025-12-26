<?php

namespace App\Http\Controllers;

use App\Http\Resources\McqResource;
use App\Http\Resources\OldMcqResource;
use App\Http\Resources\OldPaperResource;
use App\Http\Resources\PaperResource;
use App\Models\Mcq;
use App\Models\McqsRephrase;
use App\Models\Old\OldDepartment;
use App\Models\Old\OldMcq;
use App\Models\Old\OldPaper;
use App\Models\Old\OldTestingService;
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
            'meta' => [
                'title' => 'Pak Quiz – AI-Powered MCQs & Job Test Preparation',
                'description' => 'Pak Quiz offers a vast collection of AI-Enhanced multiple-choice questions (MCQs) to help you prepare for various exams (PPSC, NTS, FPSC, CSS, PMS,... etc.)',
            ],
        ]);
    }

    /**
     * Display List of Papers
     */
    public function papers_list()
    {
        $papers = Paper::whereHas('mcqs') // only papers that have mcqs
            // ->withCount('mcqs') // optional: adds mcqs_count column
            ->latest()
            ->paginate(20)
            ->appends(request()->query());

        $oldpapers = OldPaper::select('paper_id', 'paper_year', 'slug', 'paper')->paginate(50)->withQueryString();

        return Inertia::render('Public/Papers', [
            'papers' => PaperResource::collection($papers),
            'oldpapers' => $oldpapers,
        ]);
    }

    /**
     * Display List of Old Papers
     */
    public function old_papers_list()
    {
        $oldpapers = OldPaper::query()
            ->select('paper_id', 'paper_year', 'testing_service_id', 'dept_id', 'slug', 'paper')
            ->with([
                'testingService:testing_service_id,testing_service',
                'department:dept_id,department',
            ])
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Public/OldPapers/OldPapersList', [
            'oldpapers' =>  OldPaperResource::collection($oldpapers),
        ]);
    }

    /**
     * Display List of old Papers Mcqs
     */
    public function old_papers_mcqs($slug)
    {


        $paper = OldPaper::where('slug', $slug)->firstOrFail();
        $oldpaper = OldPaper::query()
            ->select('paper_id', 'paper_year', 'testing_service_id', 'dept_id', 'slug', 'paper')
            ->with([
                'testingService:testing_service_id,testing_service',
                'department:dept_id,department',
            ])->where('slug', $slug)->firstOrFail();

        $mcqs = OldMcq::query()
            ->select('q_id', 'slug', 'q_statement', 'option_A', 'option_B', 'option_C', 'option_D', 'right_choice', 'paper_id', 'syllabus_id', 'testing_service_id', 'publish', 'created_at')
            ->with([
                'paper:paper_id,paper',
                'subject:syllabus_id,syllabus',
                'testingService:testing_service_id,testing_service',
            ])->where('paper_id', $paper->paper_id)->paginate(10);
        // $mcqs = McqsRephrase::where('paper_id', $paper->paper_id)
        //     ->paginate(10); // 10 per page

        return Inertia::render('Public/OldPapers/OldPaperMcqs', [
            'paper' => OldPaperResource::make($oldpaper),
            'mcqs' => OldMcqResource::collection($mcqs),
        ]);
    }

    /**
     * Display List of Papers Mcqs
     */
    public function papers_mcqs($slug)
    {


        $paper = Paper::where('slug', $slug)->firstOrFail();
        $mcqs = Mcq::where('paper_id', $paper->id)
            ->paginate(10);
        $mcqs->through(function ($mcq, $key) use ($mcqs) {
            // Calculate the serial number based on pagination
            $mcq->serial_number = ($mcqs->currentPage() - 1) * $mcqs->perPage() + $key + 1;
            return $mcq;
        });

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
     * Display Paper MCQ
     */
    public function single_show_mcq(string $mcq)
    {
        $newMcq = Mcq::where('slug', $mcq)->first();
        if ($newMcq) {
            return Inertia::render('Public/Mcqs/Show', [
                'mcq' => McqResource::make($newMcq),
            ]);
        }

        // $mcq = McqsRephrase::where('slug', $mcq)->first();

        $mcq = OldMcq::query()
            ->select('q_id', 'slug', 'q_statement', 'option_A', 'option_B', 'option_C', 'option_D', 'right_choice', 'paper_id', 'syllabus_id', 'testing_service_id', 'publish', 'created_at')
            ->with([
                'paper:paper_id,paper',
                'subject:syllabus_id,syllabus',
                'testingService:testing_service_id,testing_service',
            ])->where('slug', $mcq)->firstOrFail();
        return Inertia::render('Public/OldPapers/OldMcq', [
            'mcq' => OldMcqResource::make($mcq),
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
