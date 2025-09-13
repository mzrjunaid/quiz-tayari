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
import { ArrowUpDown, Edit, Search, Trash } from 'lucide-react';
import * as React from 'react';

import ButtonTooltip from '@/components/button-tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filters, LinkPaginatedData, Paper, SerializableFilterValue } from '@/types';
import { Link, router } from '@inertiajs/react';
import { useDebouncedCallback } from 'use-debounce';

interface DataTableProps {
    papers: LinkPaginatedData<Paper>;
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
        cell: ({ row }) => (
            <div className="capitalize">
                <Button variant="link" asChild>
                    <Link href={route('papers.show', row.original.slug)}>{row.getValue('title')}</Link>
                </Button>
            </div>
        ),
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
            return (
                <div className="flex flex-row gap-2">
                    {/* <Button variant="link" onClick={() => navigator.clipboard.writeText(row.original.id)}>
                        <Copy />
                    </Button> */}

                    <ButtonTooltip text="Edit">
                        <Link href={route('papers.show', row.original.slug)}>
                            <Edit className="size-4" />
                        </Link>
                    </ButtonTooltip>

                    <ButtonTooltip text="Delete">
                        <Link href={route('papers.delete', row.original.slug)}>
                            <Trash className="size-4" />
                        </Link>
                    </ButtonTooltip>
                </div>
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
        pageIndex: (papers.meta.current_page || 1) - 1,
        pageSize: papers.meta.per_page || 10,
    });

    const [searchValue, setSearchValue] = React.useState(filters?.search || '');

    // Sync pagination state when papers data changes
    React.useEffect(() => {
        setPagination({
            pageIndex: (papers.meta.current_page || 1) - 1,
            pageSize: papers.meta.per_page || 10,
        });
    }, [papers.meta.current_page, papers.meta.per_page]);

    // Debounced search
    const debouncedSearch = useDebouncedCallback((value: string) => {
        updateFilters({ search: value || undefined });
    }, 300);

    // Update filters and navigate
    const updateFilters = (newFilters: Partial<Record<keyof Filters, SerializableFilterValue>>) => {
        const updatedFilters: Partial<Record<keyof Filters, SerializableFilterValue>> = {
            ...filters,
            ...newFilters,
        };

        // Clean up undefined/empty values
        (Object.keys(updatedFilters) as Array<keyof Filters>).forEach((key) => {
            const value = updatedFilters[key];
            if (value === undefined || value === '' || (typeof value === 'number' && Number.isNaN(value))) {
                delete updatedFilters[key];
            }
        });

        // If page size changed, reset to first page
        if ('per_page' in newFilters && newFilters.per_page !== filters?.per_page) {
            updatedFilters.page = 1;
        }

        router.get('/papers', updatedFilters, {
            only: ['papers', 'filters'],
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        updateFilters({ page });
    };

    const handlePerPageChange = (perPage: string) => {
        const perPageNum = Number(perPage);
        if (Number.isNaN(perPageNum)) return;

        updateFilters({ per_page: perPageNum, page: 1 });
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
        pageCount: papers.meta.last_page,
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
            {/* Pagination */}
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Results Info */}
                <div className="text-sm text-muted-foreground">
                    Showing {papers.meta.from || 0} to {papers.meta.to || 0} of {papers.meta.total} results
                </div>

                <div className="flex items-center gap-4">
                    {/* Per Page Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Show:</span>
                        <Select value={String(papers.meta.per_page)} onValueChange={handlePerPageChange}>
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
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(papers.meta.current_page - 1)}
                            disabled={papers.meta.current_page <= 1}
                        >
                            Previous
                        </Button>

                        <span className="text-sm whitespace-nowrap">
                            Page {papers.meta.current_page} of {papers.meta.last_page}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(papers.meta.current_page + 1)}
                            disabled={papers.meta.current_page >= papers.meta.last_page}
                        >
                            Next
                        </Button>

                        {/* Go to Page Input */}
                        <Input
                            type="number"
                            placeholder="Page"
                            min={1}
                            max={papers.meta.last_page}
                            className="w-20"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const page = Number((e.target as HTMLInputElement).value);
                                    if (page >= 1 && page <= papers.meta.last_page) {
                                        handlePageChange(page);
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <pre>{JSON.stringify(papers, null, 2)}</pre>
        </div>
    );
}
