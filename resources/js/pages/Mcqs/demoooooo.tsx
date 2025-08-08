import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mcqs } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';
import { ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Link } from '@inertiajs/react';

import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

export interface PaginatedData {
    data: Mcqs[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
}

export interface Filters {
    search?: string;
    is_active?: string;
    is_verified?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
    page?: number;
}

export interface DataTableProps {
    columns: ColumnDef<Mcqs>[];
    mcqs: PaginatedData;
    filters: Filters;
    url: string;
    stats?: {
        total: number;
        active: number;
        verified: number;
    };
}

export const columns: ColumnDef<Mcqs>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'q_id',
        header: 'Id',
        cell: ({ row }) => <div className="max-w-xs capitalize">{row.getValue('q_id')}</div>,
    },
    {
        accessorKey: 'q_statement',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Question
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="max-w-sm break-words whitespace-normal">
                <Link href={`/mcqs-rephrase/${row.getValue('q_id')}`} className="hover:underline">
                    {row.getValue('q_statement')}
                </Link>
            </div>
        ),
    },
    {
        accessorKey: 'option_A',
        header: () => <div className="capitalize">Option A</div>,
        cell: ({ row }) => <div className="max-w-xs break-words whitespace-normal capitalize">{row.getValue('option_A')}</div>,
    },
    {
        accessorKey: 'option_B',
        header: () => <div className="capitalize">Option B</div>,
        cell: ({ row }) => <div className="max-w-xs break-words whitespace-normal capitalize">{row.getValue('option_B')}</div>,
    },
    {
        accessorKey: 'option_C',
        header: () => <div className="capitalize">Option C</div>,
        cell: ({ row }) => <div className="max-w-xs break-words whitespace-normal capitalize">{row.getValue('option_C')}</div>,
    },
    {
        accessorKey: 'right_choice',
        header: () => <div className="capitalize">Right</div>,
        cell: ({ row }) => <div className="max-w-xs break-words whitespace-normal capitalize">{row.getValue('right_choice')}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const mcq = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* <DropdownMenuItem onClick={() => handleShowPage(Number(mcq.q_id))}>Edit</DropdownMenuItem> */}
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(mcq.id)}>Copy payment ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function Index({ mcqs, filters, url, stats }: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    // Local filter states
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [activeFilter, setActiveFilter] = useState(filters.is_active || '');
    const [verifiedFilter, setVerifiedFilter] = useState(filters.is_verified || '');

    // Debounced search to avoid too many requests
    const debouncedSearch = useDebouncedCallback((value: string) => {
        updateFilters({ search: value || undefined });
    }, 300);

    // Update filters and navigate
    const updateFilters = (newFilters: Partial<Filters>) => {
        const updatedFilters = { ...filters, ...newFilters };

        // Remove undefined values
        (Object.keys(updatedFilters) as Array<keyof Filters>).forEach((key) => {
            if (updatedFilters[key] === undefined || updatedFilters[key] === '') {
                delete updatedFilters[key];
            }
        });

        router.get(url, updatedFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePageChange = (page: number) => {
        updateFilters({ ...filters, page });
    };

    const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
        updateFilters({ sort_by: sortBy, sort_order: sortOrder });
    };

    const handlePerPageChange = (perPage: string) => {
        updateFilters({ per_page: parseInt(perPage), page: 1 }); // Reset to page 1
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
            pagination: {
                pageIndex: mcqs.current_page - 1, // Zero-based for tanstack table
                pageSize: mcqs.per_page,
            },
        },
    });

    const hasActiveFilters = useMemo(() => {
        return searchValue || activeFilter || verifiedFilter;
    }, [searchValue, activeFilter, verifiedFilter]);

    return (
        <div className="space-y-4">
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
                </div>
            )}

            {/* Filters Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Search Input */}
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search MCQs..."
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            debouncedSearch(e.target.value);
                        }}
                        className="pl-10"
                    />
                </div>

                {/* Status Filters */}
                <Select
                    value={activeFilter}
                    onValueChange={(value) => {
                        setActiveFilter(value);
                        updateFilters({ is_active: value || undefined });
                    }}
                >
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Status</SelectItem>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={verifiedFilter}
                    onValueChange={(value) => {
                        setVerifiedFilter(value);
                        updateFilters({ is_verified: value || undefined });
                    }}
                >
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Verified" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All</SelectItem>
                        <SelectItem value="1">Verified</SelectItem>
                        <SelectItem value="0">Unverified</SelectItem>
                    </SelectContent>
                </Select>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                        <X className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                )}

                {/* Column Visibility */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {searchValue && <Badge variant="secondary">Search: {searchValue}</Badge>}
                    {activeFilter && <Badge variant="secondary">Status: {activeFilter === '1' ? 'Active' : 'Inactive'}</Badge>}
                    {verifiedFilter && <Badge variant="secondary">Verified: {verifiedFilter === '1' ? 'Yes' : 'No'}</Badge>}
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        </div>
    );
}
