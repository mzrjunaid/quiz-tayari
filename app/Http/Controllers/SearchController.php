<?php

namespace App\Http\Controllers;

use App\Models\Paper;
use App\Models\Mcq;
use App\Models\Job;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = trim($request->input('q', ''));

        if (!$query) {
            return Inertia::render('Search/Index', [
                'query' => '',
                'papers' => [],
                'mcqs' => [],
                'jobs' => [],
            ]);
        }

        // 🔹 Search in Papers
        $papers = Paper::select('id', 'title', 'slug')
            ->where('title', 'like', "%{$query}%")
            ->limit(10)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'link' => route('public-papers.show', $p->slug),
            ]);

        // 🔹 Search in MCQs
        $mcqs = Mcq::select('id', 'question')
            ->where('question', 'like', "%{$query}%")
            ->limit(10)
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'title' => $m->question,
                'link' => route('mcqs.show', $m->id),
            ]);

        // 🔹 Search in Jobs
        // $jobs = Job::select('id', 'title', 'slug')
        //     ->where('title', 'like', "%{$query}%")
        //     ->limit(10)
        //     ->get()
        //     ->map(fn($j) => [
        //         'id' => $j->id,
        //         'title' => $j->title,
        //         'link' => route('jobs.show', $j->slug),
        //     ]);

        return Inertia::render('Search/Index', [
            'query' => $query,
            'papers' => $papers,
            'mcqs' => $mcqs,
            // 'jobs' => $jobs,
        ]);
    }

    public function suggestions(Request $request)
    {
        $query = trim($request->input('q', ''));
        if (!$query) return response()->json([]);

        $papers = Paper::select('id', 'title')
            ->where('title', 'like', "%{$query}%")
            ->limit(3)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                // 'slug' => $p->slug,
                'title' => $p->title,
                'link' => route('public-papers.show', $p->slug),
                'type' => 'Paper',
            ]);

        $mcqs = Mcq::select('id', 'question')
            ->where('question', 'like', "%{$query}%")
            ->limit(3)
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'title' => $m->question,
                'link' => route('mcqs.show', $m->id),
                'type' => 'MCQ',
            ]);

        // $jobs = Job::select('id', 'title')
        //     ->where('title', 'like', "%{$query}%")
        //     ->limit(3)
        //     ->get()
        //     ->map(fn($j) => [
        //         'id' => $j->id,
        //         'title' => $j->title,
        //         'link' => route('jobs.show', $j->id),
        //         'type' => 'Job',
        //     ]);

        return response()->json(
            collect($papers)
                ->merge($mcqs)
                // ->merge($jobs)
                ->take(9)
                ->values()
        );
    }
}
