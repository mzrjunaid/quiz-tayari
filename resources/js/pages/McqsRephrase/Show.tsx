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
    // const { props } = usePage();
    // const mcq = props.mcq as Mcqs | undefined;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mcqs Rephrase" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-3 md:min-h-min dark:border-sidebar-border">
                    <div className="flex items-center py-4">
                        {error && <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700">{error}</div>}

                        {mcq ? (
                            <div>
                                <h1 className="text-xl font-semibold">{mcq.q_statement}</h1>
                                <ul className="mt-2 ml-5 list-disc">
                                    <li>A: {mcq.option_A}</li>
                                    <li>B: {mcq.option_B}</li>
                                    <li>C: {mcq.option_C}</li>
                                    <li>D: {mcq.option_D}</li>
                                </ul>
                            </div>
                        ) : (
                            !error && <p>Loading...</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
