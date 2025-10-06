<?php

namespace App\Http\Controllers;

use App\Models\McqsRephrase;
use App\Models\Paper;
use App\Models\Mcq;
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
                'old_mcqs' => [],
            ]);
        }

        // ✅ Search in Papers
        $papers = Paper::select('id', 'title', 'slug')
            ->where('title', 'like', "%{$query}%")
            ->limit(10)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'slug' => $p->slug,
                'title' => $p->title,
                // send route name to frontend
                'link' => 'public-papers.show',
            ]);

        // ✅ Search in MCQs
        $mcqs = Mcq::select('id', 'question', 'slug')
            ->where('question', 'like', "%{$query}%")
            ->limit(10)
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'slug' => $m->slug,
                'title' => $m->question,
                'link' => 'mcqs.show',
            ]);

        // ⚠ FIXES BELOW: `McqsRephrase` probably doesn’t have `slug` or `q_question`
        // so we use what actually exists in your table
        $old_mcqs = McqsRephrase::select('q_id', 'q_statement')
            // fixed like query (had `$` which breaks pattern)
            ->where('q_statement', 'like', "%{$query}%")
            ->limit(10)
            ->get()
            ->map(fn($m) => [
                'id' => $m->q_id,
                // no slug column in McqsRephrase table
                'slug' => null,
                // use correct column name `q_statement`
                'title' => $m->q_statement,
                'link' => 'mcqs.show',
            ]);

        return Inertia::render('Search/Index', [
            'query' => $query,
            'papers' => $papers,
            'mcqs' => $mcqs,
            'old_mcqs' => $old_mcqs,
        ]);
    }

    public function suggestions(Request $request)
    {
        $query = trim($request->input('q', ''));
        if (!$query) return response()->json([]);

        $papers = Paper::select('id', 'title', 'slug')
            ->where('title', 'like', "%{$query}%")
            ->limit(3)
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'slug' => $m->slug,
                'title' => $m->title,
                'link' => route('public-papers.show', $m->slug),
                'type' => 'Paper',
            ]);

        $mcqs = Mcq::select('id', 'question', 'slug')
            ->where('question', 'like', "%{$query}%")
            ->limit(3)
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'slug' => $m->slug,
                'title' => $m->question,
                'link' => route('admin.mcqs.show', $m->slug),
                'type' => 'MCQ',
            ]);

        $old_mcqs = McqsRephrase::select('q_id', 'q_statement')
            ->where('q_statement', 'like', "%{$query}%")
            ->limit(3)
            ->get()
            ->map(fn($m) => [
                'id' => $m->q_id,
                'title' => $m->q_statement,
                'link' => route('admin.mcqs.show', $m->q_id),
                'type' => 'Old MCQ',
            ]);

        return response()->json(
            collect($papers)
                ->merge($mcqs)
                ->merge($old_mcqs)
                ->take(9)
                ->values()
        );
    }
}
