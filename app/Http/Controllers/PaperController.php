<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaperRequest;
use App\Http\Requests\UpdatePaperRequest;
use App\Http\Resources\PaperResource;
use App\Models\Paper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class PaperController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {


        // Validation - keeping all your original rules plus missing filters
        $validator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:255',
            'is_active' => 'nullable|in:0,1,all',
            'is_verified' => 'nullable|in:0,1,all',
            'department' => 'nullable|string|max:100',           // Added missing validation
            'subject' => 'nullable|string|max:100',              // Added missing validation
            'testing_service' => 'nullable|string|max:50',       // Added missing validation
            'status' => 'nullable|string|in:today,upcoming,past,unscheduled', // Added missing validation
            'sort_by' => 'nullable|string|in:created_at,updated_at,question,id,title,department,subject,scheduled_at',
            'sort_order' => 'nullable|in:asc,desc',
            'sort' => 'nullable|string|in:created_at,updated_at,question,id,title,department,subject,scheduled_at', // Your original param
            'direction' => 'nullable|string|in:asc,desc',        // Your original param
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        // Get filter parameters
        $search = $request->get('search');
        $isActive = $request->get('is_active');
        $isVerified = $request->get('is_verified');

        // Your original sorting logic - supporting both parameter sets
        $sortBy = $request->get('sort_by', $request->get('sort', 'created_at'));
        $sortOrder = $request->get('sort_order', $request->get('direction', 'desc'));
        $perPage = $request->get('per_page', 10);

        // Your original validation arrays
        $allowedSorts = ['id', 'title', 'created_at', 'updated_at', 'question', 'department', 'subject', 'scheduled_at'];
        $sortBy = in_array($sortBy, $allowedSorts) ? $sortBy : 'created_at';
        $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';
        $perPage = in_array($perPage, [10, 25, 50, 100]) ? $perPage : 10;

        // Build optimized query
        $query = Paper::query();

        // FIXED: Your original search logic (the 'when' condition was broken)
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%")  // Fixed typo: descritption -> description
                    ->orWhere('department', 'LIKE', "%{$search}%")
                    ->orWhere('subject', 'LIKE', "%{$search}%");
            });
        }

        // ADDED: Missing is_active filter (was in validation but not implemented)
        if ($isActive !== null && $isActive !== 'all') {
            $query->where('is_active', (bool) $isActive);
        }

        // ADDED: Missing is_verified filter (was in validation but not implemented)
        if ($isVerified !== null && $isVerified !== 'all') {
            $query->where('is_verified', (bool) $isVerified);
        }

        // Your original filters - exactly as you had them
        if ($request->filled('department')) {
            $query->where('department', $request->get('department'));
        }

        if ($request->filled('subject')) {
            $query->where('subject', $request->get('subject'));
        }

        if ($request->filled('testing_service')) {
            $query->where('testing_services->short', $request->get('testing_service'));
        }

        if ($request->filled('status')) {
            $status = $request->get('status');
            switch ($status) {
                case 'today':
                    $query->scheduledToday();
                    break;
                case 'upcoming':
                    $query->upcoming();
                    break;
                case 'past':
                    $query->where('scheduled_at', '<', now());
                    break;
                case 'unscheduled':
                    $query->whereNull('scheduled_at');
                    break;
            }
        }

        // Your original sorting logic - exactly as you had it
        $sortBy = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        if ($sortBy === 'scheduled_at') {
            $query->orderByRaw('scheduled_at IS NULL, scheduled_at ' . $sortDirection);
        } else {
            $query->orderBy($sortBy, $sortDirection);
        }

        // Execute query
        $papers = $query->paginate($perPage)->withQueryString();

        // OPTIMIZED: Get filter options more efficiently with caching potential
        $filterOptions = $this->getFilterOptions();

        // Your original serial number logic - exactly as you had it
        $papers->through(function ($paper, $key) use ($papers) {
            $paper->serial_number = ($papers->currentPage() - 1) * $papers->perPage() + $key + 1;
            return $paper;
        });

        // Your original Inertia response - exactly as you had it
        return Inertia::render('Papers/Index', [
            'papers' => PaperResource::collection($papers),
            'filters' => $request->only(['search', 'department', 'subject', 'testing_service', 'status']),
            'sort' => [
                'field' => $sortBy,
                'direction' => $sortDirection,
            ],
            'filterOptions' => $filterOptions,
        ]);
    }

    /**
     * Get filter options - using your original working logic
     */
    private function getFilterOptions()
    {
        // Consider adding cache here for better performance:
        // return Cache::remember('paper_filter_options', 300, function () {

        // Your original working queries
        $departments = Paper::whereNotNull('department')
            ->distinct()
            ->pluck('department')
            ->sort()
            ->values();

        $subjects = Paper::whereNotNull('subject')
            ->distinct()
            ->pluck('subject')
            ->sort()
            ->values();

        // Your original working testing services query
        $testingServices = Paper::whereNotNull('testing_services')
            ->get()
            ->pluck('testing_services.short')
            ->unique()
            ->sort()
            ->values();

        return [
            'departments' => $departments,
            'subjects' => $subjects,
            'testingServices' => $testingServices,
        ];

        // });
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        // Get departments from existing papers
        $departments = Paper::whereNotNull('department')
            ->distinct()
            ->pluck('department')
            ->sort()
            ->values();

        // Get subjects from existing papers
        $subjects = Paper::whereNotNull('subject')
            ->distinct()
            ->pluck('subject')
            ->sort()
            ->values();

        // Get testing services from existing papers
        $commonTestingServices = Paper::whereNotNull('testing_services')
            ->get()
            ->pluck('testing_services')
            ->unique()
            ->values()
            ->filter() // Remove any null values
            ->map(function ($service) {
                return [
                    'short' => $service['short'] ?? '',
                    'long' => $service['long'] ?? '',
                ];
            })
            ->sortBy('short')
            ->values();

        return Inertia::render('Papers/Create', [
            'departments' => $departments,
            'subjects' => $subjects,
            'commonTestingServices' => $commonTestingServices,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaperRequest $request)
    {

        Paper::create($request->validated());

        return redirect()
            ->route('papers.index')
            ->with('success', 'Paper created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Paper $paper): Response
    {
        // $paper = Paper::findOrFail($id);

        // dd($paper);

        return Inertia::render('Papers/Show', [
            'paper' => (new PaperResource($paper))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Paper $paper): Response
    {

        // dd($paper);
        // Get departments from existing papers
        $departments = Paper::whereNotNull('department')
            ->distinct()
            ->pluck('department')
            ->sort()
            ->values();

        // Get subjects from existing papers
        $subjects = Paper::whereNotNull('subject')
            ->distinct()
            ->pluck('subject')
            ->sort()
            ->values();

        // Get testing services from existing papers
        $commonTestingServices = Paper::whereNotNull('testing_services')
            ->get()
            ->pluck('testing_services')
            ->unique()
            ->values()
            ->filter() // Remove any null values
            ->map(function ($service) {
                return [
                    'short' => $service['short'] ?? '',
                    'long' => $service['long'] ?? '',
                ];
            })
            ->sortBy('short')
            ->values();

        return Inertia::render('Papers/Edit', [
            'paper' => (new PaperResource($paper))->resolve(),
            'subjects' => $subjects,
            'departments' => $departments,
            'commonTestingServices' => $commonTestingServices,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaperRequest $request, Paper $paper)
    {
        $paper->update($request->validated());

        return redirect()
            ->route('papers.index')
            ->with('success', 'Paper updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Paper $paper)
    {
        $paper->delete();

        return redirect()
            ->route('papers.index')
            ->with('success', 'Paper deleted successfully!');
    }

    /**
     * Get papers for AJAX requests (useful for search autocomplete, etc.)
     */
    public function search(Request $request)
    {
        $query = Paper::query();

        if ($request->filled('q')) {
            $search = $request->get('q');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $papers = $query->limit(10)->get();

        return response()->json([
            'data' => PaperResource::collection($papers),
        ]);
    }

    /**
     * Bulk actions for multiple papers
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:delete,schedule,unschedule',
            'paper_ids' => 'required|array',
            'paper_ids.*' => 'exists:papers,id',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        $papers = Paper::whereIn('id', $request->paper_ids);

        switch ($request->action) {
            case 'delete':
                $count = $papers->count();
                $papers->delete();
                return back()->with('success', "Deleted {$count} papers successfully!");

            case 'schedule':
                $papers->update(['scheduled_at' => $request->scheduled_at]);
                return back()->with('success', 'Papers scheduled successfully!');

            case 'unschedule':
                $papers->update(['scheduled_at' => null]);
                return back()->with('success', 'Papers unscheduled successfully!');
        }
    }

    /**
     * Export papers (could be CSV, PDF, etc.)
     */
    public function export(Request $request)
    {
        // You can implement export functionality here
        // For example, using Laravel Excel or custom CSV generation

        return back()->with('info', 'Export functionality to be implemented.');
    }

    /**
     * Get dashboard stats for papers
     */
    public function stats()
    {
        $stats = [
            'total' => Paper::count(),
            'scheduled_today' => Paper::scheduledToday()->count(),
            'upcoming' => Paper::upcoming()->count(),
            'past' => Paper::where('scheduled_at', '<', now())->count(),
            'unscheduled' => Paper::whereNull('scheduled_at')->count(),
            'by_department' => Paper::whereNotNull('department')
                ->selectRaw('department, count(*) as count')
                ->groupBy('department')
                ->pluck('count', 'department'),
            'by_testing_service' => Paper::whereNotNull('testing_services')
                ->get()
                ->groupBy('testing_services.short')
                ->map(fn($group) => $group->count()),
        ];

        return response()->json($stats);
    }
}
