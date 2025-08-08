import { Mcqs } from '@/types';
import { router } from '@inertiajs/react';

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
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';

export type Mcq_data = {
    data: Mcqs[];
    current_page: number;
    last_page: number;
    total: number;
};

export interface dataTableProps {
    columns: ColumnDef<Mcqs>[];
    url: string;
    setData: (data: Mcqs[]) => void;
}

export default function DataTable({ setData, columns, url }: dataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [data] = useState<Mcqs[]>(); // Replace with actual data fetching logic

    const handlePageChange = (pageIndex: number) => {
        router.get(
            url,
            {
                page: pageIndex, // Adjust for zero-based index
            },
            {
                preserveState: true,
                replace: true,
            },
        );
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
        <>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter mcq"
                    defaultValue={(table.getColumn('q_statement')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('q_statement')?.setFilterValue(event.target.value)}
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
                        className="w-24"
                    />
                </div>
            </div>
        </>
    );
}
