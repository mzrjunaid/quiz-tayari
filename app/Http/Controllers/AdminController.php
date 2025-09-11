<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Mcq;
use App\Models\McqsRephrase;
use App\Models\Paper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stats = [
            'mcqs' => Mcq::count(),
            'papers' => Paper::count(),
            'old_mcqs' => McqsRephrase::count(),
            'recent_activity' => [
                'mcqs_today' => Mcq::whereDate('created_at', today())->count(),
                'updated_today' => Mcq::whereDate('updated_at', today())->count(),
                // 'rephrases_today' => McqsRephrase::whereDate('created_at', today())->count(),
                'papers_this_week' => Paper::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            ],
            'rephrase_stats' => [
                'total_rephrased' => McqsRephrase::where('is_rephrased', true)->count(),
                'pending_count' => McqsRephrase::where('is_rephrased', false)->orWhereNull('is_rephrased')->count(),
            ],
            'data_entry_metrics' => [
                'avg_mcqs_per_paper' => Paper::count() > 0 ? round(Mcq::count() / Paper::count(), 2) : 0,
            ]
        ];

        dd($stats);

        return Inertia::render('Dashboard', [
            'stats' => $stats
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
    public function show(Admin $admin)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Admin $admin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Admin $admin)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Admin $admin)
    {
        //
    }
}
