import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '../app-layout';

export function DashboardLayout({ children, breadcrumbs, title }: { children: React.ReactNode; breadcrumbs: BreadcrumbItem[]; title: string }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-3 md:min-h-min dark:border-sidebar-border">
                    {children}
                </div>
            </div>
        </AppLayout>
    );
}
