import { BreadcrumbItem, Filters, Mcqs, PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Check, Edit, Trash, Verified } from 'lucide-react';

import ButtonTooltip from '@/components/button-tooltip';
import DataTable from '@/components/DataTable/data-table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { DashboardLayout } from '@/layouts/dashboard/dashboard-layout';

interface DataTableProps {
    mcqs: PaginatedData<Mcqs>;
    filters: Filters;
    stats?: {
        total: number;
        active: number;
        verified: number;
        deleted: number;
    };
}

const rightOptions = (option: string, column: string, value: string) => {
    return <div className={`max-w-xs break-words whitespace-normal capitalize ${option === column && 'font-semibold text-gray-900'}`}>{value}</div>;
};

const columns: ColumnDef<Mcqs>[] = [
    {
        accessorKey: 'serial_number',
        header: 'No.',
        cell: ({ row }) => <div className="max-w-xs text-center capitalize">{row.getValue('serial_number')}</div>,
    },
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
        cell: ({ row }) => rightOptions(row.original.correct_answer, 'A', row.getValue('option_a')),
    },
    {
        accessorKey: 'option_b',
        header: () => <div className="capitalize">Option B</div>,
        cell: ({ row }) => rightOptions(row.original.correct_answer, 'B', row.getValue('option_b')),
    },
    {
        accessorKey: 'option_c',
        header: () => <div className="capitalize">Option C</div>,
        cell: ({ row }) => rightOptions(row.original.correct_answer, 'C', row.getValue('option_c')),
    },
    {
        accessorKey: 'option_d',
        header: () => <div className="capitalize">Option D</div>,
        cell: ({ row }) => rightOptions(row.original.correct_answer, 'D', row.getValue('option_d')),
    },
    {
        accessorKey: 'option_e',
        header: () => <div className="capitalize">Option E</div>,
        cell: ({ row }) => rightOptions(row.original.correct_answer, 'E', row.getValue('option_e')),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const handleDelete = () => {
                const slug = row.original.slug;
                router.delete(`/mcqs/${slug}`, {
                    replace: true,
                });
            };

            const updatePublish = (is_verified: boolean) => {
                router.patch(
                    `/mcqs/${row.original?.slug}/field`,
                    {
                        field: 'is_verified',
                        value: is_verified,
                    },
                    {
                        preserveScroll: true,
                        onError: (e) => {
                            console.log(e);
                            // setPublish(!is_verified); // revert the change if error occurs
                        },
                    },
                );
            };
            return (
                <div className="flex flex-row gap-3">
                    <ButtonTooltip text="Edit">
                        <Link href={route('mcqs.edit', row.original.slug)}>
                            <Edit className="size-4" />
                        </Link>
                    </ButtonTooltip>
                    <Dialog>
                        <DialogTrigger className="cursor-pointer">
                            <Trash className="size-4" />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you sure to delete the following question?</DialogTitle>
                                <DialogDescription>This MCQ will be moved to Trash.</DialogDescription>
                            </DialogHeader>
                            <div className="px-2 py-4">{row.original.question}</div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" onClick={() => router.cancel()}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button type="submit" variant="destructive" onClick={() => handleDelete()}>
                                        Yes, Delete
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    {row.original.is_verified ? (
                        <ButtonTooltip text="Published">
                            <Verified className="size-4" />
                        </ButtonTooltip>
                    ) : (
                        <Button variant="link" asChild onClick={() => updatePublish(true)}>
                            <span>
                                <Check />
                            </span>
                        </Button>
                    )}
                </div>
            );
        },
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'MCQs',
        href: route('mcqs.index'),
    },
];

export default function McqsIndex({ mcqs, filters, stats }: DataTableProps) {
    return (
        <DashboardLayout title="MCQs" breadcrumbs={breadcrumbs}>
            <div className="mb-2 flex flex-row justify-end gap-4">
                <Button variant="secondary" asChild>
                    <Link href={route('mcqs.assign-paper')}>Assign Paper</Link>
                </Button>
                <Button variant="default" asChild>
                    <Link href={route('mcqs.create')}>Add New</Link>
                </Button>
            </div>
            <DataTable mcqs={mcqs} columns={columns} filters={filters} url={route('mcqs.index')} stats={stats} />
        </DashboardLayout>
    );
}
