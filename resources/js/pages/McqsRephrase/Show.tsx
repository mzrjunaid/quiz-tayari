import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, OldMcqs } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit, RotateCcw, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mcqs Rephrase Show',
        href: '/show',
    },
];

export default function Show() {
    const { mcq, error, rephrased, explanation, subject, tags, exam_types, topic, core_concept, current_affair, general_knowledge, success } =
        usePage().props as {
            mcq?: OldMcqs;
            error?: string;
            success?: string;
            rephrased?: string;
            core_concept?: string;
            explanation?: string;
            subject?: string;
            topic?: string;
            tags?: string[];
            exam_types?: string[];
            current_affair?: string;
            general_knowledge?: string;
        };

    console.log(usePage().props);

    const handleRephrase = () => {
        router.get(
            `/rephrase/${mcq?.q_id}/rephrase`,
            {
                q_id: mcq?.q_id,
                q_statement: mcq?.q_statement,
            },
            {
                preserveScroll: true,
            },
        ); // TODO: implement rephrase logic
    };

    const handleEdit = () => {
        router.post(
            `/rephrase/${mcq?.q_id}/edit`,
            {
                q_id: mcq?.q_id,
                rephrased: rephrased,
                explanation: explanation,
                subject: subject,
                topic: topic,
                current_affair: current_affair,
                general_knowledge: general_knowledge,
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
                                onClick={() => router.post(`/rephrase/${mcq?.q_id}/update`, { rephrased })}
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
                                        {(['A', 'B', 'C', 'D', 'E'] as const).map((label, i) => {
                                            const optionKey = `option_${label}` as keyof typeof mcq;
                                            const optionValue = mcq[optionKey];

                                            return optionValue && optionValue !== '-' ? (
                                                <li key={i} className="flex gap-2">
                                                    <span className="font-bold text-blue-600">{label}.</span>
                                                    <span>{optionValue}</span>
                                                </li>
                                            ) : null; // don’t render if option doesn’t exist
                                        })}
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
                                <>
                                    <h1 className="text-xl font-bold text-gray-800">{rephrased}</h1>
                                    <p className="text-sm font-semibold">{explanation}</p>
                                    <p>
                                        Subject: {subject} <br /> Topic: {topic} <br /> Current Affair: {current_affair} <br /> General Knowledge:{' '}
                                        {general_knowledge} <br /> Core Concept: {core_concept} <br /> Tags: {tags} <br /> Exam Types: {exam_types}
                                    </p>
                                </>
                            ) : (
                                <h1 className="text-gray-500">Rephrased MCQ will be displayed here!</h1>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
