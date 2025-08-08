<?php

namespace App\Http\Controllers;

use App\Models\Mcq;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class McqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

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
                'question',
                'option_a',
                'option_b',
                'option_c',
                'option_d',
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
                $query->where(function ($q) use ($search) {
                    $q->where('question', 'LIKE', "%{$search}%")
                        ->orWhere('option_a', 'LIKE', "%{$search}%")
                        ->orWhere('option_b', 'LIKE', "%{$search}%")
                        ->orWhere('option_c', 'LIKE', "%{$search}%")
                        ->orWhere('option_d', 'LIKE', "%{$search}%");
                });
            })

            // Active status filter
            ->when($isActive !== null, function ($query) use ($isActive) {
                $query->where('is_active', (bool) $isActive);
            })
            // Verified status filter
            ->when($isVerified !== null, function ($query) use ($isVerified) {
                $query->where('is_verified', (bool) $isVerified);
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
                'per_page' => $perPage,
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
    public function show(Mcq $mcq)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mcq $mcq)
    {
        //
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
}
