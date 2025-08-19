import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'MCQs',
        href: '/mcqs',
    },
    {
        title: 'Create',
        href: '/mcqs/create',
    },
];

interface CreateMcqForm {
    question: string;
    explanation: string;
    option_a: string;
    option_b?: string;
    option_c?: string;
    option_d?: string;
    option_e?: string;
    correct_answer: string;
    subject: string;
    topic: string;
    difficulty_level: string;
    question_type: string;
    tags: string[];
    exam_types: string[];
    [key: string]: string | string[] | undefined;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<CreateMcqForm>({
        question: '',
        explanation: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        option_e: '',
        correct_answer: '',
        subject: '',
        topic: '',
        difficulty_level: 'medium',
        question_type: 'single',
        tags: [],
        exam_types: [],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('mcqs.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create MCQ" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="question">Question</Label>
                                <Textarea
                                    id="question"
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    className="mt-1"
                                    rows={3}
                                />
                                {errors.question && <p className="mt-1 text-sm text-red-500">{errors.question}</p>}
                            </div>

                            <div>
                                <Label htmlFor="explanation">Explanation</Label>
                                <Textarea
                                    id="explanation"
                                    value={data.explanation}
                                    onChange={(e) => setData('explanation', e.target.value)}
                                    className="mt-1"
                                    rows={3}
                                />
                                {errors.explanation && <p className="mt-1 text-sm text-red-500">{errors.explanation}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="option_a">Option A</Label>
                                    <Input
                                        id="option_a"
                                        value={data.option_a}
                                        onChange={(e) => setData('option_a', e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.option_a && <p className="mt-1 text-sm text-red-500">{errors.option_a}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="option_b">Option B</Label>
                                    <Input
                                        id="option_b"
                                        value={data.option_b}
                                        onChange={(e) => setData('option_b', e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.option_b && <p className="mt-1 text-sm text-red-500">{errors.option_b}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="option_c">Option C</Label>
                                    <Input
                                        id="option_c"
                                        value={data.option_c}
                                        onChange={(e) => setData('option_c', e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.option_c && <p className="mt-1 text-sm text-red-500">{errors.option_c}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="option_d">Option D</Label>
                                    <Input
                                        id="option_d"
                                        value={data.option_d}
                                        onChange={(e) => setData('option_d', e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.option_d && <p className="mt-1 text-sm text-red-500">{errors.option_d}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="option_e">Option E (Optional)</Label>
                                    <Input
                                        id="option_e"
                                        value={data.option_e}
                                        onChange={(e) => setData('option_e', e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.option_e && <p className="mt-1 text-sm text-red-500">{errors.option_e}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="correct_answer">Correct Answer</Label>
                                    <Select value={data.correct_answer} onValueChange={(value) => setData('correct_answer', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select correct answer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">Option A</SelectItem>
                                            <SelectItem value="B">Option B</SelectItem>
                                            <SelectItem value="C">Option C</SelectItem>
                                            <SelectItem value="D">Option D</SelectItem>
                                            <SelectItem value="E">Option E</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.correct_answer && <p className="mt-1 text-sm text-red-500">{errors.correct_answer}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" value={data.subject} onChange={(e) => setData('subject', e.target.value)} className="mt-1" />
                                    {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="topic">Topic</Label>
                                    <Input id="topic" value={data.topic} onChange={(e) => setData('topic', e.target.value)} className="mt-1" />
                                    {errors.topic && <p className="mt-1 text-sm text-red-500">{errors.topic}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="difficulty_level">Difficulty Level</Label>
                                    <Select value={data.difficulty_level} onValueChange={(value) => setData('difficulty_level', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.difficulty_level && <p className="mt-1 text-sm text-red-500">{errors.difficulty_level}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="question_type">Question Type</Label>
                                    <Select value={data.question_type} onValueChange={(value) => setData('question_type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select question type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single">Single Answer</SelectItem>
                                            <SelectItem value="multiple">Multiple Answer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.question_type && <p className="mt-1 text-sm text-red-500">{errors.question_type}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create MCQ'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
