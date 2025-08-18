import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Filters, Mcqs, PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import DataTable from '@/components/DataTable/data-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface DataTableProps {
    mcqs: PaginatedData;
    filters: Filters;
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
        accessorKey: 'id',
        header: 'Id',
        cell: ({ row }) => <div className="max-w-xs capitalize">{row.getValue('id')}</div>,
    },
    // // Add slug column (hidden but accessible)
    // {
    //     accessorKey: 'slug',
    //     header: 'Slug',
    //     cell: ({ row }) => <div>{row.getValue('slug')}</div>,
    //     enableHiding: true,
    //     // Hide by default since it's just for data access
    //     meta: {
    //         hidden: true,
    //     },
    // },
    {
        accessorKey: 'question',
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
                <Link href={`/mcqs/${row.original.slug}`} className="hover:underline">
                    {row.getValue('question')}
                </Link>
            </div>
        ),
    },
    {
        accessorKey: 'option_a',
        header: () => <div className="capitalize">Option A</div>,
        cell: ({ row }) => <div className="max-w-xs break-words whitespace-normal capitalize">{row.getValue('option_a')}</div>,
    },
    {
        accessorKey: 'option_b',
        header: () => <div className="capitalize">Option B</div>,
        cell: ({ row }) => <div className="max-w-xs break-words whitespace-normal capitalize">{row.getValue('option_b')}</div>,
    },
    {
        accessorKey: 'option_c',
        header: () => <div className="capitalize">Option C</div>,
        cell: ({ row }) => <div className="max-w-xs break-words whitespace-normal capitalize">{row.getValue('option_c')}</div>,
    },
    {
        accessorKey: 'option_d',
        header: () => <div className="capitalize">Option D</div>,
        cell: ({ row }) => <div className="max-w-xs break-words whitespace-normal capitalize">{row.getValue('option_d')}</div>,
    },
    {
        accessorKey: 'correct_answer',
        header: () => <div className="capitalize">Right</div>,
        cell: ({ row }) => <div className="max-w-xs break-words whitespace-normal capitalize">{row.getValue('correct_answer')}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const mcq = row.original;

            // Use slug for navigation instead of id
            const handleShowPage = (slug: string) => {
                router.get(`/mcqs/${slug}`, {}, { preserveState: true, replace: true });
            };

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
                        <DropdownMenuItem onClick={() => handleShowPage(mcq.slug)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(mcq.slug)}>Copy MCQ Slug</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`/mcqs/${mcq.slug}`} className="w-full">
                                View Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Mark as Verified</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'MCQs',
        href: 'mcqs',
    },
];

export default function McqsIndex({ mcqs, filters, stats }: DataTableProps) {
    const url = '/mcqs';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="MCQs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative w-full">
                    <Button variant="default" className="float-right">
                        Add New
                    </Button>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-3 md:min-h-min dark:border-sidebar-border">
                    <DataTable mcqs={mcqs} columns={columns} filters={filters} url={url} stats={stats} />
                </div>
            </div>
        </AppLayout>
    );
}
