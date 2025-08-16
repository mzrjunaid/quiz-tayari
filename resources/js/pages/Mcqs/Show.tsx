import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Mcqs } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit, RotateCcw } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mcqs Rephrase Show',
        href: '/show',
    },
];

export default function Show() {
    const { mcq, error } = usePage().props as {
        mcq?: Mcqs;
        error?: string;
    };

    console.log(usePage().props);

    const handleRephrase = () => {
        router.get(
            `/rephrase/${mcq?.id}/rephrase`,
            {
                id: mcq?.id,
            },
            {
                preserveScroll: true,
            },
        ); // TODO: implement rephrase logic
    };

    const handleEdit = () => {
        router.post(
            `/rephrase/${mcq?.id}/edit`,
            {
                q_id: mcq?.id,
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
                    <div className="mb-4 items-center justify-between md:flex">
                        <h1 className="mb-4 text-2xl font-semibold md:mb-0">Mcqs Rephrase</h1>
                        <div className="flex items-center justify-between gap-2 md:justify-normal">
                            <Button variant="outline" className="btn btn-primary cursor-pointer" onClick={() => handleRephrase()}>
                                <RotateCcw /> Rephrase
                            </Button>
                            <Button variant="outline" className="btn btn-secondary cursor-pointer" onClick={() => handleEdit()}>
                                <Edit /> Edit Rephrased
                            </Button>
                        </div>
                    </div>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <div className="relative rounded-xl border border-sidebar-border/70 py-4 ps-2 pe-2 dark:border-sidebar-border">
                            {mcq ? (
                                <div>
                                    <span className="font-bold text-blue-600">Question: </span>
                                    <h1 className="text-xl font-semibold">{mcq.question}</h1>
                                    <ul className="mt-2 ml-5 list-inside">
                                        {['a', 'b', 'c', 'd'].map((label, i) => (
                                            <li key={i} className="flex gap-2">
                                                <span className="font-bold text-blue-600">{label}.</span>
                                                <span>{mcq[`option_${label}` as 'option_a' | 'option_b' | 'option_c' | 'option_d']}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4">
                                        <span className="font-bold text-blue-600">Correct Answer: </span>
                                        <span>{mcq.correct_answer}</span>
                                    </div>
                                </div>
                            ) : (
                                !error && <p>Loading...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
