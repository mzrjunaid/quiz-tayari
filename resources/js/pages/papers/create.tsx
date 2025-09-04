import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DashboardLayout } from '@/layouts/dashboard/dashboard-layout';
import { BreadcrumbItem } from '@/types';
import { paperSchema } from '@/types/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

type FormValues = z.infer<typeof paperSchema>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Papers',
        href: '/papers',
    },
    {
        title: 'Add Paper',
        href: '/papers/create',
    },
];

interface CreatePaperProps {
    departments?: string[];
    subjects?: string[];
    commonTestingServices?: {
        short: string;
        long: string;
    }[];
}

export default function CreatePaper() {
    const { departments = [], subjects = [], commonTestingServices = [] } = usePage().props as CreatePaperProps;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(paperSchema),
        defaultValues: {
            title: '',
            description: '',
            testing_services: {
                short: '',
                long: '',
            },
            department: '',
            subject: '',
            scheduled_at: '',
        },
        mode: 'onChange',
    });

    // Auto-save draft functionality
    useEffect(() => {
        const subscription = form.watch((values) => {
            if (
                Object.values(values).some((val) =>
                    typeof val === 'string'
                        ? val.trim()
                        : typeof val === 'object' && val
                          ? Object.values(val).some((v) => v?.toString().trim())
                          : false,
                )
            ) {
                localStorage.setItem('papers_draft', JSON.stringify(values));
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    // Load draft on mount
    useEffect(() => {
        try {
            const draft = localStorage.getItem('papers_draft');
            if (draft) {
                const parsedDraft = JSON.parse(draft);
                form.reset(parsedDraft);
            }
        } catch (error) {
            console.warn('Failed to load draft:', error);
        }
    }, [form]);

    const resetForm = () => {
        form.reset({
            title: '',
            description: '',
            testing_services: { short: '', long: '' },
            department: '',
            subject: '',
            scheduled_at: '',
        });
        setSubmitError(null);
        localStorage.removeItem('papers_draft');
    };

    const handleTestingServiceChange = (shortValue: string) => {
        const selected = commonTestingServices.find((service) => service.short === shortValue);
        if (selected) {
            form.setValue('testing_services.short', selected.short);
            form.setValue('testing_services.long', selected.long);
        }
    };

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const parsed = paperSchema.parse(values);

            const formattedValues = {
                ...parsed,
                scheduled_at: new Date(parsed.scheduled_at).toISOString(),
            };

            await router.post(route('papers.store'), formattedValues, {
                onSuccess: () => {
                    localStorage.removeItem('papers_draft');
                },
                onError: (errors) => {
                    console.error('Server validation errors:', errors);

                    // Handle specific field errors
                    if (typeof errors === 'object' && errors) {
                        Object.entries(errors).forEach(([field, messages]) => {
                            if (Array.isArray(messages) && messages.length > 0) {
                                form.setError(field as keyof FormValues, {
                                    message: messages[0],
                                });
                            }
                        });
                    }

                    setSubmitError('Please check the form for errors and try again.');
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } catch (err) {
            if (err instanceof z.ZodError) {
                console.error('Validation errors:', err.flatten().fieldErrors);
                setSubmitError('Please fix the validation errors below.');
            } else {
                console.error('Unexpected error:', err);
                setSubmitError('An unexpected error occurred. Please try again.');
            }
            setIsSubmitting(false);
        }
    }

    // Format datetime for input (YYYY-MM-DDTHH:MM)
    const formatDatetimeLocal = (date: Date) => {
        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    // Get minimum datetime (current time + 1 hour)
    const getMinDatetime = () => {
        const now = new Date();
        now.setFullYear(now.getFullYear() - 10);
        return formatDatetimeLocal(now);
    };

    const titleLength = form.watch('title')?.length || 0;
    const descriptionLength = form.watch('description')?.length || 0;

    console.log(form.formState);

    return (
        <DashboardLayout title="Add Paper" breadcrumbs={breadcrumbs}>
            {submitError && (
                <Alert className="mb-6 border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
                    <AlertDescription>{submitError}</AlertDescription>
                </Alert>
            )}

            <div className="mx-auto max-w-2xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Paper Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Paper Title *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter paper title (minimum 10 characters)" {...field} />
                                    </FormControl>
                                    <div className="text-xs text-muted-foreground">{titleLength}/10 minimum characters</div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter paper description (optional)" className="min-h-[100px] resize-none" {...field} />
                                    </FormControl>
                                    <div className="text-xs text-muted-foreground">{descriptionLength} characters</div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Department */}
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department *</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            if (value === '__other__') {
                                                field.onChange(''); // clear value so input takes over
                                            } else {
                                                field.onChange(value);
                                            }
                                        }}
                                        value={departments.includes(field.value ?? '') ? field.value : '__other__'}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept} value={dept}>
                                                    {dept}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="__other__">Other...</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* If "Other..." selected, show manual input */}
                                    {!departments.includes(field.value ?? '') && (
                                        <Input
                                            placeholder="Enter department name"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className="mt-2"
                                        />
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Subject */}
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject *</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            if (value === '__other__') {
                                                field.onChange(''); // clear value so input takes over
                                            } else {
                                                field.onChange(value);
                                            }
                                        }}
                                        value={subjects.includes(field.value ?? '') ? field.value : '__other__'}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {subjects.map((sub) => (
                                                <SelectItem key={sub} value={sub}>
                                                    {sub}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="__other__">Other...</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* If "Other..." selected, show manual input */}
                                    {!subjects.includes(field.value ?? '') && (
                                        <Input
                                            placeholder="Enter subject name"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className="mt-2"
                                        />
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Testing Services */}
                        <FormField
                            control={form.control}
                            name="testing_services.short"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Testing Service *</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            if (value === '__other__') {
                                                form.setValue('testing_services.short', '');
                                                form.setValue('testing_services.long', '');
                                            } else {
                                                handleTestingServiceChange(value);
                                            }
                                        }}
                                        value={commonTestingServices.some((s) => s.short === field.value) ? field.value : '__other__'}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select testing service" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {commonTestingServices.map((service) => (
                                                <SelectItem key={service.short} value={service.short}>
                                                    {service.long}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="__other__">Other...</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* If "Other..." selected, show custom inputs */}
                                    {!commonTestingServices.some((s) => s.short === field.value) && (
                                        <div className="mt-2 space-y-2">
                                            <Input
                                                placeholder="Short name (e.g., PPSC)"
                                                value={form.watch('testing_services.short')}
                                                onChange={(e) => form.setValue('testing_services.short', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Full name (e.g., Punjab Public Service Commission)"
                                                value={form.watch('testing_services.long')}
                                                onChange={(e) => form.setValue('testing_services.long', e.target.value)}
                                            />
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Scheduled Date & Time */}
                        <FormField
                            control={form.control}
                            name="scheduled_at"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Scheduled Date & Time *</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" min={getMinDatetime()} {...field} />
                                    </FormControl>
                                    <div className="text-xs text-muted-foreground">Paper must be scheduled at least 1 hour from now</div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Form Actions */}
                        <div className="flex flex-col-reverse justify-end gap-3 border-t pt-6 md:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full md:w-auto"
                                onClick={() => {
                                    if (confirm('Are you sure you want to reset the form? All unsaved changes will be lost.')) {
                                        resetForm();
                                    }
                                }}
                                disabled={isSubmitting}
                            >
                                Reset Form
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.get(route('papers.index'))}
                                disabled={isSubmitting}
                                className="w-full md:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting || !form.formState.isValid} variant="default" className="w-full md:w-auto">
                                {isSubmitting ? 'Creating Paper...' : 'Create Paper'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </DashboardLayout>
    );
}
