import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Mcqs } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mcqs Rephrase Show',
        href: '/show',
    },
];

export default function Show({ mcq, error }: { mcq?: Mcqs; error?: string }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mcqs Rephrase" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-3 md:min-h-min dark:border-sidebar-border">
                    <div className='flex items-center justify-between mb-4'>
                        <h1 className="text-2xl font-semibold">Mcqs Rephrase</h1>
                        <div className="flex items-center gap-2">
                            <a href="/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</a>
                        </div>
                    </div>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border pt-4 ps-2 pe-2">
                            {error && <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700">{error}</div>}

                            {mcq ? (
                                <div>
                                    <span className="font-bold text-blue-600">Question: </span>
                                    <h1 className="text-xl font-semibold">{mcq.q_statement}</h1>
                                    <ul className="mt-2 ml-5 list-inside">
                                        {['A', 'B', 'C', 'D'].map((label, i) => (
                                            <li key={i} className="flex gap-2">
                                                <span className="font-bold text-blue-600">{label}.</span>
                                                <span>{mcq[`option_${label}` as 'option_A' | 'option_B' | 'option_C' | 'option_D']}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                !error && <p>Loading...</p>
                            )}
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                    <div className="flex items-center py-4"></div>
                </div>
            </div>
        </AppLayout>
    );
}
