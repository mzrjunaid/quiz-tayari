<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMcqRequest;
use App\Http\Resources\McqResource;
use App\Models\Mcq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\Facades\Auth;

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


    public function store(StoreMcqRequest $request)
    {
        $validated = $request->getProcessedData();

        DB::beginTransaction();
        try {
            $slug = Str::slug($validated['question']);

            $mcqData = [
                'slug' => $slug,
                'question' => $validated['question'],
                'explanation' => $validated['explanation'] ?? null,
                'option_a' => $validated['option_a'],
                'option_b' => $validated['option_b'],
                'option_c' => $validated['option_c'] ?? null,
                'option_d' => $validated['option_d'] ?? null,
                'option_e' => $validated['option_e'] ?? null,
                'correct_answer' => $validated['correct_answer'],
                'correct_answers' => is_array($validated['correct_answers'])
                    ? json_encode($validated['correct_answers'])
                    : null,
                'subject' => $validated['subject'],
                'topic' => $validated['topic'],
                'difficulty_level' => $validated['difficulty_level'] ?? 'medium',
                'question_type' => $validated['question_type'] ?? 'single',
                'language' => $validated['language'] ?? 'en',
                'current_affair' => $validated['current_affair'] ?? false,
                'general_knowledge' => $validated['general_knowledge'] ?? true,
                'is_active' => $validated['is_active'] ?? true,
                'is_verified' => $validated['is_verified'] ?? false,
                'tags' => is_array($validated['tags'])
                    ? json_encode($validated['tags'])
                    : null,
                'exam_types' => is_array($validated['exam_types'])
                    ? json_encode($validated['exam_types'])
                    : null,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ];

            // Add debug logging
            Log::info('Attempting to create MCQ with data:', $mcqData);

            $mcq = Mcq::create($mcqData);

            if (!$mcq) {
                throw new Exception('Failed to create MCQ record');
            }

            DB::commit();

            Log::info('MCQ created successfully', [
                'mcq_id' => $mcq->id,
                'slug' => $mcq->slug
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'MCQ created successfully',
                    'mcq' => new McqResource($mcq)
                ], 201);
            }

            return redirect()
                ->route('mcqs.index')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'MCQ created successfully'
                ]);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('MCQ creation failed:', [
                'error' => $e->getMessage(),
                'data' => $mcqData ?? null
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Failed to create MCQ',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()
                ->withInput()
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Failed to create MCQ: ' . $e->getMessage()
                ]);
        }
    }

    /**
     * Generate a slug from the question text
     *
     * @param string $question
     * @return string
     */
    private function generateSlugFromQuestion(string $question): string
    {
        // Clean the question text and create a meaningful slug
        $cleanQuestion = strip_tags($question);
        $cleanQuestion = preg_replace('/[^\w\s\u0600-\u06FF-]/', '', $cleanQuestion); // Support Urdu characters

        // Take first 12 words for slug to keep it manageable
        $words = explode(' ', trim($cleanQuestion));
        $slugWords = array_slice($words, 0, 12);
        $baseSlug = implode(' ', $slugWords);

        // Generate slug with language prefix for better organization
        $languagePrefix = request('language', 'en');
        $slug = $languagePrefix . '-' . Str::slug($baseSlug);

        return $slug;
    }

    /**
     * Ensure slug is unique by appending timestamp and counter if needed
     *
     * @param string $baseSlug
     * @return string
     */
    private function ensureUniqueSlug(string $baseSlug): string
    {
        $slug = $baseSlug;
        $counter = 1;

        // Check if base slug exists
        while (Mcq::where('slug', $slug)->exists()) {
            if ($counter === 1) {
                // First duplicate gets timestamp
                $slug = $baseSlug . '-' . time();
            } else {
                // Further duplicates get counter
                $slug = $baseSlug . '-' . time() . '-' . $counter;
            }
            $counter++;

            // Safety break to prevent infinite loop
            if ($counter > 100) {
                $slug = $baseSlug . '-' . uniqid();
                break;
            }
        }

        return $slug;
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
    public function update(StoreMcqRequest $request, Mcq $mcq)
    {
        // validate the request
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            // Update MCQ data according to your table structure
            $mcqData = [
                'question' => $validated['question'],
                'explanation' => $validated['explanation'],
                'option_a' => $validated['option_a'],
                'option_b' => $validated['option_b'],
                'option_c' => $validated['option_c'],
                'option_d' => $validated['option_d'],
                'option_e' => $validated['option_e'],
                'correct_answer' => $validated['correct_answer'],
                'correct_answers' => !empty($validated['correct_answers']) ? json_encode($validated['correct_answers']) : null,
                'subject' => $validated['subject'],
                'topic' => $validated['topic'],
                'difficulty_level' => $validated['difficulty_level'] ?? 'medium',
                'question_type' => $validated['question_type'] ?? 'single_correct',
                'language' => $validated['language'] ?? 'en',
                'is_active' => $validated['is_active'] ?? true,
                'is_verified' => $validated['is_verified'] ?? false,
                'tags' => !empty($validated['tags']) ? $validated['tags'] : null,
                'exam_types' => !empty($validated['exam_types']) ? $validated['exam_types'] : null,
                'updated_by' => Auth::id(),
            ];

            // Update the MCQ record
            $mcq->update($mcqData);

            DB::commit();

            // Log successful update
            Log::info('MCQ updated successfully', [
                'mcq_id' => $mcq->id,
                'slug' => $mcq->slug,
                'user_id' => Auth::id(),
                'subject' => $mcq->subject,
                'topic' => $mcq->topic,
                'question_type' => $mcq->question_type
            ]);

            return redirect()->route('mcqs.index')
                ->with('flash', [
                    'success' => 'MCQ updated successfully.',
                    'data' => [
                        'id' => $mcq->id,
                        'slug' => $mcq->slug,
                        'question' => Str::limit($mcq->question, 100)
                    ]
                ]);
        } catch (ValidationException $e) {
            DB::rollBack();
            throw $e; // Let Inertia handle validation errors
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to update MCQ', [
                'error' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null,
                'user_id' => Auth::id(),
                'mcq_id' => $mcq->id,
                'request_data' => $request->except(['_token'])
            ]);
            return back()
                ->withInput()
                ->with('flash', [
                    'error' => 'Failed to update MCQ. Please try again.'
                ]);
        }
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
