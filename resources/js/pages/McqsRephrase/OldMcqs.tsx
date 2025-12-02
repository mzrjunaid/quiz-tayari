import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    { title: 'Old MCQs', href: '/old-mcqs' },
];

export default function OldMcqs({
    search,
    mcq_data,
    papers,
    subjects,
    testing_services,
}: {
    search: any;
    mcq_data: any;
    papers: any;
    subjects: any;
    testing_services: any;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mcqs Rephrase" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-3 md:min-h-min dark:border-sidebar-border">
                    <pre>{JSON.stringify(search, null, 2)}</pre>
                    <pre>{JSON.stringify(papers.data, null, 2)}</pre>
                    <pre>{JSON.stringify(subjects.data, null, 2)}</pre>
                    <pre>{JSON.stringify(testing_services.data, null, 2)}</pre>
                    <pre>{JSON.stringify(mcq_data.data, null, 2)}</pre>
                </div>
            </div>
        </AppLayout>
    );
}
