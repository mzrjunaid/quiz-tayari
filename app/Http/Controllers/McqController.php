<?php

namespace App\Http\Controllers;

use App\Http\Resources\McqResource;
use App\Models\Mcq;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class McqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:255', // Optional search string
            'is_active' => 'nullable|in:0,1,all', // Must be '0', '1', or 'all'
            'is_verified' => 'nullable|in:0,1,all', // Must be '0', '1', or 'all'
            'sort_by' => 'nullable|string|in:created_at,updated_at,name,id', // Allowed sort fields
            'sort_order' => 'nullable|in:asc,desc', // Allowed sort orders
            'per_page' => 'nullable|integer|min:1|max:100', // Pagination limit
        ]);
        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422); // Unprocessable Entity
        }

        // Get filter parameters
        $search = $request->get('search');
        $isActive = $request->get('is_active');
        $isVerified = $request->get('is_verified');
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $perPage = $request->get('per_page', 10);

        // Validate sort parameters
        $allowedSorts = ['id', 'question', 'created_at', 'is_active', 'is_verified'];
        $sortBy = in_array($sortBy, $allowedSorts) ? $sortBy : 'created_at';
        $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';
        $perPage = in_array($perPage, [10, 25, 50, 100]) ? $perPage : 10;

        $mcqs = Mcq::query()
            ->select([
                'id',
                'slug',
                'question',
                'option_a',
                'option_b',
                'option_c',
                'option_d',
                'correct_answer',
                'is_active',
                'is_verified',
                'created_at',
                // 'question_type',
                // 'subject',
                // 'tags',
                // 'reference',
            ])
            // Search filter
            ->when($search, function ($query, $search) {
                $columns = ['question', 'option_a', 'option_b', 'option_c', 'option_d'];

                $query->whereIn('id', function ($subQuery) use ($search, $columns) {
                    $subQuery->select('id')->from('mcqs');

                    foreach ($columns as $column) {
                        $subQuery->orWhere($column, 'LIKE', "%{$search}%");
                    }
                });
            })

            // Active status filter
            ->when($isActive !== 'all', function ($query) use ($isActive) {
                if ($isActive !== null) {
                    $query->where('is_active', $isActive === '1');
                }
            })

            // Verified status filter
            ->when($isVerified !== 'all', function ($query) use ($isVerified) {
                if ($isVerified !== null) {
                    $query->where('is_verified', $isVerified === '1');
                }
            })

            // Sorting
            ->orderBy($sortBy, $sortOrder)
            // Secondary sort for consistency
            ->when($sortBy !== 'id', function ($query) {
                $query->orderBy('id', 'desc');
            })
            ->paginate($perPage)
            ->withQueryString(); // Preserves all query parameters



        return Inertia::render('Mcqs/Index', [
            'mcqs' => $mcqs,
            'filters' => [
                'search' => $search,
                'is_active' => $isActive,
                'is_verified' => $isVerified,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => (int) $perPage, // Ensure it's an integer
                'page' => $mcqs->currentPage(), // Add current page to filters
            ],
            'stats' => [
                'total' => $mcqs->total(),
                'active' => Mcq::where('is_active', true)->count(),
                'verified' => Mcq::where('is_verified', true)->count(),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get unique subjects
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

        return inertia('Mcqs/Create', [
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        dd($request);
        // $validated = $request->validate([
        //     'question' => 'required|string',
        //     'explanation' => 'required|string',
        //     'option_a' => 'required|string',
        //     'option_b' => 'required|string',
        //     'option_c' => 'required|string',
        //     'option_d' => 'required|string',
        //     'option_e' => 'nullable|string',
        //     'correct_answer' => 'required|string|in:A,B,C,D,E',
        //     'subject' => 'required|string',
        //     'topic' => 'required|string',
        //     'difficulty_level' => 'required|string|in:easy,medium,hard',
        //     'question_type' => 'required|string|in:single,multiple',
        //     'tags' => 'nullable|array',
        //     'exam_types' => 'nullable|array',
        // ]);

        // $mcq = Mcq::create($validated);

        // return redirect()->route('mcqs.index')
        //     ->with('success', 'MCQ created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        // dd($slug);
        $mcq = $this->findMcqBySlug($slug);
        // dd($mcq);
        if (!$mcq) {
            abort(404);
        }
        return Inertia::render('Mcqs/Show', [
            'mcq' => new McqResource($mcq),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($slug)
    {
        // dd($slug);
        $mcq = $this->findMcqBySlug($slug);
        // dd($mcq);
        if (!$mcq) {
            abort(404);
        }
        return Inertia::render('Mcqs/Edit', [
            'mcq' => new McqResource($mcq),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Mcq $mcq)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mcq $mcq)
    {
        //
    }


    /**
     * Find MCQ by slug with relationships loaded
     *
     * @param string $slug
     * @return Mcq
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    private function findMcqBySlug(string $slug): Mcq
    {
        return Mcq::with([
            'creator:id,name,email',
            'updater:id,name,email',
            'verifier:id,name,email'
        ])
            ->where('slug', $slug)
            ->firstOrFail();
    }
}
