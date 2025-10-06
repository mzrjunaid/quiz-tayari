import { DashboardLayout } from '@/layouts/dashboard/dashboard-layout';
import { BreadcrumbItem, Paper } from '@/types';
import { truncate } from 'lodash';

export default function PapersShow({ paper }: { paper: Paper }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Papers', href: route('admin.papers.index') },
        { title: truncate(paper.title), href: route('admin.papers.show', paper.slug) },
    ];

    return (
        <DashboardLayout title={paper.title} breadcrumbs={breadcrumbs}>
            <div>Paper Show {paper.title}</div>
        </DashboardLayout>
    );
}
