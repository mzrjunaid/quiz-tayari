import { DashboardLayout } from '@/layouts/dashboard/dashboard-layout';
import { BreadcrumbItem, Filters, PaginatedData, Paper } from '@/types';
import PaperTable from './components/paper-table';

interface DataTableProps {
    papers: PaginatedData<Paper>;
    filters: Filters;
    stats?: {
        total: number;
        active: number;
        verified: number;
        deleted: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Papers', href: '/papers' },
];

export default function PapersIndex({ papers, filters, stats }: DataTableProps) {
    return (
        <>
            <DashboardLayout title="Papers" breadcrumbs={breadcrumbs}>
                <PaperTable papers={papers} />
            </DashboardLayout>
        </>
    );
}
