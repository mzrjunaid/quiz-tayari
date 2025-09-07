import { Filters, Mcqs, PaginatedData, SerializableFilterValue } from '@/types';

import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

export interface DataTableProps {
    mcqs: PaginatedData<Mcqs>;
    filters: Filters;
    url: string | URL;
    stats?: {
        total: number;
        active: number;
        verified: number;
        deleted: number;
    };
    columns: ColumnDef<Mcqs>[];
}

export default function DataTable({ mcqs, columns, filters, url, stats }: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [pagination, setPagination] = useState({
        pageIndex: mcqs.current_page - 1,
        pageSize: mcqs.per_page,
    });

    // Local filter states
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [activeFilter, setActiveFilter] = useState(filters.is_active || '');
    const [verifiedFilter, setVerifiedFilter] = useState(filters.is_verified || '');

    // Debounced search to avoid too many requests
    const debouncedSearch = useDebouncedCallback((value: string) => {
        updateFilters({ search: value || undefined });
    }, 300);

    // Update filters and navigate
    const updateFilters = (newFilters: Partial<Record<keyof Filters, SerializableFilterValue>>) => {
        const updatedFilters: Partial<Record<keyof Filters, SerializableFilterValue>> = { ...filters, ...newFilters };

        // Remove values that would break Inertia's serialization
        (Object.keys(updatedFilters) as Array<keyof Filters>).forEach((key) => {
            const value = updatedFilters[key];
            if (value === undefined || value === '' || (typeof value === 'number' && Number.isNaN(value))) {
                delete updatedFilters[key];
            }
        });

        // If page size changed, reset to first page
        if ('per_page' in newFilters) {
            updatedFilters.page = 1;
            setPagination((prev) => ({
                ...prev,
                pageIndex: 0,
                pageSize: newFilters.per_page as number,
            }));
        }

        router.get(url, updatedFilters, {
            only: ['mcqs', 'filters'],
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({
            ...prev,
            pageIndex: page - 1, // zero-based index
        }));
        updateFilters({ page });
    };

    const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
        console.log(sortBy);
        console.log(sortOrder);
        updateFilters({ sort_by: sortBy, sort_order: sortOrder });
    };

    const handlePerPageChange = (perPage: string) => {
        const perPageNum = Number(perPage);

        if (Number.isNaN(perPageNum)) {
            return; // Skip if invalid
        }

        updateFilters({ per_page: perPageNum, page: 1 });
    };

    const clearFilters = () => {
        setSearchValue('');
        setActiveFilter('');
        setVerifiedFilter('');
        router.get(url, {}, { preserveState: true, replace: true });
    };

    // Initialize sorting from URL
    useEffect(() => {
        if (filters.sort_by && filters.sort_order) {
            setSorting([{ id: filters.sort_by, desc: filters.sort_order === 'desc' }]);
        }
    }, [filters.sort_by, filters.sort_order]);

    const table = useReactTable({
        data: mcqs.data || [],
        columns,
        manualPagination: true, // Important: We handle pagination server-side
        manualSorting: true, // Important: We handle sorting server-side
        manualFiltering: true, // Important: We handle filtering server-side
        pageCount: mcqs.last_page,
        onPaginationChange: setPagination, // Add this handler
        onSortingChange: (updater) => {
            const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
            setSorting(newSorting);
            if (newSorting.length > 0) {
                const sort = newSorting[0];
                handleSortChange(sort.id, sort.desc ? 'desc' : 'asc');
            }
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    const hasActiveFilters = useMemo(() => {
        return searchValue || activeFilter || verifiedFilter;
    }, [searchValue, activeFilter, verifiedFilter]);

    return (
        <>
            {/* Stats Section */}
            {stats && (
                <div className="flex gap-4">
                    <div className="text-sm">
                        <span className="font-medium">Total:</span> {stats.total}
                    </div>
                    <div className="text-sm">
                        <span className="font-medium">Active:</span> {stats.active}
                    </div>
                    <div className="text-sm">
                        <span className="font-medium">Verified:</span> {stats.verified}
                    </div>
                    <div className="text-sm">
                        <span className="font-medium">Deleted:</span> {stats.deleted}
                    </div>
                </div>
            )}

            {/* Filters Section */}
            <div className="mt-2 flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                {/* Search Input */}
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search MCQs..."
                        value={searchValue}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearchValue(value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setSearchValue(e.currentTarget.value);
                                debouncedSearch(e.currentTarget.value);
                            }
                        }}
                        onBlur={(e) => {
                            setSearchValue(e.currentTarget.value);
                            debouncedSearch(e.currentTarget.value);
                        }}
                        className="pl-10"
                    />
                </div>

                {/* Status Filters */}
                <div className="flex flex-row gap-3">
                    <Select
                        value={activeFilter ?? ''}
                        onValueChange={(value) => {
                            setActiveFilter(value);
                            updateFilters({ is_active: value || undefined });
                        }}
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="1">Active</SelectItem>
                            <SelectItem value="0">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={verifiedFilter ?? ''}
                        onValueChange={(value) => {
                            setVerifiedFilter(value);
                            updateFilters({ is_verified: value || undefined });
                        }}
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Verified" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="1">Verified</SelectItem>
                            <SelectItem value="0">Unverified</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <Button variant="outline" onClick={clearFilters}>
                            <X className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Active Filters Display */}
            {/* {hasActiveFilters && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {searchValue && <Badge variant="secondary">Search: {searchValue}</Badge>}
                    {activeFilter && <Badge variant="secondary">Status: {statusRecord[activeFilter]}</Badge>}
                    {verifiedFilter && <Badge variant="secondary">Verified: {verificationRecord[verifiedFilter]}</Badge>}
                </div>
            )} */}

            <div className="mt-4 overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Results Info */}
                <div className="text-sm text-muted-foreground">
                    Showing {mcqs.from || 0} to {mcqs.to || 0} of {mcqs.total} results
                </div>

                <div className="flex items-center gap-4">
                    {/* Per Page Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Show:</span>
                        <Select value={String(mcqs.per_page)} onValueChange={handlePerPageChange}>
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Page Navigation */}
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(mcqs.current_page - 1)} disabled={mcqs.current_page <= 1}>
                            Previous
                        </Button>

                        <span className="text-sm whitespace-nowrap">
                            Page {mcqs.current_page} of {mcqs.last_page}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(mcqs.current_page + 1)}
                            disabled={mcqs.current_page >= mcqs.last_page}
                        >
                            Next
                        </Button>

                        {/* Go to Page Input */}
                        <Input
                            type="number"
                            placeholder="Page"
                            min={1}
                            max={mcqs.last_page}
                            className="w-20"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const page = Number((e.target as HTMLInputElement).value);
                                    if (page >= 1 && page <= mcqs.last_page) {
                                        handlePageChange(page);
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
