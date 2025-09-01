<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaperRequest;
use App\Http\Requests\UpdatePaperRequest;
use App\Http\Resources\PaperResource;
use App\Models\Paper;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaperController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Paper::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        // Department filter
        if ($request->filled('department')) {
            $query->where('department', $request->get('department'));
        }

        // Subject filter
        if ($request->filled('subject')) {
            $query->where('subject', $request->get('subject'));
        }

        // Testing service filter
        if ($request->filled('testing_service')) {
            $query->where('testing_services->short', $request->get('testing_service'));
        }

        // Status filter
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

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        if ($sortBy === 'scheduled_at') {
            $query->orderByRaw('scheduled_at IS NULL, scheduled_at ' . $sortDirection);
        } else {
            $query->orderBy($sortBy, $sortDirection);
        }

        $papers = $query->paginate(15)->withQueryString();

        // Get filter options for dropdowns
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

        $testingServices = Paper::whereNotNull('testing_services')
            ->get()
            ->pluck('testing_services.short')
            ->unique()
            ->sort()
            ->values();

        // Add serial numbers to the collection
        $papers->through(function ($paper, $key) use ($papers) {
            // Calculate the serial number based on pagination
            $paper->serial_number = ($papers->currentPage() - 1) * $papers->perPage() + $key + 1;
            return $paper;
        });

        return Inertia::render('papers/index', [
            'papers' => PaperResource::collection($papers),
            'filters' => $request->only(['search', 'department', 'subject', 'testing_service', 'status']),
            'sort' => [
                'field' => $sortBy,
                'direction' => $sortDirection,
            ],
            'filterOptions' => [
                'departments' => $departments,
                'subjects' => $subjects,
                'testingServices' => $testingServices,
            ],
        ]);
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
            'commonTestingServices' => $commonTestingServices,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaperRequest $request)
    {
        $paper = Paper::create($request->validated());

        return redirect()
            ->route('papers.show', $paper)
            ->with('success', 'Paper created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Paper $paper): Response
    {
        return Inertia::render('Papers/Show', [
            'paper' => new PaperResource($paper),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Paper $paper): Response
    {
        // Get departments from existing papers
        $departments = Paper::whereNotNull('department')
            ->distinct()
            ->pluck('department')
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
            'paper' => new PaperResource($paper),
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
            ->route('papers.show', $paper)
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
