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
import { BreadcrumbItem, Filters, Mcqs, PaginatedData } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Deleted MCQs',
        href: '/deleted/mcqs',
    },
];

interface Props {
    mcqs: PaginatedData;
    filters: Filters;
}

export const columns: ColumnDef<Mcqs>[] = [
    {
        accessorKey: 'serial_number',
        header: 'No.',
        cell: ({ row }) => <div className="max-w-xs capitalize">{row.getValue('serial_number')}</div>,
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
        cell: ({ row }) => <div className="max-w-sm break-words whitespace-normal">{row.getValue('question')}</div>,
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
        accessorKey: 'is_verified',
        header: () => <div className="capitalize">Verified</div>,
        cell: ({ row }) => <div>{row.getValue('is_verified') ? 'Yes' : 'No'}</div>,
    },
    {
        id: 'Remove',
        header: () => <div className="capitalize">Remove</div>,
        cell: ({ row }) => {
            const handleDelete = () => {
                const slug = row.original.slug;
                router.delete(`/mcqs/${slug}`, {
                    preserveState: true,
                    replace: true,
                    onError: (e) => {
                        console.log(e);
                    },
                });
            };
            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            Delete
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure to delete the following question?</DialogTitle>
                            <DialogDescription>This action cannot be undone.</DialogDescription>
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
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
];

export default function Deleted({ mcqs, filters }: Props) {
    return (
        <DashboardLayout title="Deleted MCQs" breadcrumbs={breadcrumbs}>
            <DataTable mcqs={mcqs} columns={columns} filters={filters} url="/deleted/mcqs" />
        </DashboardLayout>
    );
}
