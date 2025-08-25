import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, OldMcqs } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Import the extracted components
import { ClassificationSection } from './components/ClassificationSection';
import { CorrectAnswerSection } from './components/CorrectAnswerSection';
import { QuestionOptionsSection } from './components/QuestionOptionsSection';
import { TagsExamTypesSection } from './components/TagsExamTypesSection';

interface Props {
    mcq: OldMcqs;
    rephrased?: string;
    explanation?: string;
    subject?: string;
    topic?: string;
    current_affair?: boolean;
    general_knowledge?: boolean;
    core_concept: string;
    tags_new: string[];
    exam_types_new: string[];
    subjects: Array<{ id: string; name: string }>;
    topics: Array<{ id: string; name: string; subject_id: string }>;
    tags: Array<{ id: string; name: string }>;
    exam_types: Array<{ id: string; name: string }>;
    questionTypes: Array<{ id: number; name: string; value: string }>;
}

// Enhanced validation schema with conditional validation
const formSchema = z
    .object({
        question: z.string().min(1, 'Question is required').min(10, 'Question must be at least 10 characters'),
        explanation: z.string().min(1, 'Explanation is required').min(10, 'Explanation must be at least 10 characters'),
        option_a: z.string().min(1, 'Option A is required'),
        option_b: z.string(),
        option_c: z.string(),
        option_d: z.string(),
        option_e: z.string(),
        correct_answer: z.union([
            z.enum(['A', 'B', 'C', 'D', 'E']),
            z.array(z.enum(['A', 'B', 'C', 'D', 'E'])).min(1, 'At least one correct answer is required'),
            z.string().min(1, 'Correct answer is required'),
        ]),
        subject: z.string().min(1, 'Subject is required'),
        topic: z.string().min(1, 'Topic is required'),
        difficulty_level: z.enum(['easy', 'medium', 'hard']),
        question_type: z.enum(['single', 'multiple', 'true_false', 'single_a']),
        tags: z.array(z.string()).min(1, 'At least one tag is required'),
        exam_types: z.array(z.string()),
    })
    .refine(
        (data) => {
            if (data.question_type === 'multiple') {
                return data.option_b && data.option_c && data.option_b.length > 0 && data.option_c.length > 0;
            }
            return true;
        },
        {
            message: 'Multiple choice questions require at least options A, B, and C',
            path: ['option_b'],
        },
    )
    .refine(
        (data) => {
            if (data.question_type === 'multiple' && Array.isArray(data.correct_answer)) {
                return data.correct_answer.length >= 2;
            }
            return true;
        },
        {
            message: 'Multiple choice questions must have at least 2 correct answers',
            path: ['correct_answer'],
        },
    );

type FormValues = z.infer<typeof formSchema>;

export default function Edit({
    mcq,
    subjects,
    topics,
    tags,
    exam_types,
    questionTypes,
    core_concept,
    exam_types_new,
    tags_new,
    current_affair,
    explanation,
    general_knowledge,
    rephrased,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'MCQs List', href: '/rephrase' },
        { title: 'Show', href: `/rephrase/${mcq?.q_id}` },
        { title: 'Create', href: `/rephrase/create` },
    ];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // State for dynamic items
    const [dynamicSubjects, setDynamicSubjects] = useState(subjects);
    const [dynamicTopics, setDynamicTopics] = useState(topics);
    const [dynamicTags, setDynamicTags] = useState(tags);
    const [dynamicExamTypes, setDynamicExamTypes] = useState(exam_types);

    // State for add new item forms
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [showAddTopic, setShowAddTopic] = useState(false);
    const [showAddTag, setShowAddTag] = useState(false);
    const [showAddExamType, setShowAddExamType] = useState(false);

    // State for new item inputs
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newTopicName, setNewTopicName] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [newExamTypeName, setNewExamTypeName] = useState('');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: mcq
            ? {
                  question: mcq.q_statement,
                  explanation: explanation || '',
                  option_a: mcq.option_A || '',
                  option_b: mcq.option_B || '',
                  option_c: mcq.option_C || '',
                  option_d: mcq.option_D || '',
                  option_e: '',
                  correct_answer: mcq.right_choice || 'A',
                  subject: '',
                  topic: '',
                  difficulty_level: 'medium',
                  question_type: 'single',
                  tags: [],
                  exam_types: [],
              }
            : undefined,
    });

    const currentQuestionType = form.watch('question_type');
    const currentSubject = form.watch('subject');
    const availableTopics = dynamicTopics.filter((topic) => topic.subject_id === currentSubject);

    // Helper functions for adding new items
    const addNewSubject = () => {
        if (newSubjectName.trim()) {
            const newId = `temp_${Date.now()}`;
            const newSubject = { id: newId, name: newSubjectName.trim() };
            setDynamicSubjects([...dynamicSubjects, newSubject]);
            form.setValue('subject', newId);
            setNewSubjectName('');
            setShowAddSubject(false);
        }
    };

    const addNewTopic = () => {
        if (newTopicName.trim() && currentSubject) {
            const newId = `temp_${Date.now()}`;
            const newTopic = {
                id: newId,
                name: newTopicName.trim(),
                subject_id: currentSubject,
            };
            setDynamicTopics([...dynamicTopics, newTopic]);
            form.setValue('topic', newId);
            setNewTopicName('');
            setShowAddTopic(false);
        }
    };

    const addNewTag = () => {
        if (newTagName.trim()) {
            const newTag = { id: `temp_${Date.now()}`, name: newTagName.trim() };
            setDynamicTags([...dynamicTags, newTag]);
            const currentTags = form.getValues('tags') || [];
            form.setValue('tags', [...currentTags, newTagName.trim()]);
            setNewTagName('');
            setShowAddTag(false);
        }
    };

    const addNewExamType = () => {
        if (newExamTypeName.trim()) {
            const newExamType = { id: `temp_${Date.now()}`, name: newExamTypeName.trim() };
            setDynamicExamTypes([...dynamicExamTypes, newExamType]);
            const currentExamTypes = form.getValues('exam_types') || [];
            form.setValue('exam_types', [...currentExamTypes, newExamTypeName.trim()]);
            setNewExamTypeName('');
            setShowAddExamType(false);
        }
    };

    // Helper function to reset form fields when question type changes
    const resetFieldsForQuestionType = (questionType: string) => {
        switch (questionType) {
            case 'true_false':
                form.setValue('option_a', 'True');
                form.setValue('option_b', 'False');
                form.setValue('option_c', '');
                form.setValue('option_d', '');
                form.setValue('option_e', '');
                form.setValue('correct_answer', 'A');
                break;
            case 'single_a':
                form.setValue('option_a', '');
                form.setValue('option_b', '');
                form.setValue('option_c', '');
                form.setValue('option_d', '');
                form.setValue('option_e', '');
                form.setValue('correct_answer', 'A');
                break;
            case 'multiple':
                form.setValue('correct_answer', []);
                break;
            case 'single':
                form.setValue('correct_answer', 'A');
                break;
            default:
                form.setValue('correct_answer', 'A');
        }
    };

    // Get available options for correct answer selection
    const getAvailableOptions = (): { value: string; label: string; content: string }[] => {
        const options: { value: string; label: string; content: string }[] = [];
        const optionValues = {
            A: form.watch('option_a'),
            B: form.watch('option_b'),
            C: form.watch('option_c'),
            D: form.watch('option_d'),
            E: form.watch('option_e'),
        };

        Object.entries(optionValues).forEach(([key, value]) => {
            if (value && value.trim()) {
                options.push({
                    value: key,
                    label: `Option ${key}`,
                    content: value.length > 30 ? `${value.substring(0, 30)}...` : value,
                });
            }
        });

        return options;
    };

    // Auto-save functionality
    const autoSaveDraft = debounce((data: FormValues) => {
        localStorage.setItem('mcq_draft', JSON.stringify(data));
    }, 1000);

    // Load draft on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('mcq_draft');
        if (savedDraft && !mcq) {
            const draft = JSON.parse(savedDraft);
            form.reset(draft);
        }
    }, [form, mcq]);

    // Watch form changes for auto-save
    useEffect(() => {
        const subscription = form.watch((data) => {
            autoSaveDraft(data as FormValues);
        });
        return () => subscription.unsubscribe();
    }, [autoSaveDraft, form]);

    // Reset form function
    const resetForm = () => {
        form.reset();
        setSubmitError(null);
        setShowAddTag(false);
        setShowAddExamType(false);
        setNewTagName('');
        setNewExamTypeName('');
        localStorage.removeItem('mcq_draft');
    };

    async function onSubmit(values: FormValues) {
        try {
            setIsSubmitting(true);
            setSubmitError(null);

            // Format the data based on question type
            const formattedValues = {
                ...values,
                correct_answer: Array.isArray(values.correct_answer) ? values.correct_answer : [values.correct_answer],
                ...(values.question_type === 'single_a' && {
                    option_b: '',
                    option_c: '',
                    option_d: '',
                    option_e: '',
                }),
                ...(values.question_type === 'true_false' && {
                    option_a: 'True',
                    option_b: 'False',
                    option_c: '',
                    option_d: '',
                    option_e: '',
                }),
            };

            await router.post(route('mcqs.store'), formattedValues);
            // Clear draft after successful submission
            localStorage.removeItem('mcq_draft');
        } catch (error) {
            setSubmitError('An error occurred while saving the MCQ. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create MCQ" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    {submitError && (
                        <Alert className="mb-6 border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
                            <AlertDescription>{submitError}</AlertDescription>
                        </Alert>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Question Type Selection */}
                            <FormField
                                control={form.control}
                                name="question_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Question Type *</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                resetFieldsForQuestionType(value);
                                            }}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select question type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {questionTypes.map((type) => (
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

                            {/* Question Text */}
                            <FormField
                                control={form.control}
                                name="question"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Question *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter your question (minimum 10 characters)"
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <div className="text-xs text-muted-foreground">{field.value.length}/10 minimum characters</div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Question Options Section */}
                            <QuestionOptionsSection form={form} currentQuestionType={currentQuestionType} />

                            {/* Correct Answer Section */}
                            <CorrectAnswerSection form={form} currentQuestionType={currentQuestionType} getAvailableOptions={getAvailableOptions} />

                            {/* Explanation */}
                            <FormField
                                control={form.control}
                                name="explanation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Explanation *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter detailed explanation for the correct answer (minimum 10 characters)"
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <div className="text-xs text-muted-foreground">{field.value.length}/10 minimum characters</div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Classification Section */}
                            <ClassificationSection
                                form={form}
                                subjects={subjects}
                                availableTopics={availableTopics}
                                currentSubject={currentSubject}
                            />

                            {/* Tags and Exam Types Section */}
                            <TagsExamTypesSection
                                form={form}
                                dynamicTags={dynamicTags}
                                dynamicExamTypes={dynamicExamTypes}
                                showAddTag={showAddTag}
                                showAddExamType={showAddExamType}
                                newTagName={newTagName}
                                newExamTypeName={newExamTypeName}
                                setShowAddTag={setShowAddTag}
                                setShowAddExamType={setShowAddExamType}
                                setNewTagName={setNewTagName}
                                setNewExamTypeName={setNewExamTypeName}
                                addNewTag={addNewTag}
                                addNewExamType={addNewExamType}
                            />

                            {/* Form Actions */}
                            <div className="flex flex-col-reverse justify-end gap-2 space-x-4 border-t pt-6 md:flex-row">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full md:w-auto"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to discard your changes?')) {
                                            resetForm();
                                        }
                                    }}
                                >
                                    Reset Form
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.get(route('mcqs.index'))}
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting} variant="default">
                                    {isSubmitting ? 'Creating...' : 'Create MCQ'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
