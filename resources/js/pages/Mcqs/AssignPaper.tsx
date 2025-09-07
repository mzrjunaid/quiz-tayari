import { BreadcrumbItem, Filters, Mcqs, PaginatedData } from '@/types';
import { Link } from '@inertiajs/react';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Verified } from 'lucide-react';

import ButtonTooltip from '@/components/button-tooltip';
import DataTable from '@/components/DataTable/data-table';
import { SelectCombobox } from '@/components/select-combobox';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/layouts/dashboard/dashboard-layout';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'MCQs List', href: route('mcqs.index') },
    { title: 'Assign Paper', href: route('mcqs.assign-paper') },
];

interface DataTableProps {
    mcqs: PaginatedData<Mcqs>;
    papers: [
        {
            id: string;
            title: string;
        },
    ];
    filters: Filters;
    stats?: {
        total: number;
        active: number;
        verified: number;
        deleted: number;
    };
}

export default function AssignPaper({ mcqs, papers, filters, stats }: DataTableProps) {
    // const [questionIds, setQuestionIds] = useState([]);
    const [paperIds, setPaperIds] = useState<Record<string, string>>({});

    // Handle paper selection for individual MCQs
    const handlePaperChange = (mcqId: string, paperId: string) => {
        setPaperIds((prev) => ({
            ...prev,
            [mcqId]: paperId,
        }));
    };

    const columns: ColumnDef<Mcqs>[] = useMemo(
        () => [
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
                id: 'papers',
                header: 'Papers',
                cell: ({ row }) => (
                    <SelectCombobox
                        data={papers}
                        value={paperIds[row.original.id] || ''}
                        onValueChange={(value) => handlePaperChange(row.original.id, value)}
                    />
                ),
            },
            {
                id: 'actions',
                enableHiding: false,
                cell: ({ row }) => {
                    return (
                        <div className="flex flex-row justify-end gap-3">
                            {row.original.is_verified && (
                                <div className="flex gap-1 align-middle">
                                    <span>Verified</span>
                                    <ButtonTooltip text="Published">
                                        <Verified className="size-4" />
                                    </ButtonTooltip>
                                </div>
                            )}
                        </div>
                    );
                },
            },
        ],
        [papers, paperIds],
    );
    return (
        <DashboardLayout title="Assgin Paper" breadcrumbs={breadcrumbs}>
            <DataTable mcqs={mcqs} columns={columns} filters={filters} url={route('mcqs.assign-paper')} stats={stats} />
        </DashboardLayout>
    );
}
