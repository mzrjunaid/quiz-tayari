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
import * as React from 'react';

import { Button } from '@/components/ui/button';
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
import { PaginatedData, Paper } from '@/types';

interface DataTableProps {
    papers: PaginatedData<Paper>;
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
                    <span className="font-mono text-xs text-gray-500">long: {serviceLong}</span>
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
                (status.is_today && 'test') ||
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function PaperTable({ papers }: DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: papers.data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
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
