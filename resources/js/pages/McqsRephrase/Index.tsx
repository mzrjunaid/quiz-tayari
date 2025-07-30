import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';

export type Mcq_data = {
    data: Mcqs[];
    current_page: number;
    last_page: number;
    total: number;
};

export type Mcqs = {
    q_id: string;
    q_statement: string;
    option_A: string;
    option_B: string;
    option_C: string;
    option_D: string;
    right_choice: string;
    created_at: string;
};

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
        cell: ({ row }) => <div className="max-w-sm break-words whitespace-normal">{row.getValue('q_statement')}</div>,
    },
    {
        accessorKey: 'option_A',
        header: () => <div className="capitalize">Option A</div>,
        cell: ({ row }) => <div className="max-w-xs break-words whitespace-normal capitalize">{row.getValue('option_A')}</div>,
        // cell: ({ row }) => {
        //     const amount = parseFloat(row.getValue('amount'));

        //     // Format the amount as a dollar amount
        //     const formatted = new Intl.NumberFormat('en-US', {
        //         style: 'currency',
        //         currency: 'USD',
        //     }).format(amount);

        //     return <div className="text-right font-medium">{formatted}</div>;
        // },
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(mcq.q_id)}>Copy payment ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mcqs Rephrase',
        href: 'mcqs-rephrase',
    },
];

export default function McqsRephrase({ mcq_data }: { mcq_data: Mcq_data }) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [data] = useState<Mcqs[]>(mcq_data.data);

    const handlePageChange = (pageIndex: number) => {
        router.get('mcqs-rephrase', {
            page: pageIndex, // Adjust for zero-based index
        });
    };

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        pageCount: Math.ceil(data.length / 10), // Assuming 10 rows per page
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex: 0, // Start at the first page
                pageSize: 50, // Assuming a default page size of 10
            },
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mcqs Rephrase" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-3 md:min-h-min dark:border-sidebar-border">
                    <div className="flex items-center py-4">
                        <Input
                            placeholder="Filter emails..."
                            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                            onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
                            className="max-w-sm"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Columns <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(mcq_data.current_page - 1)}
                                disabled={mcq_data.current_page <= 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm">
                                {mcq_data.current_page} of {mcq_data.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(mcq_data.current_page + 1)}
                                disabled={mcq_data.current_page >= mcq_data.last_page}
                            >
                                Next
                            </Button>
                        </div>
                        <div>
                            <Input
                                type="number"
                                placeholder="Go to Page"
                                min={1}
                                max={mcq_data.last_page}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const pageIndex = Number((e.target as HTMLInputElement).value);
                                        if (pageIndex >= 1 && pageIndex <= mcq_data.last_page) {
                                            handlePageChange(pageIndex);
                                        }
                                    }
                                }}
                                onBlur={(e) => {
                                    const pageIndex = Number(e.target.value);
                                    if (pageIndex >= 1 && pageIndex <= mcq_data.last_page) {
                                        handlePageChange(pageIndex);
                                    } else {
                                        e.target.value = String(mcq_data.current_page); // Reset to current page if invalid
                                    }
                                }}
                                defaultValue={mcq_data.current_page}
                                className="w-24"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
