import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Mcqs } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit, Share } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'MCQs List',
        href: '/mcqs',
    },
    {
        title: 'MCQ',
        href: '/show',
    },
];

export default function Show() {
    const { mcq, error } = usePage().props as {
        mcq?: Mcqs;
        error?: string;
    };
    const [publish, setPublish] = useState(mcq?.is_verified);

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
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="airplane-mode">{publish ? 'Published' : 'Unpublished'}</Label>
                                <Switch id="airplane-mode" checked={publish} onCheckedChange={(checked) => setPublish(checked)} />
                            </div>
                            <Button variant="outline" className="btn btn-secondary cursor-pointer" onClick={() => handleEdit()}>
                                <Edit /> Edit
                            </Button>
                            <Button variant="default" className="btn btn-primary cursor-pointer" onClick={() => handleRephrase()}>
                                <Share /> Share
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
                                        {(['a', 'b', 'c', 'd', 'e'] as const).map((label, i) => {
                                            const optionKey = `option_${label}` as keyof typeof mcq;
                                            const optionValue = mcq[optionKey];

                                            return optionValue ? (
                                                <li key={i} className="flex gap-2">
                                                    <span className="font-bold text-blue-600">{label}.</span>
                                                    <span>{optionValue}</span>
                                                </li>
                                            ) : null; // don’t render if option doesn’t exist
                                        })}
                                    </ul>
                                    <div className="mt-4">
                                        <span className="font-bold text-blue-600">Correct Answer: </span>
                                        {mcq.question_type !== 'multiple_correct' ? (
                                            <span>{mcq.correct_answer}</span>
                                        ) : (
                                            <>{mcq.correct_answers?.map((answer, i) => <span key={i}>"{answer}"</span>)}</>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                !error && <p>Loading...</p>
                            )}
                        </div>
                        {/* mcqs meta Information  */}
                        <div className="relative rounded-xl border border-sidebar-border/70 px-4 py-4 text-center dark:border-sidebar-border">
                            <h1 className="mb-2 text-2xl font-bold">Mcqs Meta Information</h1>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-blue-600">Subject: </span>
                                    <span>{mcq ? mcq.subject : ''}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-blue-600">Topic: </span>
                                    <span>{mcq ? mcq.topic : ''}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-blue-600">Question Type: </span>
                                    <span>{mcq ? mcq.question_type : ''}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-blue-600">Difficulty Level: </span>
                                    <span>{mcq ? mcq.difficulty_level : ''}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-blue-600">Tags: </span>
                                    <span>{mcq ? mcq.tags?.map((tags, i) => <span key={i}>{tags}, </span>) : ''}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-blue-600">Exam Types: </span>
                                    <span>{mcq ? mcq.exam_types?.map((tags, i) => <span key={i}>{tags}, </span>) : ''}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-blue-600">Created at: </span>
                                    <span>{mcq ? mcq.created_at : ''}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* MCQ Explanation */}
                    <div className="relative my-4 rounded-xl border border-sidebar-border/70 px-4 py-4 text-center dark:border-sidebar-border">
                        <h1 className="mb-2 text-2xl font-bold">MCQ Explanation</h1>
                        <div className="flex flex-col gap-2">{mcq ? mcq.explanation : ''}</div>
                    </div>
                    <pre>{JSON.stringify(mcq, null, 2)}</pre>
                </div>
            </div>
        </AppLayout>
    );
}
