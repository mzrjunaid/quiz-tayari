import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Mcqs } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit, RotateCcw, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mcqs Rephrase Show',
        href: '/show',
    },
];

export default function Show() {
    const { mcq, error, rephrased, success } = usePage().props as {
        mcq?: Mcqs;
        error?: string;
        success?: string;
        rephrased?: string;
    };

    const handleRephrase = () => {
        router.get(
            `/mcqs-rephrase/${mcq?.q_id}/rephrase`,
            {
                q_id: mcq?.q_id,
                q_statement: mcq?.q_statement,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        ); // TODO: implement rephrase logic
    };

    const handleEdit = () => {
        router.get(
            `/mcqs-rephrase/${mcq?.q_id}/edit`,
            {
                q_id: mcq?.q_id,
                rephrased: rephrased,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mcqs Rephrase" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-3 md:min-h-min dark:border-sidebar-border">
                    {success && <div className="mb-4 rounded bg-green-100 px-4 py-2 text-green-700">{success}</div>}
                    <div className="mb-4 items-center justify-between md:flex">
                        <h1 className="mb-4 text-2xl font-semibold md:mb-0">Mcqs Rephrase</h1>
                        <div className="flex items-center justify-between gap-2 md:justify-normal">
                            <Button variant="outline" className="btn btn-primary cursor-pointer" onClick={() => handleRephrase()}>
                                <RotateCcw /> Rephrase
                            </Button>

                            <Button variant="outline" className="btn btn-secondary cursor-pointer" onClick={() => handleEdit()}>
                                <Edit /> Edit Rephrased
                            </Button>
                            <Button
                                variant="default"
                                className="btn btn-secondary cursor-pointer"
                                onClick={() => router.post(`/mcqs-rephrase/${mcq?.q_id}/update`, { rephrased })}
                                disabled={!rephrased || rephrased.trim() === '' || !mcq?.q_id}
                            >
                                <Save /> Save
                            </Button>
                        </div>
                    </div>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <div className="relative rounded-xl border border-sidebar-border/70 py-4 ps-2 pe-2 dark:border-sidebar-border">
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
                                    <div className="mt-4">
                                        <span className="font-bold text-blue-600">Correct Answer: </span>
                                        <span>{mcq.right_choice}</span>
                                    </div>
                                </div>
                            ) : (
                                !error && <p>Loading...</p>
                            )}
                        </div>
                        <div className="relative rounded-xl border border-sidebar-border/70 px-2 py-4 dark:border-sidebar-border">
                            {rephrased ? (
                                <h1 className="text-xl font-bold text-gray-800">{rephrased}</h1>
                            ) : (
                                <h1 className="text-gray-500">Rephrased MCQ will be displayed here!</h1>
                            )}
                        </div>
                    </div>
                    {/* <div className="flex items-center py-4">{JSON.stringify(props, null, 2)}</div> */}
                </div>
            </div>
        </AppLayout>
    );
}
