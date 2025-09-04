import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Search } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filters, PaginatedData, Paper, SerializableFilterValue } from '@/types';
import { Link, router } from '@inertiajs/react';
import { useDebouncedCallback } from 'use-debounce';

interface DataTableProps {
    papers: PaginatedData<Paper>;
    filters: Filters;
}

export const columns: ColumnDef<Paper>[] = [
    {
        accessorKey: 'serial_number',
        header: 'Sr. No.',
        cell: ({ row }) => <div className="capitalize">{row.getValue('serial_number')}</div>,
    },
    {
        accessorKey: 'title',
        header: 'Paper',
        cell: ({ row }) => <div className="capitalize">{row.getValue('title')}</div>,
    },
    {
        accessorKey: 'testing_services',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Testing Service
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            const serviceShort = row.original.testing_service.short;
            const serviceLong = row.original.testing_service.long;

            return (
                <div className="uppercase">
                    {serviceShort}
                    <br />
                    <span className="font-mono text-xs text-gray-500">{serviceLong}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'department',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Department
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="font-semibold">{row.original.department}</div>;
        },
    },
    {
        accessorKey: 'subject',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Subject
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="font-semibold">{row.original.subject}</div>;
        },
    },
    {
        accessorKey: 'scheduled_at',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Date
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            const scheduledAt = row.original.scheduled_at;

            // Handle cases where scheduled_at might be null/undefined
            if (!scheduledAt) {
                return <div className="font-semibold text-gray-400">No date</div>;
            }

            // Function to format date as dd-mm-yyyy
            const formatDate = (dateString: string): string => {
                try {
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) {
                        return dateString; // Return original if invalid date
                    }

                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();

                    return `${day}-${month}-${year}`;
                } catch {
                    return dateString; // Return original if parsing fails
                }
            };

            // Try to get a date string from available fields
            const dateString = scheduledAt.date_only || scheduledAt.datetime || scheduledAt.formatted || scheduledAt.human;

            if (!dateString) {
                return <div className="font-semibold text-gray-400">Invalid date</div>;
            }

            // If date_only is already in dd-mm-yyyy format, use it directly
            if (scheduledAt.date_only && /^\d{2}-\d{2}-\d{4}$/.test(scheduledAt.date_only)) {
                return <div className="font-semibold">{scheduledAt.date_only}</div>;
            }

            // Otherwise, format the date
            const formattedDate = formatDate(dateString);

            return <div className="font-semibold">{formattedDate}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: 'status',
        cell: ({ row }) => {
            const status = row.original.status;

            const currentStatus =
                (status.is_today && 'Today') ||
                (status.is_upcoming && 'Comming Soon') ||
                (status.is_past && 'Past') ||
                (status.is_scheduled && 'Sechduled');
            return <div>{currentStatus}</div>;
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const paper = row.original;

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(paper.id)}>Copy payment ID</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.get(`/papers/${row.original.slug}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function PaperTable({ papers, filters }: DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [pagination, setPagination] = React.useState({
        pageIndex: papers.current_page - 1,
        pageSize: papers.per_page,
    });

    const [searchValue, setSearchValue] = React.useState(filters?.search || '');

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

        router.get('/papers', updatedFilters, {
            only: ['papers', 'filters'],
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    const table = useReactTable({
        data: papers.data,
        columns,
        manualPagination: true, // Important: We handle pagination server-side
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        pageCount: papers.last_page,
        onPaginationChange: setPagination, // Add this handler
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between gap-3 py-4">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
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
                <div className="relative max-w-sm">
                    <Button variant="default" asChild>
                        <Link href={route('papers.create')} type="button">
                            Add New
                        </Link>
                    </Button>
                </div>
            </div>
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
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
            <pre>{JSON.stringify(papers, null, 2)}</pre>
        </div>
    );
}
