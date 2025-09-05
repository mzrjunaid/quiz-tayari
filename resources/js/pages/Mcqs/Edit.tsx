import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Mcqs } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Import the extracted components
import { Checkbox } from '@/components/ui/checkbox';
import { formSchema } from '@/types/zodSchema';
import { ClassificationSection } from '../../components/mcqComponents/ClassificationSection';
import { CorrectAnswerSection } from '../../components/mcqComponents/CorrectAnswerSection';
import { QuestionOptionsSection } from '../../components/mcqComponents/QuestionOptionsSection';
import { TagsExamTypesSection } from '../../components/mcqComponents/TagsExamTypesSection';

interface Props {
    mcq: Mcqs;
    rephrased?: string;
    explanation?: string;
    subject?: string;
    topic?: string;
    core_concept: string;
    tags_new: Array<{ id: string; name: string }>;
    exam_types_new: Array<{ id: string; name: string }>;
    subjects: Array<{ id: string; name: string }>;
    topics: Array<{ id: string; name: string; subject_id: string }>;
    tags: Array<{ id: string; name: string }>;
    exam_types: Array<{ id: string; name: string }>;
    questionTypes: Array<{ id: number; name: string; value: string }>;
    current_affair: string;
    general_knowledge: string;
}

// Enhanced validation schema with conditional validation

type FormValues = z.infer<typeof formSchema>;

export default function Edit({ mcq, subjects, subject, topics, topic, tags, exam_types, questionTypes, explanation, rephrased }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'MCQs List', href: route('mcqs.index') },
        { title: 'Show', href: route('mcqs.show', mcq.id) },
        { title: 'Create', href: route('mcqs.create') },
    ];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // State for dynamic items
    const [dynamicSubjects, setDynamicSubjects] = useState(subjects);
    const [dynamicTopics, setDynamicTopics] = useState(topics);
    const [dynamicTags, setDynamicTags] = useState(tags);
    const [dynamicExamTypes, setDynamicExamTypes] = useState(exam_types);
    const [isRephrasedAdded, setIsRephrasedAdded] = useState(false);

    // State for add new item forms
    const [showAddTag, setShowAddTag] = useState(false);
    const [showAddExamType, setShowAddExamType] = useState(false);

    // State for new item inputs
    const [newTagName, setNewTagName] = useState('');
    const [newExamTypeName, setNewExamTypeName] = useState('');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: mcq
            ? {
                  question: isRephrasedAdded ? rephrased : mcq.question,
                  explanation: explanation || '',
                  option_a: mcq.options.A || '',
                  option_b: mcq.options.B || '',
                  option_c: mcq.options.C || '',
                  option_d: mcq.options.D || '',
                  option_e: mcq.options.E || '',
                  correct_answer: mcq.correct_answer || 'A',
                  subject: mcq.subject || '',
                  topic: mcq.topic || '',
                  difficulty_level: mcq.difficulty_level || 'medium',
                  question_type: mcq.question_type || 'single',
                  tags: mcq.tags.map((tag) => tag) || [],
                  exam_types: mcq.exam_types.map((tag) => tag) || [],
                  //convert string to boolean
                  current_affair: mcq.current_affair || false,
                  general_knowledge: mcq.general_knowledge || false,
                  // question language
                  language: mcq.language || 'en',

                  is_rephrased_added: isRephrasedAdded,
              }
            : {
                  question: '',
                  explanation: '',
                  option_a: '',
                  option_b: '',
                  option_c: '',
                  option_d: '',
                  option_e: '',
                  correct_answer: 'A',
                  subject: '',
                  topic: '',
                  difficulty_level: 'medium',
                  question_type: 'single',
                  tags: [],
                  exam_types: [],
                  core_concept: '',
                  language: 'en',
                  current_affair: false,
                  general_knowledge: false,
                  is_rephrased_added: false,
              },
    });

    const currentQuestionType = form.watch('question_type');
    const currentSubject = form.watch('subject');
    const availableTopics = dynamicTopics.filter((topic) => topic.subject_id === currentSubject);

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

    const handleAddNewSubject = (name: string) => {
        const newSubject = {
            id: `new-${Date.now()}`,
            name: name,
        };
        setDynamicSubjects([...dynamicSubjects, newSubject]);
        form.setValue('subject', newSubject.name);
    };

    const handleAddNewTopic = (name: string, subjectId: string) => {
        const newTopic = {
            id: `new-${Date.now()}`,
            name: name,
            subject_id: subjectId,
        };
        setDynamicTopics([...dynamicTopics, newTopic]);
        form.setValue('topic', newTopic.name);
    };

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
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)(e);
                            }}
                            className="space-y-6"
                        >
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

                            {rephrased && (
                                <FormField
                                    control={form.control}
                                    name="is_rephrased_added"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center gap-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value || isRephrasedAdded}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(checked);
                                                        setIsRephrasedAdded(!!checked);
                                                        if (checked) {
                                                            form.setValue('question', rephrased || '');
                                                        } else {
                                                            form.setValue('question', mcq.question);
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel>Rephrased Question *</FormLabel>
                                            <FormDescription>Check if you want to add a rephrased version</FormDescription>
                                        </FormItem>
                                    )}
                                />
                            )}

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
                                onAddNewSubject={handleAddNewSubject}
                                onAddNewTopic={handleAddNewTopic}
                                subject={subject}
                                topic={topic}
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
