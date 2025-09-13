import { DashboardLayout } from '@/layouts/dashboard/dashboard-layout';
import { BreadcrumbItem, Filters, LinkPaginatedData, Paper } from '@/types';
import PaperTable from './Components/PaperTable';

interface DataTableProps {
    papers: LinkPaginatedData<Paper>;
    filters: Filters;
    stats?: {
        total: number;
        active: number;
        verified: number;
        deleted: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Papers', href: route('papers.index') },
];

export default function PapersIndex({ papers, filters }: DataTableProps) {
    return (
        <DashboardLayout title="Papers List" breadcrumbs={breadcrumbs}>
            <PaperTable papers={papers} filters={filters} />
        </DashboardLayout>
    );
}
