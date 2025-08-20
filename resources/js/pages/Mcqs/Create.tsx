import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from '@/components/ui/multi-select';

interface Props {
    subjects: Array<{ id: string; name: string }>;
    topics: Array<{ id: string; name: string; subject_id: string }>;
    questionTypes: Array<{ id: number; name: string; value: string }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'MCQs', href: '/mcqs' },
    { title: 'Create', href: '/mcqs/create' },
];

const formSchema = z.object({
    question: z.string().min(1, 'Question is required'),
    explanation: z.string().min(1, 'Explanation is required'),
    option_a: z.string().min(1, 'Option A is required'),
    option_b: z.string(),
    option_c: z.string(),
    option_d: z.string(),
    option_e: z.string(),
    correct_answer: z.union([z.string(), z.array(z.string())]),
    subject: z.string().min(1, 'Subject is required'),
    topic: z.string().min(1, 'Topic is required'),
    difficulty_level: z.enum(['easy', 'medium', 'hard']),
    question_type: z.enum(['single', 'multiple', 'true_false', 'single_a']),
    tags: z.array(z.string()),
    exam_types: z.array(z.string())
});

type FormValues = z.infer<typeof formSchema>;

export default function Create({ subjects, topics, questionTypes }: Props) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
            explanation: "",
            option_a: "",
            option_b: "",
            option_c: "",
            option_d: "",
            option_e: "",
            correct_answer: [],
            subject: "",
            topic: "",
            difficulty_level: "medium",
            question_type: "single",
            tags: [],
            exam_types: []
        }
    });

    function onSubmit(values: FormValues) {
        router.post(route('mcqs.store'), values);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create MCQ" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="question_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Question Type *</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                if (value === 'true_false') {
                                                    form.setValue('option_a', 'True');
                                                    form.setValue('option_b', 'False');
                                                    form.setValue('option_c', '');
                                                    form.setValue('option_d', '');
                                                    form.setValue('option_e', '');
                                                    form.setValue('correct_answer', '');
                                                } else if (value === 'single_a') {
                                                    form.setValue('option_a', '');
                                                    form.setValue('option_b', '');
                                                    form.setValue('option_c', '');
                                                    form.setValue('option_d', '');
                                                    form.setValue('option_e', '');
                                                    form.setValue('correct_answer', 'A');
                                                } else if (value === 'single') {
                                                    form.setValue('correct_answer', '');
                                                } else if (value === 'multiple') {
                                                    form.setValue('correct_answer', []);
                                                }
                                            }}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select question type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {questionTypes.map(type => (
                                                    <SelectItem key={type.id} value={type.value}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="question"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Question *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter your question"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="explanation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Explanation *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter explanation"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="option_a"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Option A *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={form.watch('question_type') === 'true_false'}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {form.watch('question_type') !== 'single_a' && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="option_b"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Option B {form.watch('question_type') === 'multiple' && '*'}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={form.watch('question_type') === 'true_false'}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="option_c"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Option C {form.watch('question_type') === 'multiple' && '*'}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="option_d"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Option D</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="option_e"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Option E</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                <FormField
                                    control={form.control}
                                    name="correct_answer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Correct Answer{form.watch('question_type') === 'multiple' ? '(s)' : ''} *
                                            </FormLabel>
                                            {form.watch('question_type') === 'multiple' ? (
                                                <FormControl>
                                                    <MultiSelect
                                                        values={Array.isArray(field.value) ? field.value : []}
                                                        onValuesChange={field.onChange}
                                                    >
                                                        <MultiSelectTrigger>
                                                            <MultiSelectValue placeholder="Select correct answers" />
                                                        </MultiSelectTrigger>
                                                        <MultiSelectContent>
                                                            {form.watch('option_a') && (
                                                                <MultiSelectItem value="A">Option A</MultiSelectItem>
                                                            )}
                                                            {form.watch('option_b') && (
                                                                <MultiSelectItem value="B">Option B</MultiSelectItem>
                                                            )}
                                                            {form.watch('option_c') && (
                                                                <MultiSelectItem value="C">Option C</MultiSelectItem>
                                                            )}
                                                            {form.watch('option_d') && (
                                                                <MultiSelectItem value="D">Option D</MultiSelectItem>
                                                            )}
                                                            {form.watch('option_e') && (
                                                                <MultiSelectItem value="E">Option E</MultiSelectItem>
                                                            )}
                                                        </MultiSelectContent>
                                                    </MultiSelect>
                                                </FormControl>
                                            ) : (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={Array.isArray(field.value) ? field.value[0] : field.value}
                                                    disabled={form.watch('question_type') === 'single_a'}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select correct answer" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {form.watch('question_type') === 'true_false' ? (
                                                            <>
                                                                <SelectItem value="A">True</SelectItem>
                                                                <SelectItem value="B">False</SelectItem>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {form.watch('option_a') && (
                                                                    <SelectItem value="A">Option A</SelectItem>
                                                                )}
                                                                {form.watch('option_b') && (
                                                                    <SelectItem value="B">Option B</SelectItem>
                                                                )}
                                                                {form.watch('option_c') && (
                                                                    <SelectItem value="C">Option C</SelectItem>
                                                                )}
                                                                {form.watch('option_d') && (
                                                                    <SelectItem value="D">Option D</SelectItem>
                                                                )}
                                                                {form.watch('option_e') && (
                                                                    <SelectItem value="E">Option E</SelectItem>
                                                                )}
                                                            </>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject *</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    form.setValue('topic', '');
                                                }}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select subject" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {subjects.map(subject => (
                                                        <SelectItem key={subject.id} value={subject.id}>
                                                            {subject.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="topic"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Topic *</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={!form.watch('subject')}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select topic" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {topics
                                                        .filter(topic => topic.subject_id === form.watch('subject'))
                                                        .map(topic => (
                                                            <SelectItem key={topic.id} value={topic.id}>
                                                                {topic.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="difficulty_level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Difficulty Level *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select difficulty" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="easy">Easy</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="hard">Hard</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.get(route('mcqs.index'))}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? 'Creating...' : 'Create MCQ'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
